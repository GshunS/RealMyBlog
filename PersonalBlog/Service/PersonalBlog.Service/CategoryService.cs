using PersonalBlog.Models.Entities;
using PersonalBlog.Repository.PersonalBlog.IRepository;
using PersonalBlog.Service.PersonalBlog.IService;

namespace PersonalBlog.Service.PersonalBlog.Service;

public class CategoryService: BaseService<Category>, ICategoryService
{
    private readonly ICategoryRepository _iCategoryRepository;
    public CategoryService(ICategoryRepository iCategoryRepository)
    {
        base._iBaseRepository = iCategoryRepository;
        _iCategoryRepository = iCategoryRepository;
    }
}
