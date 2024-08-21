using System.Linq.Expressions;
using PersonalBlog.CustomException;
using PersonalBlog.Repository.PersonalBlog.IRepository;
using PersonalBlog.Service.PersonalBlog.IService;

namespace PersonalBlog.Service.PersonalBlog.Service;

public class BaseService<T> : IBaseService<T> where T : class
{
    protected IBaseRepository<T> _iBaseRepository;

    public async Task<List<T>> QueryAllAsync()
    {
        try
        {
            return await _iBaseRepository.QueryAllAsync();
        }
        catch (Exception ex)
        {
            throw new RepositoryException(ex.Message);
        }
    }

    public async Task<T> QueryOneByConditionAsync(Expression<Func<T, bool>> func)
    {
        try
        {
            return await _iBaseRepository.QueryOneByConditionAsync(func);
        }
        catch (RepositoryException ex)
        {
            throw new RepositoryException(ex.Message);
        }
    }

    public async Task<bool> UpdateOneAsync(T entity)
    {
        try
        {
            return await _iBaseRepository.UpdateOneAsync(entity);
        }
        catch (RepositoryException ex)
        {
            throw new RepositoryException(ex.Message);
        }
    }

    public async Task<bool> DeleteOneByIdAsync(int id)
    {
        try
        {
            return await _iBaseRepository.DeleteOneByIdAsync(id);
        }
        catch (RepositoryException ex)
        {
            throw new RepositoryException(ex.Message);
        }
    }

    public async Task<bool> DeleteMultipleByConditionAsync(Expression<Func<T, bool>> func)
    {
        try
        {
            return await _iBaseRepository.DeleteMultipleByConditionAsync(func);
        }
        catch (RepositoryException ex)
        {
            throw new RepositoryException(ex.Message);
        }
    }

    public async Task<List<T>> QueryMultipleByConditionAsync(Expression<Func<T, bool>> func)
    {
        return await _iBaseRepository.QueryMultipleByCondition(func);
    }

    public async Task<bool> CreateMultipleAsync(List<T> entities)
    {
        try
        {
            return await _iBaseRepository.CreateMultipleAsync(entities);
        }
        catch (RepositoryException ex)
        {
            throw new RepositoryException(ex.Message);
        }
    }


    public async Task<T> QueryOneByIdAsync(int id)
    {
        try
        {
            return await _iBaseRepository.QueryOneByIdAsync(id);
        }
        catch (RepositoryException ex)
        {
            throw new RepositoryException(ex.Message);
        }
    }

    public async Task<bool> CreateOneAsync(T entity)
    {
        try
        {
            return await _iBaseRepository.CreateOneAsync(entity);
        }
        catch (RepositoryException ex)
        {
            throw new RepositoryException(ex.Message);
        }
    }

    
}
