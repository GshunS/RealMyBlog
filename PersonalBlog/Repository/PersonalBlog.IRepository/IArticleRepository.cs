using PersonalBlog.Models.Entities;

namespace PersonalBlog.Repository.PersonalBlog.IRepository;

public interface IArticleRepository:IBaseRepository<Article>
{
    // full text search
    Task<List<Article>> FullTextSearchAsync(string searchStr);
}
