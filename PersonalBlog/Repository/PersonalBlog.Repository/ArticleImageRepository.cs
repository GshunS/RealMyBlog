using PersonalBlog.CustomException;
using PersonalBlog.Models;
using PersonalBlog.Models.Entities;
using PersonalBlog.Repository.PersonalBlog.IRepository;
using Microsoft.EntityFrameworkCore;
using EFCore.BulkExtensions;
using PersonalBlog.DTO.Display;
namespace PersonalBlog.Repository.PersonalBlog.Repository;

public class ArticleImageRepository : BaseRepository<ArticleImage>, IArticleImageRepository
{
    private readonly BloggingContext _dbContext;
    public ArticleImageRepository(BloggingContext bloggingContext) : base(bloggingContext)
    {
        this._dbContext = bloggingContext;
    }

    public async Task<bool> BulkDeleteImagesByArticleIdAndHashvalues(int id, List<string> hashvalues)
    {
        try
        {
            var imagesToDelete = await _dbContext
                .Set<ArticleImage>()
                .Where(c => c.article_id == id && hashvalues.Contains(c.image_hashvalue))
                .ToListAsync();

            await _dbContext.BulkDeleteAsync(imagesToDelete);
            return true;
        }
        catch (Exception e)
        {
            throw new RepositoryException(e.Message);
        }
    }

    public async Task<List<ArticleImagePathHashDisplayDTO>> GetImagesHashAndPathByArticleIdAsync(int id)
    {
        try
        {
            var result = await _dbContext
                .Set<ArticleImage>()
                .Where(c => c.article_id == id)
                .Select(col => new ArticleImagePathHashDisplayDTO
                {
                    image_hashvalue = col.image_hashvalue,
                    image_path = col.image_path
                })
                .ToListAsync();

            return result;
        }
        catch (Exception e)
        {
            throw new RepositoryException(e.Message);
        }
    }

    public async Task<List<string>> GetImagesHashValueByArticleIdAsync(int id)
    {
        try
        {
            var result = await _dbContext
                .Set<ArticleImage>()
                .Where(c => c.article_id == id)
                .Select(col => col.image_hashvalue)
                .ToListAsync();

            return result;
        }
        catch (Exception e)
        {
            throw new RepositoryException(e.Message);
        }
    }

}
