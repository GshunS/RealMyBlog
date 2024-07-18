using PersonalBlog.Models.Entities;

namespace PersonalBlog.Service.PersonalBlog.IService;

public interface IAuthorService:IBaseService<Author>
{
    public Task<bool> Register(Author author);
    public Task<bool> Login(string username, string password);
}
