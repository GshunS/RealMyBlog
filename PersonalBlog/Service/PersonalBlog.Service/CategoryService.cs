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

    public Dictionary<string, bool> HasChildren(List<Category> categories)
    {
        Dictionary<string, bool> categoryDict = new();
        foreach (var category in categories)
        {
            if (category.second_category == null)
            {
                continue;
            }
            if (categoryDict.ContainsKey(category.second_category))
            {
                if (categoryDict[category.second_category] != false)
                {
                    continue;
                }
                categoryDict[category.second_category] = category.third_category != null;
            }
            else
            {
                categoryDict.Add(category.second_category, category.third_category != null);
            }

        }
        return categoryDict;
    }

    public async Task<List<ArticleForCategoryDisplayDTO>> GetArticleInfo(List<Category> categories)
    {
        List<ArticleForCategoryDisplayDTO> articleList = new();
        foreach (var item in categories)
        {
            if (item.second_category == null)
            {
                var articles = await _iArticleRepository.QueryMultipleByCondition(c => c.category_id == item.id);
                foreach (var article in articles)
                {
                    var convert_article = _iMapper.Map<ArticleForCategoryDisplayDTO>(article);
                    articleList.Add(convert_article);
                }
            }
        }
        return articleList;
    }

    public async Task<Dictionary<string, bool>> GetFirstCategory()
    {
        try
        {
            var categories = await _iCategoryRepository.GetFirstCategoryAsync();
            return HasChildren(categories);

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
            var res = await _iCategoryRepository.GetSecondCategoryAsync(first_category);
            List<ArticleForCategoryDisplayDTO> articleList = await GetArticleInfo(res);
            Dictionary<string, bool> categoryDict = HasChildren(res);
            return new CategoryChildrenDisplayDTO
            {
                CategoryDict = categoryDict,
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
