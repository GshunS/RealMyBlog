using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PersonalBlog.CustomException;
using PersonalBlog.DTO.Create;
using PersonalBlog.Models.Entities;
using PersonalBlog.MyUtils;
using PersonalBlog.Service.PersonalBlog.IService;

namespace PersonalBlog.Controllers;

[ApiController]
[Route("api")]
public class AuthorController : ControllerBase
{
    private readonly IAuthorService _iAuthorService;
    private readonly IMapper _iMapper;
    public AuthorController(IAuthorService iAuthorService, IMapper iMapper)
    {
        _iAuthorService = iAuthorService;
        _iMapper = iMapper;
    }

    [Authorize]
    [HttpPost("authors")]
    public async Task<ActionResult> CreateAuthor(AuthorCreateDTO authorCreateDTO)
    {
        try
        {
            var author = _iMapper.Map<Author>(authorCreateDTO);
            await _iAuthorService.Register(author);
            return Ok();
        }
        catch (ServiceException e)
        {
            return BadRequest(ApiResponse<object>.Error(400, e.Message));
        }
        catch (RepositoryException e)
        {
            return StatusCode(500, ApiResponse<object>.Error(500, e.Message));
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult> UserLogin(LoginRequestDTO loginRequestDTO)
    {
        try
        {
            string username = loginRequestDTO.username;
            string password = loginRequestDTO.password;

            var (accessToken, refreshToken) = await _iAuthorService.LoginWithRefreshToken(username, password);
            var data = new
            {
                accessToken = accessToken,
                refreshToken = refreshToken
            };
            return Ok(ApiResponse<object>.Success(data));
        }
        catch (ServiceException e)
        {
            return Unauthorized(ApiResponse<object>.Error(401, e.Message));
        }
        catch (RepositoryException e)
        {
            return StatusCode(500, ApiResponse<object>.Error(500, e.Message));
        }
    }

    [HttpPost("authors/refreshToken")]
    public ActionResult TokenRefresh(string refToken)
    {
        try
        {
            var (accessToken, refreshToken) = _iAuthorService.RefreshToken(refToken);
            var data = new
            {
                accessToken = accessToken,
                refreshToken = refreshToken
            };
            return Ok(ApiResponse<object>.Success(data));
        }
        catch (ServiceException e)
        {
            return BadRequest(ApiResponse<object>.Error(400, e.Message));
        }
        catch (RepositoryException e)
        {
            return StatusCode(500, ApiResponse<object>.Error(500, e.Message));
        }
    }

    [Authorize]
    [HttpGet("validation")]
    public ActionResult JwtValidation()
    {
        return Ok(ApiResponse<string>.Success());
    }

    // [Authorize]
    // [HttpPatch("authors/nickname")]
    // public async Task<ActionResult> UpdateNickname(string nickname)
    // {
    //     try
    //     {
    //         int id = Convert.ToInt32(this.User.FindFirst("Id").Value);
    //         await _iAuthorService.UpdateNickname(id, nickname);
    //         return Ok();
    //     }
    //     catch (ServiceException e)
    //     {
    //         return BadRequest(ApiResponse<object>.Error(400, e.Message));
    //     }
    //     catch (RepositoryException e)
    //     {
    //         return StatusCode(500, ApiResponse<object>.Error(500, e.Message));
    //     }
    // }


    // [Authorize]
    // [HttpPatch("authors/password")]
    // public async Task<ActionResult> UpdatePassowrd(string password)
    // {
    //     try
    //     {
    //         int id = Convert.ToInt32(this.User.FindFirst("Id").Value);
    //         await _iAuthorService.UpdatePassword(id, password);
    //         return Ok();
    //     }
    //     catch (ServiceException e)
    //     {
    //         return BadRequest(ApiResponse<object>.Error(400, e.Message));
    //     }
    //     catch (RepositoryException e)
    //     {
    //         return StatusCode(500, ApiResponse<object>.Error(500, e.Message));
    //     }
    // }



}
