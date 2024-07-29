using PersonalBlog.DTO.Display;
using PersonalBlog.Models.Entities;

namespace PersonalBlog.Service.PersonalBlog.IService;

public interface ICategoryService: IBaseService<Category>
{
    // check if category has already existed
    Task<bool> CheckExistCategory(Category category);
    Task<bool> UpdateCategory(Category category);
    Task<bool> AddCategory(Category category);
    Task<Dictionary<string, CategoryChildrenDisplayDTO>> GetFirstCategory();
    Task<Dictionary<string, CategoryChildrenDisplayDTO>> GetSecondCategory(string first_category);
    // Task<CategoryChildrenDisplayDTO> GetThirdCategory(string first_category, string second_category);
    Dictionary<string, bool> HasChildren(List<CategoryRepoDisplayDTO> categories);
    Task<Dictionary<string, Dictionary<int, string>>> GetArticleInfo(List<CategoryRepoDisplayDTO> categories);
}
