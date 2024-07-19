using PersonalBlog.CustomException;
using PersonalBlog.Models.Entities;
using PersonalBlog.Repository.PersonalBlog.IRepository;
using PersonalBlog.Service.PersonalBlog.IService;

namespace PersonalBlog.Service.PersonalBlog.Service;

public class CategoryService : BaseService<Category>, ICategoryService
{
    private readonly ICategoryRepository _iCategoryRepository;
    public CategoryService(ICategoryRepository iCategoryRepository)
    {
        base._iBaseRepository = iCategoryRepository;
        _iCategoryRepository = iCategoryRepository;
    }

    public async Task<bool> AddCategory(Category category)
    {
        try
        {
            await CheckExistCategory(category);
            return await _iCategoryRepository.CreateOneAsync(category);
        }
        catch (ServiceException e)
        {
            throw new ServiceException(e.Message);
        }
        catch (RepositoryException e)
        {
            throw new RepositoryException(e.Message);
        }
    }

    public async Task<bool> UpdateCategory(Category category)
    {
        try
        {
            var oldCategory = await _iCategoryRepository.QueryOneByIdAsync(category.id);
            await CheckExistCategory(category);

            oldCategory = category;

            return await _iCategoryRepository.DbSaveAllChanges();
        }
        catch (ServiceException e)
        {
            throw new ServiceException(e.Message);
        }
        catch (RepositoryException e)
        {
            throw new RepositoryException(e.Message);
        }
    }

    public async Task<bool> CheckExistCategory(Category category)
    {
        try
        {
            var res = await _iCategoryRepository.QueryOneByConditionAsync(
            c => c.first_category == category.first_category &&
            c.second_category == category.second_category &&
            c.third_category == category.third_category &&
            c.fourth_category == category.fourth_category);

            if(res == null){
                return true;
            }
            throw new ServiceException("Category has already existed");
        }
        catch (RepositoryException ex)
        {
            throw new RepositoryException(ex.Message);
        }

    }

    
}
