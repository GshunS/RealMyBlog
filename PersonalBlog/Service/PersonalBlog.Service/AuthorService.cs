using PersonalBlog.CustomException;
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

    public async Task<bool> Login(string username, string password)
    {
        throw new NotImplementedException();
    }
    // register
    public async Task<bool> Register(Author author)
    {
        // unique nickname
        var foundNickname = await _iAuthorRepository.QueryOneByConditionAsync(c => c.nickname == author.nickname);
        if(foundNickname != null){
            throw new ServiceException("nickname already exists");
        }

        // unique username
        var foundUsername = await _iAuthorRepository.QueryOneByConditionAsync(c => c.username == author.username);
        if(foundUsername != null){
            throw new ServiceException("username already exists");
        }

        try
        {
            var res = await _iAuthorRepository.CreateOneAsync(author);
        }
        catch (RepositoryException ex)
        {
            throw new RepositoryException(ex.Message);
        }
        
        
    }

}
