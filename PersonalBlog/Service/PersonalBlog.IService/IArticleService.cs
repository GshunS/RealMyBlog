using Microsoft.AspNetCore.JsonPatch;
using Newtonsoft.Json.Linq;
using PersonalBlog.DTO.Display;
using PersonalBlog.DTO.Update;
using PersonalBlog.Models.Entities;

namespace PersonalBlog.Service.PersonalBlog.IService;

public interface IArticleService: IBaseService<Article>
{
    // Task<bool> UpdateCommon(ArticleUpdateDTO articleUpdateDTO);
    // Task<bool> UpdateSingleArticleAsync(int id);

    Task<bool> UpdateArticleContentAsync(int id, string textContent, JObject jsonContent, List<IFormFile> images);

    // full text search
    Task<List<ArticleDisplayDTO>> FullTextSearchAsync(string searchStr);
}
