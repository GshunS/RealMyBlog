using PersonalBlog.Models.Entities;
using PersonalBlog.Repository.PersonalBlog.IRepository;
using PersonalBlog.Service.PersonalBlog.IService;

namespace PersonalBlog.Service.PersonalBlog.Service;

public class AuthorService:BaseService<Author>, IAuthorService
{
    private readonly IAuthorRepository _iAuthorRepository;
    public AuthorService(IAuthorRepository iAuthorRepository)
    {
        base._iBaseRepository = iAuthorRepository;
        _iAuthorRepository = iAuthorRepository;
    }
}
