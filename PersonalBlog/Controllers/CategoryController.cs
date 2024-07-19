using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using PersonalBlog.CustomException;
using PersonalBlog.DTO.Create;
using PersonalBlog.DTO.Update;
using PersonalBlog.Models.Entities;
using PersonalBlog.Service.PersonalBlog.IService;

namespace PersonalBlog.Controllers;

[ApiController]
[Route("api")]
public class CategoryController : ControllerBase
{
    private ICategoryService _iCategoryService;
    private IMapper _iMapper;
    public CategoryController(ICategoryService iCategoryService, IMapper iMapper)
    {
        this._iCategoryService = iCategoryService;
        this._iMapper = iMapper;
    }

    [HttpPost("categories")]
    public async Task<ActionResult> CreateCategory(CategoryCreateDTO categoryCreateDTO)
    {
        try
        {
            var category = _iMapper.Map<Category>(categoryCreateDTO);
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
    public async Task<ActionResult> UpdateCategory(CategoryUpdateDTO categoryUpdateDTO)
    {
        try
        {
            var category = _iMapper.Map<Category>(categoryUpdateDTO);
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
