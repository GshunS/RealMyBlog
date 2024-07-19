using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using PersonalBlog.CustomException;
using PersonalBlog.Models.Entities;
using PersonalBlog.Service.PersonalBlog.IService;

namespace PersonalBlog.Controllers;

[ApiController]
[Route("api")]
public class ArticleController : ControllerBase
{
    private IArticleService _iArticleSercice;
    private IMapper _iMapper;
    public ArticleController(IArticleService iArticleSercice, IMapper iMapper)
    {
        this._iArticleSercice = iArticleSercice;
        this._iMapper = iMapper;
    }

    [HttpPost("articles")]
    public async Task<ActionResult> CreateArticles([FromBody] Article article){
        try
        {
            var category = _iMapper.Map<Category>(categoryCreateDTO);
            await _iArticleSercice
            return Ok(category);
        }
        catch (ServiceException e)
        {
            return BadRequest(new { message = e.Message });
        }
        catch (RepositoryException e)
        {
            return StatusCode(500, e.Message);
        }
    }
}

