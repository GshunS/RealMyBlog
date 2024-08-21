using AutoMapper;
using Microsoft.AspNetCore.Authorization;
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
            categoryCreateDTO.first_category = categoryCreateDTO.first_category.Trim();
            categoryCreateDTO.second_category = categoryCreateDTO.second_category?.Trim();
            categoryCreateDTO.third_category = categoryCreateDTO.third_category?.Trim();
            categoryCreateDTO.fourth_category = categoryCreateDTO.fourth_category?.Trim();

            var category = _iMapper.Map<Category>(categoryCreateDTO);
            await _iCategoryService.AddCategory(category);
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

    [Authorize]
    [HttpPatch("categories/{id}")]
    public async Task<ActionResult> UpdateCategory(CategoryUpdateDTO categoryUpdateDTO)
    {
        try
        {
            categoryUpdateDTO.first_category = categoryUpdateDTO.first_category.Trim();
            categoryUpdateDTO.second_category = categoryUpdateDTO.second_category?.Trim();
            categoryUpdateDTO.third_category = categoryUpdateDTO.third_category?.Trim();
            categoryUpdateDTO.fourth_category = categoryUpdateDTO.fourth_category?.Trim();

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


    [HttpGet("categories/first-category")]
    public async Task<ActionResult> GetFirstCategories()
    {
        try
        {
            var data = await _iCategoryService.GetFirstCategory();
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

    [HttpGet("categories/first_category/{first_category}")]
    public async Task<ActionResult> GetSecondCategories([FromRoute] string first_category)
    {
        try
        {
            first_category = first_category.Trim();
            var data = await _iCategoryService.GetSecondCategory(first_category);
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

    [HttpGet("categories/first_category/{first_category}/second_category/{second_category}")]
    public async Task<ActionResult> GetThirdCategories([FromRoute] string first_category, string second_category)
    {
        try
        {
            first_category = first_category.Trim();
            second_category = second_category.Trim();
            var data = await _iCategoryService.GetThirdCategory(first_category, second_category);
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


    [HttpGet("categories/first_category/{first_category}/second_category/{second_category}/third_category/{third_category}")]
    public async Task<ActionResult> GetFourthCategories([FromRoute] string first_category, string second_category, string third_category)
    {
        try
        {
            first_category = first_category.Trim();
            second_category = second_category.Trim();
            third_category = third_category.Trim();
            var data = await _iCategoryService.GetFourthCategory(first_category, second_category, third_category);
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

    [HttpGet("categories/id/{id}")]
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

    [Authorize]
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
