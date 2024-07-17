using PersonalBlog.Models.Entities;
using PersonalBlog.Service.PersonalBlog.IService;

namespace PersonalBlog.Service.PersonalBlog.Service;

public class AuthorService:BaseService<Author>, IAuthorService
{
    private readonly IAuthorService _iAuthorService;
    public AuthorService(IAuthorService iAuthorService)
    {
        base._iBaseService = iAuthorService;
        _iAuthorService = iAuthorService;
    }
}
