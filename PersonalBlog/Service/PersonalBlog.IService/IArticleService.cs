using PersonalBlog.Models.Entities;

namespace PersonalBlog.Service.PersonalBlog.IService;

public interface IArticleService: IBaseService<Article>
{
    Task<bool> UpdateTitle(int id, string newTitle);
    Task<bool> UpdateUpvoteAmount(int id, int newUpvote);
    Task<bool> UpdateViewAmount(int id, int newView);
    Task<bool> UpdateHidenStatus(int id);
}
