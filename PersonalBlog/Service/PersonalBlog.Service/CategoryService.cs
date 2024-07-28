using AutoMapper;
using PersonalBlog.CustomException;
using PersonalBlog.DTO.Display;
using PersonalBlog.Models.Entities;
using PersonalBlog.Repository.PersonalBlog.IRepository;
using PersonalBlog.Service.PersonalBlog.IService;

namespace PersonalBlog.Service.PersonalBlog.Service;

public class CategoryService : BaseService<Category>, ICategoryService
{
    private readonly ICategoryRepository _iCategoryRepository;
    private readonly IArticleRepository _iArticleRepository;
    private readonly IMapper _iMapper;
    public CategoryService(ICategoryRepository iCategoryRepository, IArticleRepository iArticleRepository, IMapper iMapper)
    {
        base._iBaseRepository = iCategoryRepository;
        _iCategoryRepository = iCategoryRepository;
        _iArticleRepository = iArticleRepository;
        _iMapper = iMapper;
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

            oldCategory.first_category = category.first_category;
            oldCategory.second_category = category.second_category;
            oldCategory.third_category = category.third_category;
            oldCategory.fourth_category = category.fourth_category;

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

            if (res == null)
            {
                return true;
            }
            throw new ServiceException("Category has already existed");
        }
        catch (RepositoryException ex)
        {
            throw new RepositoryException(ex.Message);
        }

    }

    public async Task<List<string>> GetFirstCategory()
    {
        try
        {
            return await _iCategoryRepository.GetFirstCategoryAsync();
        }
        catch (RepositoryException ex)
        {
            throw new RepositoryException(ex.Message);
        }

    }

    public async Task<CategoryChildrenDisplayDTO> GetSecondCategory(string first_category)
    {
        try
        {
            List<string> categoryNames = new();
            List<ArticleForCategoryDisplayDTO> articleList = new();
            var res = await _iCategoryRepository.GetSecondCategoryAsync(first_category);
            foreach(var item in res)
            {
                if(item.Value == null)
                {
                    var articles = await _iArticleRepository.QueryMultipleByCondition(c=>c.category_id == item.Key);
                    foreach(var article in articles)
                    {
                        var convert_article = _iMapper.Map<ArticleForCategoryDisplayDTO>(article);
                        articleList.Add(convert_article);
                    }
                }
                else{
                    categoryNames.Add(item.Value);
                }
            }
            return new CategoryChildrenDisplayDTO
            {
                CategoryNames = categoryNames,
                Articles = articleList
            };
        }
        catch (RepositoryException ex)
        {
            throw new RepositoryException(ex.Message);
        }
        catch (Exception ex)
        {
            throw new ServiceException(ex.Message);
        }
    }
}
