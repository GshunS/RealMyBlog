using PersonalBlog.Models.Entities;

namespace PersonalBlog.Service.PersonalBlog.IService;

public interface IAuthorService : IBaseService<Author>
{
    Task<bool> Register(Author author);
    Task<string> Login(string username, string password);
    Task<(string access, string refresh)> LoginWithRefreshToken(string username, string password);
    (string access, string refresh) RefreshToken(string refreshToken);
    Task<bool> UpdateNickname(int id, string newNickName);
    Task<bool> UpdatePassword(int id, string newPassword);
}
