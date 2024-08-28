using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
using PersonalBlog.CustomException;
using PersonalBlog.DTO.Create;
using PersonalBlog.DTO.Display;
using PersonalBlog.DTO.Update;
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
    public async Task<ActionResult> CreateArticles(ArticleCreateDTO articleCreateDTO)
    {
        try
        {
            var article = _iMapper.Map<Article>(articleCreateDTO);
            // article.author_id = Convert.ToInt32(this.User.FindFirst("Id").Value);
            article.author_id = 3;
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

    [Authorize]
    [HttpPatch("articles/{id}")]
    public async Task<ActionResult> UpdateArticles(ArticleUpdateDTO articleUpdateDTO)
    {
        try
        {
            await _iArticleSercice.UpdateCommon(articleUpdateDTO);
            return Ok(articleUpdateDTO);
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

    [HttpGet("articles")]
    public async Task<ActionResult> GetArticles()
    {
        try
        {
            var articles = await _iArticleSercice.QueryMultipleByConditionAsync(c => c.is_hide == false);
            return Ok(articles);
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

    [Authorize]
    [HttpGet("articles/hide")]
    public async Task<ActionResult> GetHideArticles()
    {
        try
        {
            var articles = await _iArticleSercice.QueryMultipleByConditionAsync(c => c.is_hide == true);
            return Ok(articles);
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


    [HttpPatch("articles/{id}/hide")]
    public async Task<ActionResult> UpdateArticleHideStatus([FromRoute] int id)
    {
        try
        {
            Article art = await _iArticleSercice.QueryOneByIdAsync(id);
            art.is_hide = !art.is_hide;
            await _iArticleSercice.UpdateOneAsync(art);
            return Ok();
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

    [HttpGet("articles/{word}")]
    public async Task<ActionResult> SearchArticles([FromRoute] string word)
    {
        try
        {
            var articles = await _iArticleSercice.FullTextSearchAsync(word);
            return Ok(articles);
        }
        catch (ServiceException e)
        {
            return BadRequest(new { message = e.Message });
        }
        catch (RepositoryException e)
        {
            return StatusCode(500, e.Message);
        }
        catch (Exception)
        {
            return StatusCode(500, "something wrong happened");
        }
    }

    
}

