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
using PersonalBlog.MyUtils;
using PersonalBlog.Service.PersonalBlog.IService;

namespace PersonalBlog.Controllers;

[ApiController]
[Route("api")]
public class ArticleController : ControllerBase
{
    private IArticleService _iArticleService;
    private readonly IAuthorService _iAuthorService;
    private readonly ICategoryService _iCategoryService;
    private IMapper _iMapper;
    public ArticleController(IArticleService iArticleSercice, IAuthorService iAuthorService, ICategoryService iCategoryService, IMapper iMapper)
    {
        this._iArticleService = iArticleSercice;
        this._iAuthorService = iAuthorService;
        this._iCategoryService = iCategoryService;
        this._iMapper = iMapper;
    }

    [Authorize]
    [HttpPost("articles")]
    public async Task<ActionResult> CreateArticles(ArticleCreateDTO articleCreateDTO)
    {
        try
        {
            var article = _iMapper.Map<Article>(articleCreateDTO);
            // article.author_id = Convert.ToInt32(this.User.FindFirst("Id").Value);
            article.author_id = 3;
            await _iArticleService.CreateOneAsync(article);
            return Ok(ApiResponse<int>.Success(article.id));
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
            DateTime updatedTime = await _iArticleService.UpdateArticleContentAsync(id, cleanTextContent, jsonData, images);
            return Ok(ApiResponse<DateTime>.Success(updatedTime));
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
    [HttpPatch("articles/id/{id}")]
    public async Task<ActionResult> UpdateArticle(int id, [FromBody] JsonPatchDocument<ArticleUpdateDTO> patchDoc)
    {
        try
        {
            if (patchDoc == null)
            {
                return BadRequest(ApiResponse<object>.Error(400, "Invalid patch document."));
            }

            var article = await _iArticleService.QueryOneByIdAsync(id);
            var articleUpdateDTO = _iMapper.Map<ArticleUpdateDTO>(article);

            patchDoc.ApplyTo(articleUpdateDTO, ModelState);
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<object>.Error(400, "Invalid patch data."));
            }
            _iMapper.Map(articleUpdateDTO, article);
            await _iArticleService.UpdateOneAsync(article);
            var articleDisplayDTO = _iMapper.Map<ArticleDisplayDTO>(article);


            return Ok(ApiResponse<ArticleDisplayDTO>.Success(articleDisplayDTO));
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

    [HttpGet("articles")]
    public async Task<ActionResult> GetArticles()
    {
        try
        {
            var articles = await _iArticleService.QueryMultipleByConditionAsync(c => c.is_hide == false);
            return Ok(ApiResponse<List<Article>>.Success(articles));
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

    [HttpGet("articles/id/{id}")]
    public async Task<ActionResult> GetSingleArticleInfo([FromRoute] int id)
    {
        try
        {
            var article = await _iArticleService.QueryOneByConditionAsync(a => a.id == id && !a.is_hide);


            var author = await _iAuthorService.QueryOneByIdAsync(article.author_id);

            var category = await _iCategoryService.QueryOneByIdAsync(article.category_id);
            var articleDisplayDTO = _iMapper.Map<ArticleDisplayDTO>(article);

            articleDisplayDTO.author_name = author.nickname;
            articleDisplayDTO.Category = _iMapper.Map<CategoryDisplayDTO>(category);
            return Ok(ApiResponse<ArticleDisplayDTO>.Success(articleDisplayDTO));
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
    [HttpGet("articles/hide")]
    public async Task<ActionResult> GetHideArticles()
    {
        try
        {
            var articles = await _iArticleService.QueryMultipleByConditionAsync(c => c.is_hide == true);
            return Ok(ApiResponse<List<Article>>.Success(articles));

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
    [HttpPatch("articles/{id}/hide")]
    public async Task<ActionResult> UpdateArticleHideStatus([FromRoute] int id)
    {
        try
        {
            Article art = await _iArticleService.QueryOneByIdAsync(id);
            art.is_hide = !art.is_hide;
            await _iArticleService.UpdateOneAsync(art);
            return Ok(ApiResponse<object>.Success());
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

    [HttpGet("articles/{word}")]
    public async Task<ActionResult> SearchArticles([FromRoute] string word)
    {
        try
        {
            var articles = await _iArticleService.FullTextSearchAsync(word);
            return Ok(ApiResponse<List<ArticleDisplayDTO>>.Success(articles));
        }
        catch (ServiceException e)
        {
            return BadRequest(ApiResponse<object>.Error(400, e.Message));
        }
        catch (RepositoryException e)
        {
            return StatusCode(500, ApiResponse<object>.Error(500, e.Message));
        }
        catch (Exception)
        {
            return StatusCode(500, ApiResponse<object>.Error(500, "something wrong happened"));
        }
    }


}

