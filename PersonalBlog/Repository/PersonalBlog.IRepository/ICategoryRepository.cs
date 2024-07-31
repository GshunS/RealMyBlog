using PersonalBlog.DTO.Display;
using PersonalBlog.Models.Entities;

namespace PersonalBlog.Repository.PersonalBlog.IRepository;

public interface ICategoryRepository: IBaseRepository<Category>
{
    // get first category
    Task<List<CategoryRepoDisplayDTO>> GetFirstCategoryAsync();

    // get second category and id
    Task<List<CategoryRepoDisplayDTO>> GetSecondCategoryAsync(string category1);

    // get third category and id
    Task<List<CategoryRepoDisplayDTO>> GetThirdCategoryAsync(string category1, string category2);

    // get fourth category and id
    Task<List<CategoryRepoDisplayDTO>> GetFourthCategoryAsync(string category1, string category2, string category3);
}
