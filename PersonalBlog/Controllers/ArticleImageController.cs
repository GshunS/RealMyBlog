using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using PersonalBlog.CustomException;
using PersonalBlog.DTO.Display;
using PersonalBlog.Service.PersonalBlog.IService;
using PersonalBlog.Service.PersonalBlog.Service;

namespace PersonalBlog.Controllers;

[ApiController]
[Route("api")]
public class ArticleImageController : ControllerBase
{
    private readonly IArticleImageService _iArticleImageService;
    private IMapper _iMapper;
    public ArticleImageController(IArticleImageService iArticleImageService, IMapper iMapper)
    {
        _iArticleImageService = iArticleImageService;
        _iMapper = iMapper;
    }

    [HttpGet("images/articles-id/{id}")]
    public async Task<ActionResult> GetArticleImages(int id)
    {
        try
        {
            var articleImages = await _iArticleImageService.QueryMultipleByConditionAsync(c => c.article_id == id);

            var articleImageDisplayDtos = _iMapper.Map<IEnumerable<ArticleImageDisplayDTO>>(articleImages);
            
            return Ok(articleImageDisplayDtos);
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
