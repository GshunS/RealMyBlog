using PersonalBlog.Models.Entities;

namespace PersonalBlog.Service.PersonalBlog.IService;

public interface ICategoryService: IBaseService<Category>
{
    // check if category has already existed
    Task<bool> CheckExistCategory(Category category);
    Task<bool> UpdateCategory(Category category);
    Task<bool> AddCategory(Category category);
}
