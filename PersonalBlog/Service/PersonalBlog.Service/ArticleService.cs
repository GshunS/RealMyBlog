using AutoMapper;
using PersonalBlog.CustomException;
using PersonalBlog.DTO.Display;
using PersonalBlog.DTO.Update;
using PersonalBlog.Models.Entities;
using PersonalBlog.Repository.PersonalBlog.IRepository;
using PersonalBlog.Service.PersonalBlog.IService;

namespace PersonalBlog.Service.PersonalBlog.Service;

public class ArticleService : BaseService<Article>, IArticleService
{
    private readonly IArticleRepository _iArticleRepository;
    private readonly ICategoryRepository _iCategoryRepository;
    private IMapper _iMapper;
    public ArticleService(IArticleRepository iArticleRepository, ICategoryRepository iCategoryRepository, IMapper iMapper)
    {
        base._iBaseRepository = iArticleRepository;
        _iCategoryRepository = iCategoryRepository;
        _iArticleRepository = iArticleRepository;
        this._iMapper = iMapper;
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
                foreach(var term in searchStr.Split(" ")){
                    index = content.IndexOf(term.Trim(), StringComparison.OrdinalIgnoreCase);
                    if(index != -1){
                        break;
                    }
                }
                
                int beforePuncIndex = -1;
                int afterPuncIndex = -1;
                for (int i = index; i > 0 ; i--){
                    Char c = content[i];
                    if(Char.IsPunctuation(c)){
                        beforePuncIndex = i;
                        break;
                    }
                }

                for (int i = index; i < content.Length ; i++){
                    Char c = content[i];
                    if(Char.IsPunctuation(c)){
                        afterPuncIndex = i;
                        break;
                    }
                }
                if(beforePuncIndex != -1){
                    beforePuncIndex += 2;
                }else{
                    beforePuncIndex = 0;
                }
                if(afterPuncIndex == -1){
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


    public async Task<bool> UpdateCommon(ArticleUpdateDTO articleUpdateDTO)
    {
        try
        {
            var oldArticle = await _iArticleRepository.QueryOneByIdAsync(articleUpdateDTO.id);

            oldArticle.title = articleUpdateDTO.title;
            oldArticle.upvote_count = articleUpdateDTO.upvote_count;
            oldArticle.view_count = articleUpdateDTO.view_count;
            oldArticle.is_hide = articleUpdateDTO.is_hide;
            oldArticle.category_id = articleUpdateDTO.category_id;

            return await _iArticleRepository.DbSaveAllChanges();
        }
        catch (RepositoryException ex)
        {
            throw new RepositoryException(ex.Message);
        }
    }


}
