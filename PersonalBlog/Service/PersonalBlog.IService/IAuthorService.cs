using PersonalBlog.Models.Entities;

namespace PersonalBlog.Service.PersonalBlog.IService;

public interface IAuthorService:IBaseService<Author>
{
    Task<bool> Register(Author author);
    Task<string> Login(string username, string password);
    Task<bool> UpdateNickname(int id, string newNickName);
    Task<bool> UpdatePassword(int id, string newPassword);
}
