using PersonalBlog.Models.Entities;
using PersonalBlog.Service.PersonalBlog.IService;

namespace PersonalBlog.Service.PersonalBlog.Service;

public class ArticleService:BaseService<Article>, IArticleService
{
    private readonly IArticleService _iArticleService;
    public ArticleService(IArticleService iArticleService)
    {
        base._iBaseService = iArticleService;
        _iArticleService = iArticleService;
    }
}
