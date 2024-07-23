using Microsoft.EntityFrameworkCore;
using PersonalBlog.CustomException;
using PersonalBlog.Models;
using PersonalBlog.Models.Entities;
using PersonalBlog.Repository.PersonalBlog.IRepository;

namespace PersonalBlog.Repository.PersonalBlog.Repository;

public class ArticleRepository : BaseRepository<Article>, IArticleRepository
{
    private readonly BloggingContext _dbContext;
    public ArticleRepository(BloggingContext bloggingContext) : base(bloggingContext)
    {
        this._dbContext = bloggingContext;
    }

    public async Task<List<Article>> FullTextSearchAsync(string searchStr)
    {
        try
        {
            var results = await _dbContext.Set<Article>()
            .FromSqlRaw(
        "SELECT * FROM article WHERE MATCH(Content) AGAINST ({0} IN NATURAL LANGUAGE MODE)", searchStr)
            .ToListAsync();
            return results;
        }
        catch (Exception ex)
        {
            throw new RepositoryException(ex.Message);
        }

    }

}
