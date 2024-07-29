using Microsoft.EntityFrameworkCore;
using PersonalBlog.CustomException;
using PersonalBlog.DTO.Display;
using PersonalBlog.Models;
using PersonalBlog.Models.Entities;
using PersonalBlog.Repository.PersonalBlog.IRepository;

namespace PersonalBlog.Repository.PersonalBlog.Repository;

public class CategoryRepository : BaseRepository<Category>, ICategoryRepository
{
    private readonly BloggingContext _dbContext;
    public CategoryRepository(BloggingContext bloggingContext) : base(bloggingContext)
    {
        this._dbContext = bloggingContext;
    }

    public async Task<List<CategoryCountDTO>> GetFirstCategoryAsync()
    {
        try
        {
            var result = await _dbContext
                .Set<Category>()
                .GroupBy(c => c.first_category)
                .Select(g => new CategoryCountDTO
                {
                    CategoryName = g.Key,
                    ChildrenCategoryCount = g.Count(c => c.second_category != null)
                })
                .OrderBy(c => c.CategoryName)
                .ToListAsync();

            return result;
        }
        catch (Exception e)
        {
            throw new RepositoryException(e.Message);
        }
    }

    public async Task<List<Category>> GetSecondCategoryAsync(string category1)
    {
        try
        {
            var result = await _dbContext
                .Set<Category>()
                .Where(c => c.first_category == category1)
                .Select(c => new Category
                {
                    id = c.id,
                    second_category = c.second_category,
                    third_category = c.third_category
                })
                .OrderBy(c => c.second_category)
                .ToListAsync();

            return result;
        }
        catch (Exception e)
        {
            throw new RepositoryException(e.Message);
        }
    }

    public async Task<List<Category>> GetThirdCategoryAsync(string category1, string category2)
    {
        try
        {
            var result = await _dbContext
                .Set<Category>()
                .Where(c => c.first_category == category1 && c.second_category == category2)
                .Select(c => new Category
                {
                    id = c.id,
                    second_category = c.third_category,
                    third_category = c.fourth_category
                })
                .OrderBy(c => c.second_category)
                .ToListAsync();

            return result;
        }
        catch (Exception e)
        {
            throw new RepositoryException(e.Message);
        }
    }


    public async Task<Dictionary<int, string?>> GetFourthCategoryAsync(string category1, string category2, string category3)
    {
        try
        {
            var result = await _dbContext
                .Set<Category>()
                .Where(c => c.first_category == category1 && c.second_category == category2 && c.third_category == category3)
                .Select(c => new { c.id, c.fourth_category })
                .ToListAsync();

            return result.ToDictionary(x => x.id, x => x.fourth_category);
        }
        catch (Exception e)
        {
            throw new RepositoryException(e.Message);
        }
    }




}
