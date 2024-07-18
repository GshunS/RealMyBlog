using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using PersonalBlog.CustomException;
using PersonalBlog.Models.Entities;
using PersonalBlog.MyUtils.MyEncrypt;
using PersonalBlog.Repository.PersonalBlog.IRepository;
using PersonalBlog.Service.PersonalBlog.IService;

namespace PersonalBlog.Service.PersonalBlog.Service;

public class AuthorService : BaseService<Author>, IAuthorService
{
    private readonly IAuthorRepository _iAuthorRepository;
    public AuthorService(IAuthorRepository iAuthorRepository)
    {
        base._iBaseRepository = iAuthorRepository;
        _iAuthorRepository = iAuthorRepository;
    }

    // login
    public async Task<string> Login(string username, string password)
    {
        string pwd = MD5Helper.MD5Encrypt32(password);
        try
        {
            var author = await _iAuthorRepository.QueryOneByConditionAsync(c => c.username == username && c.password == pwd);
            if (author == null)
            {
                throw new ServiceException("Invalid username or password");
            }
            var claims = new Claim[]
            {
                new Claim(ClaimTypes.Name, author.nickname),
                new Claim("Id", author.id.ToString()),
                new Claim("Username", author.username)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("SHUN-CJAS1-SAD-DFSFA-SADHJVF-VFKSDK"));

            var token = new JwtSecurityToken(
                issuer: "http://localhost:7219",
                audience: "http://localhost:7219",
                claims: claims,
                notBefore: DateTime.Now,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );
            var jwtToken = new JwtSecurityTokenHandler().WriteToken(token);
            return jwtToken;

        }
        catch (RepositoryException ex)
        {
            throw new RepositoryException(ex.Message);
        }
        catch (ServiceException ex)
        {
            throw new ServiceException(ex.Message);
        }


    }

    // register
    public async Task<bool> Register(Author author)
    {
        // unique nickname
        var foundNickname = await _iAuthorRepository.QueryOneByConditionAsync(c => c.nickname == author.nickname);
        if (foundNickname != null)
        {
            throw new ServiceException("nickname already exists");
        }

        // unique username
        var foundUsername = await _iAuthorRepository.QueryOneByConditionAsync(c => c.username == author.username);
        if (foundUsername != null)
        {
            throw new ServiceException("username already exists");
        }

        try
        {
            author.password = MD5Helper.MD5Encrypt32(author.password);
            return await _iAuthorRepository.CreateOneAsync(author);
        }
        catch (RepositoryException ex)
        {
            throw new RepositoryException(ex.Message);
        }

    }


    // update nickname
    public async Task<bool> UpdateNickname(int id, string newNickName)
    {
        try
        {
            var a = await _iAuthorRepository.QueryOneByConditionAsync(c => c.nickname == newNickName);
            if(a != null){
                throw new ServiceException("nickname has already existed");
            }
            var oldUser = await _iAuthorRepository.QueryOneByIdAsync(id);
            oldUser.nickname = newNickName;
            return await _iAuthorRepository.DbSaveAllChanges();
        }
        catch (RepositoryException ex)
        {
            throw new RepositoryException(ex.Message);
        }
        
    }

    // update password
    public async Task<bool> UpdatePassword(int id, string newPassword)
    {
        try
        {
            var oldUser = await _iAuthorRepository.QueryOneByIdAsync(id);

            oldUser.password = MD5Helper.MD5Encrypt32(newPassword);
            return await _iAuthorRepository.DbSaveAllChanges();
        }
        catch (RepositoryException ex)
        {
            throw new RepositoryException(ex.Message);
        }
        
    }

}
