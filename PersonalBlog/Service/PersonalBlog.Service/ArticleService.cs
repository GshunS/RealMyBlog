using PersonalBlog.CustomException;
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

    public async Task<bool> UpdateHidenStatus(int id)
    {
        try
        {
            var oldArticle = await _iArticleRepository.QueryOneByIdAsync(id);
            oldArticle.is_hide = !oldArticle.is_hide;
            return await _iArticleRepository.DbSaveAllChanges();
        }
        catch (RepositoryException ex)
        {
            throw new RepositoryException(ex.Message);
        }
    }

    public async Task<bool> UpdateTitle(int id, string newTitle)
    {
        try
        {
            var oldArticle = await _iArticleRepository.QueryOneByIdAsync(id);
            oldArticle.title = newTitle;
            return await _iArticleRepository.DbSaveAllChanges();
        }
        catch (RepositoryException ex)
        {
            throw new RepositoryException(ex.Message);
        }
    }

    public async Task<bool> UpdateUpvoteAmount(int id, int newUpvote)
    {
        try
        {
            var oldArticle = await _iArticleRepository.QueryOneByIdAsync(id);
            oldArticle.upvote_count = newUpvote;
            return await _iArticleRepository.DbSaveAllChanges();
        }
        catch (RepositoryException ex)
        {
            throw new RepositoryException(ex.Message);
        }
    }

    public async Task<bool> UpdateViewAmount(int id, int newView)
    {
        try
        {
            var oldArticle = await _iArticleRepository.QueryOneByIdAsync(id);
            oldArticle.view_count = newView;
            return await _iArticleRepository.DbSaveAllChanges();
        }
        catch (RepositoryException ex)
        {
            throw new RepositoryException(ex.Message);
        }
    }

}
