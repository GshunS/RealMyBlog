using Microsoft.AspNetCore.Mvc;
using PersonalBlog.CustomException;
using PersonalBlog.Models.Entities;
using PersonalBlog.Service.PersonalBlog.IService;

namespace PersonalBlog.Controllers;

[ApiController]
[Route("api")]
public class CategoryController : ControllerBase
{
    private ICategoryService _iCategoryService;
    public CategoryController(ICategoryService iCategoryService)
    {
        this._iCategoryService = iCategoryService;
    }

    [HttpPost("categorys")]
    public async Task<ActionResult> CreateCategory(string first, string second, string third, string fourth)
    {
        try
        {
            Category category = new()
            {
                first_category =first,
                second_category = second,
                third_category = third,
                fourth_category = fourth
            };
            await _iCategoryService.AddCategory(category);
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
