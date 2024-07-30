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

    public async Task<List<CategoryRepoDisplayDTO>> GetFirstCategoryAsync()
    {
        try
        {
            var result = await _dbContext
                .Set<Category>()
                .Select(g => new CategoryRepoDisplayDTO
                {
                    Id = g.id,
                    CategoryName = g.first_category,
                    ChildrenCategoryName = g.second_category
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

    public async Task<List<CategoryRepoDisplayDTO>> GetSecondCategoryAsync(string first_category)
    {
        try
        {
            var result = await _dbContext
                .Set<Category>()
                .Where(c => c.first_category == first_category)
                .Select(g => new CategoryRepoDisplayDTO
                {
                    Id = g.id,
                    CategoryName = g.second_category,
                    ChildrenCategoryName = g.third_category
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

    public async Task<List<CategoryRepoDisplayDTO>> GetThirdCategoryAsync(string first_category, string second_category)
    {
        try
        {
            var result = await _dbContext
                .Set<Category>()
                .Where(c => c.first_category == first_category && c.second_category == second_category)
                .Select(g => new CategoryRepoDisplayDTO
                {
                    Id = g.id,
                    CategoryName = g.third_category,
                    ChildrenCategoryName = g.fourth_category
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
