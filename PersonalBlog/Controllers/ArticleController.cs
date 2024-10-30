using System.Text.RegularExpressions;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
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
    private IArticleService _iArticleService;
    private IMapper _iMapper;
    public ArticleController(IArticleService iArticleSercice, IMapper iMapper)
    {
        this._iArticleService = iArticleSercice;
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
            article.content = "";
            article.json_content = "{}";
            await _iArticleService.CreateOneAsync(article);
            return Ok(article.id);
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

    [HttpPost("articles/id/{id}/content")]
    public async Task<ActionResult> UpdateArticleContent(int id)
    {
        try
        {
            string textContent = Request.Form["TextContent"];
            string cleanTextContent = Regex.Replace(textContent.Replace("\n", ""), @"(\r)+", " ");

            string jsonContent = Request.Form["jsonContent"];
            var jsonData = JObject.Parse(jsonContent);

            List<IFormFile> images = Request.Form.Files.ToList();
            await _iArticleService.UpdateArticleContentAsync(id, cleanTextContent, jsonData, images);
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

    // [Authorize]
    [HttpPatch("articles/id/{id}")]
    public async Task<ActionResult> UpdateArticle(int id, [FromBody] JsonPatchDocument<ArticleUpdateDTO> patchDoc)
    {
        try
        {
            if (patchDoc == null) return BadRequest();
            var article = await _iArticleService.QueryOneByIdAsync(id);
            var articleUpdateDTO = _iMapper.Map<ArticleUpdateDTO>(article);

            patchDoc.ApplyTo(articleUpdateDTO, ModelState);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _iMapper.Map(articleUpdateDTO, article);
            await _iArticleService.UpdateOneAsync(article);

            return Ok(article.update_time);
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
            var articles = await _iArticleService.QueryMultipleByConditionAsync(c => c.is_hide == false);
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

    [HttpGet("articles/id/{id}")]
    public async Task<ActionResult> GetSingleArticleInfo([FromRoute] int id)
    {
        try
        {
            var article = await _iArticleService.QueryOneByConditionAsync(a => a.id == id && !a.is_hide);
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
    [HttpGet("articles/hide")]
    public async Task<ActionResult> GetHideArticles()
    {
        try
        {
            var articles = await _iArticleService.QueryMultipleByConditionAsync(c => c.is_hide == true);
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
            Article art = await _iArticleService.QueryOneByIdAsync(id);
            art.is_hide = !art.is_hide;
            await _iArticleService.UpdateOneAsync(art);
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
            var articles = await _iArticleService.FullTextSearchAsync(word);
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

