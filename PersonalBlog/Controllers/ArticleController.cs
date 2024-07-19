using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PersonalBlog.CustomException;
using PersonalBlog.DTO.Create;
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

    [Authorize]
    [HttpPost("articles")]
    public async Task<ActionResult> CreateArticles(ArticleCreateDTO articleCreateDTO){
        try
        {
            var article = _iMapper.Map<Article>(articleCreateDTO);
            article.author_id = Convert.ToInt32(this.User.FindFirst("Id").Value);
            await _iArticleSercice.CreateOneAsync(article);
            return Ok(article);
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

