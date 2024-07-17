using PersonalBlog.Models.Entities;
using PersonalBlog.Service.PersonalBlog.IService;

namespace PersonalBlog.Service.PersonalBlog.Service;

public class CategoryService: BaseService<Category>, ICategoryService
{
    private readonly ICategoryService _iCategoryService;
    public CategoryService(ICategoryService iCategoryService)
    {
        base._iBaseService = iCategoryService;
        _iCategoryService = iCategoryService;
    }
}
