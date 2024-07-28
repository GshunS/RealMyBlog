using PersonalBlog.DTO.Display;
using PersonalBlog.Models.Entities;

namespace PersonalBlog.Service.PersonalBlog.IService;

public interface ICategoryService: IBaseService<Category>
{
    // check if category has already existed
    Task<bool> CheckExistCategory(Category category);
    Task<bool> UpdateCategory(Category category);
    Task<bool> AddCategory(Category category);
    Task<Dictionary<string, bool>> GetFirstCategory();
    Task<CategoryChildrenDisplayDTO> GetSecondCategory(string first_category);
    Dictionary<string, bool> HasChildren(List<Category> categories);
    Task<List<ArticleForCategoryDisplayDTO>> GetArticleInfo(List<Category> categories);
}
