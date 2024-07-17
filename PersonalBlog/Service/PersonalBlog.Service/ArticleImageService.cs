using PersonalBlog.Models.Entities;
using PersonalBlog.Repository.PersonalBlog.IRepository;
using PersonalBlog.Service.PersonalBlog.IService;

namespace PersonalBlog.Service.PersonalBlog.Service;

public class ArticleImageService:BaseService<ArticleImage>, IArticleImageService
{
    private readonly IArticleImageRepository _iArticleImageRepository;
    public ArticleImageService(IArticleImageRepository iArticleImageRepository)
    {
        base._iBaseRepository = iArticleImageRepository;
        _iArticleImageRepository = iArticleImageRepository;
    }
}
