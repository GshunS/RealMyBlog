using PersonalBlog.CustomException;
using PersonalBlog.DTO.Update;
using PersonalBlog.Models.Entities;
using PersonalBlog.Repository.PersonalBlog.IRepository;
using PersonalBlog.Service.PersonalBlog.IService;

namespace PersonalBlog.Service.PersonalBlog.Service;

public class ArticleService : BaseService<Article>, IArticleService
{
    private readonly IArticleRepository _iArticleRepository;
    public ArticleService(IArticleRepository iArticleRepository)
    {
        base._iBaseRepository = iArticleRepository;
        _iArticleRepository = iArticleRepository;
    }

    public Task<List<Article>> FullTextSearchAsync(string searchStr)
    {
        try
        {
            return _iArticleRepository.FullTextSearchAsync(searchStr);
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
