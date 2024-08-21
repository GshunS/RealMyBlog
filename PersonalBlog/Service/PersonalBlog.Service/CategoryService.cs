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

    public Dictionary<string, bool> HasChildren(List<CategoryRepoDisplayDTO> categories)
    {
        Dictionary<string, bool> categoryDict = new();
        foreach (var category in categories)
        {
            if (category.CategoryName == null)
            {
                continue;
            }
            if (categoryDict.ContainsKey(category.CategoryName))
            {
                if (categoryDict[category.CategoryName] != false)
                {
                    continue;
                }
                categoryDict[category.CategoryName] = category.ChildrenCategoryName != null;
            }
            else
            {
                categoryDict.Add(category.CategoryName, category.ChildrenCategoryName != null);
            }

        }
        return categoryDict;
    }

    public async Task<Dictionary<string, Dictionary<int, string>>> GetArticleInfo(List<CategoryRepoDisplayDTO> categories)
    {
        Dictionary<string, Dictionary<int, string>> articleDict = new();
        foreach (var item in categories)
        {
            if (item.CategoryName == null)
            {
                continue;
            }
            if (item.ChildrenCategoryName == null)
            {
                var articles = await _iArticleRepository.QueryMultipleByCondition(c => c.category_id == item.Id && !c.is_hide);
                if (articles.Count != 0)
                {
                    if (!articleDict.ContainsKey(item.CategoryName))
                    {
                        articleDict.Add(item.CategoryName, new());
                    }
                    foreach (var article in articles)
                    {
                        articleDict[item.CategoryName].Add(article.id, article.title);
                    }
                }

            }
        }
        return articleDict;
    }

    public async Task<Dictionary<string, CategoryChildrenDisplayDTO>> GetCategoryDataTemplate(List<CategoryRepoDisplayDTO> categories)
    {
        Dictionary<string, CategoryChildrenDisplayDTO> categoryDict = new();

        // check if category has children
        Dictionary<string, bool> hasChildrenDict = HasChildren(categories);

        // check if category has articles
        Dictionary<string, Dictionary<int, string>> articleDict = await GetArticleInfo(categories);

        foreach (string categoryName in hasChildrenDict.Keys)
        {

            categoryDict.Add(categoryName, new CategoryChildrenDisplayDTO
            {
                HasChildren = articleDict.ContainsKey(categoryName) ? true : hasChildrenDict[categoryName],
                SubCategories = null,
                Articles = articleDict.ContainsKey(categoryName) ? articleDict[categoryName] : null
            });


        }
        return categoryDict;
    }

    public async Task<Dictionary<string, CategoryChildrenDisplayDTO>> GetFirstCategory()
    {
        try
        {
            var categories = await _iCategoryRepository.GetFirstCategoryAsync();
            return await GetCategoryDataTemplate(categories);
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

    public async Task<Dictionary<string, CategoryChildrenDisplayDTO>> GetSecondCategory(string first_category)
    {
        try
        {
            var categories = await _iCategoryRepository.GetSecondCategoryAsync(first_category);
            return await GetCategoryDataTemplate(categories);
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

    public async Task<Dictionary<string, CategoryChildrenDisplayDTO>> GetThirdCategory(string first_category, string second_category)
    {
        try
        {
            var categories = await _iCategoryRepository.GetThirdCategoryAsync(first_category, second_category);
            return await GetCategoryDataTemplate(categories);
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

    public async Task<Dictionary<string, CategoryChildrenDisplayDTO>> GetFourthCategory(string first_category, string second_category, string third_category)
    {
        try
        {
            var categories = await _iCategoryRepository.GetFourthCategoryAsync(first_category, second_category, third_category);
            return await GetCategoryDataTemplate(categories);
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
