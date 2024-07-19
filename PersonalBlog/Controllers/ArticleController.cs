using Microsoft.AspNetCore.Mvc;
using PersonalBlog.Models.Entities;
using PersonalBlog.Service.PersonalBlog.IService;

namespace PersonalBlog.Controllers;

[ApiController]
[Route("api")]
public class ArticleController : ControllerBase
{
    private IArticleService _iArticleSercice;
    public ArticleController(IArticleService iArticleSercice)
    {
        this._iArticleSercice = iArticleSercice;
    }

    [HttpPost("articles")]
    public async Task<ActionResult> CreateArticles([FromBody] Article article){
        return Ok();
    }
}

