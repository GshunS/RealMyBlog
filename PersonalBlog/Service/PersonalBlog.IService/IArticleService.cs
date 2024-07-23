using PersonalBlog.DTO.Display;
using PersonalBlog.DTO.Update;
using PersonalBlog.Models.Entities;

namespace PersonalBlog.Service.PersonalBlog.IService;

public interface IArticleService: IBaseService<Article>
{
    Task<bool> UpdateCommon(ArticleUpdateDTO articleUpdateDTO);

    // full text search
    Task<List<ArticleDisplayDTO>> FullTextSearchAsync(string searchStr);
}
