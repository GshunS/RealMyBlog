using PersonalBlog.Models.Entities;
using PersonalBlog.Repository.PersonalBlog.IRepository;
using PersonalBlog.Service.PersonalBlog.IService;

namespace PersonalBlog.Service.PersonalBlog.Service;

public class ArticleService:BaseService<Article>, IArticleService
{
    private readonly IArticleRepository _iArticleRepository;
    public ArticleService(IArticleRepository iArticleRepository)
    {
        base._iBaseRepository = iArticleRepository;
        _iArticleRepository = iArticleRepository;
    }
    
}
