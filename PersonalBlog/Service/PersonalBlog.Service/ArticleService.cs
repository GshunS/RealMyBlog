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
    private IMapper _iMapper;
    public ArticleService(IArticleRepository iArticleRepository, IMapper iMapper)
    {
        base._iBaseRepository = iArticleRepository;
        _iArticleRepository = iArticleRepository;
        this._iMapper = iMapper;
    }

    public async Task<List<ArticleDisplayDTO>> FullTextSearchAsync(string searchStr)
    {
        try
        {
            var articles = await _iArticleRepository.FullTextSearchAsync(searchStr);
            List<ArticleDisplayDTO> res = new();
            foreach (var article in articles)
            {
                var art = _iMapper.Map<ArticleDisplayDTO>(article);
                var content = art.content;
                int index = content.IndexOf(searchStr, StringComparison.OrdinalIgnoreCase);
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

                art.part_content = content[beforePuncIndex..afterPuncIndex];
                res.Add(art);
            }
            return res;
        }
        catch (RepositoryException ex)
        {
            throw new RepositoryException(ex.Message);
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
