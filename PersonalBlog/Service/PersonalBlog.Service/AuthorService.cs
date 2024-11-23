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
    private readonly String privateKey = "SHUN-CJAS1-SAD-DFSFA-SADHJVF-VFKSDK";

    public AuthorService(IAuthorRepository iAuthorRepository)
    {
        base._iBaseRepository = iAuthorRepository;
        _iAuthorRepository = iAuthorRepository;
    }

    private string GenerateJwtToken(string nickname, string id, string username, DateTime expiresAfter)
    {
        try
        {
            var claims = new Claim[]
            {
                new Claim(ClaimTypes.Name, nickname),
                new Claim("Id", id),
                new Claim("Username", username)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(privateKey));

            var token = new JwtSecurityToken(
                issuer: "http://localhost:7219",
                audience: "http://localhost:7219",
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: expiresAfter,
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            var jwtToken = new JwtSecurityTokenHandler().WriteToken(token);
            return jwtToken;

        }
        catch (ServiceException ex)
        {
            throw new ServiceException(ex.Message);
        }
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
            string jwtToken = GenerateJwtToken(author.nickname, author.id.ToString(), author.username, DateTime.UtcNow.AddHours(2));
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


    // login
    public async Task<(string access, string refresh)> LoginWithRefreshToken(string username, string password)
    {
        string pwd = MD5Helper.MD5Encrypt32(password);
        try
        {
            var author = await _iAuthorRepository.QueryOneByConditionAsync(c => c.username == username && c.password == pwd);
            if (author == null)
            {
                throw new ServiceException("Invalid username or password");
            }

            // var jwtAccessToken = GenerateJwtToken(author.nickname, author.id.ToString(), author.username, DateTime.UtcNow.AddMinutes(15));
            var jwtAccessToken = GenerateJwtToken(author.nickname, author.id.ToString(), author.username, DateTime.UtcNow.AddSeconds(2));
            var jwtRefreshToken = GenerateJwtToken(author.nickname, author.id.ToString(), author.username, DateTime.UtcNow.AddDays(7));
            return (jwtAccessToken, jwtRefreshToken);

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

    public (string access, string refresh) RefreshToken(string refreshToken)
    {
        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ValidIssuer = "http://localhost:7219",
            ValidAudience = "http://localhost:7219",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(privateKey))
        };
        var tokenHandler = new JwtSecurityTokenHandler();
        try
        {
            var data = tokenHandler.ValidateToken(refreshToken, validationParameters, out _);
            string nickname = data.Claims.First(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name").Value;
            string id = data.Claims.First(c => c.Type == "Id").Value;
            string username = data.Claims.First(c => c.Type == "Username").Value;

            
            // var jwtAccessToken = GenerateJwtToken(nickname, id, username, DateTime.UtcNow.AddMinutes(15));
            var jwtAccessToken = GenerateJwtToken(nickname, id, username, DateTime.UtcNow.AddSeconds(2));
            var jwtRefreshToken = GenerateJwtToken(nickname, id, username, DateTime.UtcNow.AddDays(7));
            return (jwtAccessToken, jwtRefreshToken);
        }
        catch
        {
            throw new ServiceException("invalid token");
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
            if (a != null)
            {
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
