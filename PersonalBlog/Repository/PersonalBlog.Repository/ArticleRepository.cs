using PersonalBlog.Models;
using PersonalBlog.Models.Entities;
using PersonalBlog.Repository.PersonalBlog.IRepository;

namespace PersonalBlog.Repository.PersonalBlog.Repository;

public class ArticleRepository:BaseRepository<Article>, IArticleRepository
{
    public ArticleRepository(BloggingContext bloggingContext) : base(bloggingContext)
    {
        
    }
}
