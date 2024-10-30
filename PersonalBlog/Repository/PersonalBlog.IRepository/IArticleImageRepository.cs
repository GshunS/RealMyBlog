using PersonalBlog.DTO.Display;
using PersonalBlog.Models.Entities;

namespace PersonalBlog.Repository.PersonalBlog.IRepository;

public interface IArticleImageRepository:IBaseRepository<ArticleImage>
{
    Task<List<string>> GetImagesHashValueByArticleIdAsync(int id);
    Task<List<ArticleImagePathHashDisplayDTO>> GetImagesHashAndPathByArticleIdAsync(int id);
    Task<bool> BulkDeleteImagesByArticleIdAndHashvalues(int id, List<string> hashvalues);
}
