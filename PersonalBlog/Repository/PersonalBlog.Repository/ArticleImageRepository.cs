using PersonalBlog.Models;
using PersonalBlog.Models.Entities;
using PersonalBlog.Repository.PersonalBlog.IRepository;

namespace PersonalBlog.Repository.PersonalBlog.Repository;

public class ArticleImageRepository: BaseRepository<ArticleImage>, IArticleImageRepository
{
    public ArticleImageRepository(BloggingContext bloggingContext) : base(bloggingContext)
    {
        
    }
}
