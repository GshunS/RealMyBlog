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

    [HttpPost("categories")]
    public async Task<ActionResult> CreateCategory(string first, string? second, string? third, string? fourth)
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


    [HttpPatch("categories/{id}")]
    public async Task<ActionResult> UpdateCategory(int id, string first, string? second, string? third, string? fourth)
    {
        try
        {
            Category category = new()
            {
                id = id,
                first_category =first,
                second_category = second,
                third_category = third,
                fourth_category = fourth
            };
            await _iCategoryService.UpdateCategory(category);
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


    [HttpGet("categories")]
    public async Task<ActionResult> GetCategories()
    {
        try
        {
            var data = await _iCategoryService.QueryAllAsync();
            return Ok(data);
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

    [HttpGet("categories/{id}")]
    public async Task<ActionResult> GetCategory(int id)
    {
        try
        {
            var data = await _iCategoryService.QueryOneByIdAsync(id);
            return Ok(data);
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

    [HttpDelete("categories/{id}")]
    public async Task<ActionResult> DeleteCategory(int id)
    {
        try
        {
            await _iCategoryService.DeleteOneByIdAsync(id);
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


}
