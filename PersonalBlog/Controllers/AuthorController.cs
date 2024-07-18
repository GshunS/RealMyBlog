using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PersonalBlog.CustomException;
using PersonalBlog.DTO.Create;
using PersonalBlog.Models.Entities;
using PersonalBlog.Service.PersonalBlog.IService;

namespace PersonalBlog.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthorController : ControllerBase
{
    private IAuthorService _iAuthorService;
    public AuthorController(IAuthorService iAuthorService)
    {
        _iAuthorService = iAuthorService;
    }

    [HttpPost("authors")]
    public async Task<ActionResult> CreateAuthor(string nickname, string username, string password){
        try
        {
            Author author = new Author{
                nickname = nickname,
                username = username,
                password = password
            };
            await _iAuthorService.Register(author);
            return Ok(author);
        }
        catch (ServiceException e)
        {
            return BadRequest(new {message = e.Message});
        }
        catch (RepositoryException e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult> UserLogin(string username, string password){
        try
        {

            string token = await _iAuthorService.Login(username, password);
            return Ok(token);
        }
        catch (ServiceException e)
        {
            return Unauthorized(new {Error = e.Message});
        }
        catch (RepositoryException e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [Authorize]
    [HttpPut("nickname")]
    public async Task<ActionResult> UpdateNickname(string nickname){
        try
        {
            int id = Convert.ToInt32(this.User.FindFirst("Id").Value);
            await _iAuthorService.UpdateNickname(id, nickname);
            return Ok();
        }
        catch (ServiceException e)
        {
            return BadRequest(new {message = e.Message});
        }
        catch (RepositoryException e)
        {
            return StatusCode(500, e.Message);
        }
    }
}
