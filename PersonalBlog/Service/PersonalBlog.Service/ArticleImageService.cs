using PersonalBlog.Models.Entities;
using PersonalBlog.Service.PersonalBlog.IService;

namespace PersonalBlog.Service.PersonalBlog.Service;

public class ArticleImageService:BaseService<ArticleImage>, IArticleImageService
{
    private readonly IArticleImageService _iArticleImageService;
    public ArticleImageService(IArticleImageService iArticleImageService)
    {
        base._iBaseService = iArticleImageService;
        _iArticleImageService = iArticleImageService;
    }
}
