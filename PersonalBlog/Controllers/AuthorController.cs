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
}
