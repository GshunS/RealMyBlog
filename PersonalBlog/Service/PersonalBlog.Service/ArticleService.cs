using AutoMapper;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Newtonsoft.Json.Linq;
using PersonalBlog.CustomException;
using PersonalBlog.DTO.Display;
using PersonalBlog.DTO.Update;
using PersonalBlog.Models;
using PersonalBlog.Models.Entities;
using PersonalBlog.MyUtils.MyEncrypt;
using PersonalBlog.Repository.PersonalBlog.IRepository;
using PersonalBlog.Service.PersonalBlog.IService;
using System.Text.RegularExpressions;
namespace PersonalBlog.Service.PersonalBlog.Service;

public class ArticleService : BaseService<Article>, IArticleService
{
    private readonly IArticleRepository _iArticleRepository;
    private readonly ICategoryRepository _iCategoryRepository;
    private readonly IArticleImageRepository _iArticleImageRepository;
    private IMapper _iMapper;
    private readonly IWebHostEnvironment _env;
    private readonly BloggingContext _dbContext;
    public ArticleService(IArticleRepository iArticleRepository, ICategoryRepository iCategoryRepository, IArticleImageRepository iArticleImageRepository, IMapper iMapper, IWebHostEnvironment env, BloggingContext dbContext)
    {
        base._iBaseRepository = iArticleRepository;
        _iCategoryRepository = iCategoryRepository;
        _iArticleRepository = iArticleRepository;
        _iArticleImageRepository = iArticleImageRepository;
        this._iMapper = iMapper;
        _dbContext = dbContext;
        _env = env;
    }

    public async Task<List<ArticleDisplayDTO>> FullTextSearchAsync(string searchStr)
    {
        try
        {
            // get all articles that contain searchStr
            var articles = await _iArticleRepository.FullTextSearchAsync(searchStr);
            List<ArticleDisplayDTO> res = new();
            foreach (var article in articles)
            {
                // get category of article
                Category cate = await _iCategoryRepository.QueryOneByIdAsync(article.category_id);
                article.category = cate;
                var art = _iMapper.Map<ArticleDisplayDTO>(article);

                // get the part of content that contains searchStr
                var content = art.content;
                int index = -1;
                foreach (var term in searchStr.Split(" "))
                {
                    index = content.IndexOf(term.Trim(), StringComparison.OrdinalIgnoreCase);
                    if (index != -1)
                    {
                        break;
                    }
                }

                int beforePuncIndex = -1;
                int afterPuncIndex = -1;
                for (int i = index; i > 0; i--)
                {
                    Char c = content[i];
                    if (Char.IsPunctuation(c))
                    {
                        beforePuncIndex = i;
                        break;
                    }
                }

                for (int i = index; i < content.Length; i++)
                {
                    Char c = content[i];
                    if (Char.IsPunctuation(c))
                    {
                        afterPuncIndex = i;
                        break;
                    }
                }
                if (beforePuncIndex != -1)
                {
                    beforePuncIndex += 2;
                }
                else
                {
                    beforePuncIndex = 0;
                }
                if (afterPuncIndex == -1)
                {
                    afterPuncIndex = content.Length;
                }

                // get the part of content that contains searchStr
                art.part_content = content[beforePuncIndex..afterPuncIndex];
                res.Add(art);
            }
            return res;
        }
        catch (RepositoryException ex)
        {
            throw new RepositoryException(ex.Message);
        }
        catch (Exception)
        {
            throw new Exception();
        }

    }
    private void ReplaceImageSrc(JObject jsonContent, List<string> images_hash)
    {
        int index = 0;
        void traverse(JObject currentJson)
        {
            if (currentJson.ContainsKey("type"))
            {
                if (currentJson.Value<string>("type") == "image")
                {
                    if (currentJson["attrs"]?["src"] != null)
                    {
                        currentJson["attrs"]["src"] = images_hash[index];
                        index++;
                    }
                }
                else
                {
                    if (currentJson.ContainsKey("content"))
                    {
                        foreach (var subJson in currentJson["content"])
                        {
                            if (subJson is JObject obj)
                            {
                                traverse(obj);
                            }
                        }
                    }
                }

            }
        }
        traverse(jsonContent);
    }

