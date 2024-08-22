using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PersonalBlog.CustomException;
using PersonalBlog.DTO.Create;
using PersonalBlog.DTO.Delete;
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
    private Category TrimCategoryNames(Category category)
    {
        category.first_category = category.first_category.Trim();
        category.second_category = category.second_category?.Trim();
        category.third_category = category.third_category?.Trim();
        category.fourth_category = category.fourth_category?.Trim();
        return category;
    }

    private bool ValidateCategoryNames(Category category)
    {
        if (category.first_category == null || category.first_category.Length == 0)
        {
            return false;
        }
        
        if (category.second_category != null && category.second_category.Length == 0)
        {
            return false;
        }

        if (category.third_category != null && category.third_category.Length == 0)
        {
            return false;
        }

        if (category.fourth_category != null && category.fourth_category.Length == 0)
        {
            return false;
        }
        return true;
    }

    [HttpPost("categories")]
    public async Task<ActionResult> CreateCategory(CategoryCreateDTO categoryCreateDTO)
    {
        try
        {
            Category category = _iMapper.Map<Category>(categoryCreateDTO);
            Category trimedCategory = TrimCategoryNames(category);
            if (!ValidateCategoryNames(trimedCategory))
            {
                return BadRequest(new { message = "invalid category name" });
            }
            await _iCategoryService.AddCategory(trimedCategory);
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
            var category = _iMapper.Map<Category>(categoryUpdateDTO);
            Category trimedCategory = TrimCategoryNames(category);
            if (!ValidateCategoryNames(trimedCategory))
            {
                return BadRequest(new { message = "invalid category name" });
            }
            await _iCategoryService.UpdateCategory(trimedCategory);
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

    [HttpDelete("categories")]
    public async Task<ActionResult> DeleteMultipleCategories(CategoryDeleteMultipleDTO categoryDeleteMultipleDTO)
    {
        try
        {
            await _iCategoryService.DeleteMultipleCategoriesByConditionAsync(categoryDeleteMultipleDTO);
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