    public async Task<DateTime> UpdateArticleContentAsync(int id, string textContent, JObject jsonContent, List<IFormFile> images)
    {
        try
        {
            // get all articles hashvalue of article id: id
            List<ArticleImagePathHashDisplayDTO> dbImageInfos = await _iArticleImageRepository.GetImagesHashAndPathByArticleIdAsync(id);
            var dbImageInfoDict = dbImageInfos.ToDictionary(item => item.image_hashvalue, item => item.image_path);

            List<ArticleImage> insertImages = new();
            HashSet<string> repeatImages = new();

            // Directory where saved images
            string uploadPath = Path.Combine(_env.ContentRootPath, "Upload/Images");
            List<string> images_hash = new();

            // create if not exist
            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }

            // if there are images in uploaded content
            if (images.Count != 0)
            {
                foreach (IFormFile file in images)
                {
                    // only valid images
                    if (file.Length > 0)
                    {
                        // compute md5 
                        string fileHash = FileMD5Helper.CalculateFileMD5(file);
                        images_hash.Add(fileHash);
                        // only save file if that is a new one
                        if (!dbImageInfoDict.ContainsKey(fileHash) && !repeatImages.Contains(fileHash))
                        {
                            repeatImages.Add(fileHash);
                            string fileExtension = Path.GetExtension(file.FileName);

                            // append article id to ensure no overwrite
                            var filePath = Path.Combine(uploadPath, $"{id}_{fileHash}{fileExtension}");
                            insertImages.Add(new ArticleImage
                            {
                                image_path = filePath,
                                image_hashvalue = fileHash,
                                article_id = id
                            });

                            using (var stream = new FileStream(filePath, FileMode.Create))
                            {
                                await file.CopyToAsync(stream);
                            }
                        }

                    }
                }
                // replace src in json to image url
                ReplaceImageSrc(jsonContent, images_hash);
            }

            // delete images if needed
            List<string> hashToDelete = new();
            foreach (string databaseHash in dbImageInfoDict.Keys)
            {
                if (!images_hash.Contains(databaseHash))
                {
                    hashToDelete.Add(databaseHash);
                }
            }

            DateTime updatedDate = DateTime.Now;
            // start a transaction
            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                // update content and json content
                var oldArticle = await _iArticleRepository.QueryOneByIdAsync(id);
                oldArticle.content = textContent;
                oldArticle.json_content = jsonContent.ToString();
                await _iArticleRepository.UpdateOneAsync(oldArticle);

                // if new content have images, insert images
                if (insertImages.Count != 0)
                {
                    await _iArticleImageRepository.CreateMultipleAsync(insertImages);
                }

                // delete images if needed
                if (hashToDelete.Count != 0)
                {
                    await _iArticleImageRepository.BulkDeleteImagesByArticleIdAndHashvalues(id, hashToDelete);
                }
                await transaction.CommitAsync();

                updatedDate = (DateTime)oldArticle.update_time;

                // delete images locally
                foreach (var hash in hashToDelete)
                {
                    var filePath = dbImageInfoDict[hash];
                    if (File.Exists(filePath))
                    {
                        File.Delete(filePath);
                    }
                }
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }



            return updatedDate;
        }
        catch (RepositoryException ex)
        {
            throw new RepositoryException(ex.Message);
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }


    // public async Task<bool> UpdateCommon(ArticleUpdateDTO articleUpdateDTO)
    // {
    //     try
    //     {
    //         var oldArticle = await _iArticleRepository.QueryOneByIdAsync(articleUpdateDTO.id);

    //         oldArticle.title = articleUpdateDTO.title;
    //         oldArticle.upvote_count = articleUpdateDTO.upvote_count;
    //         oldArticle.view_count = articleUpdateDTO.view_count;
    //         oldArticle.is_hide = articleUpdateDTO.is_hide;
    //         oldArticle.category_id = articleUpdateDTO.category_id;

    //         return await _iArticleRepository.DbSaveAllChanges();
    //     }
    //     catch (RepositoryException ex)
    //     {
    //         throw new RepositoryException(ex.Message);
    //     }
    // }



}
