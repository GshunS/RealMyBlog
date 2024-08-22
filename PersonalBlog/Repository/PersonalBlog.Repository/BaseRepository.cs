using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using PersonalBlog.CustomException;
using PersonalBlog.Models;
using PersonalBlog.Repository.PersonalBlog.IRepository;

namespace PersonalBlog.Repository.PersonalBlog.Repository;

public class BaseRepository<T> : IBaseRepository<T> where T : class
{
    private readonly BloggingContext _dbContext;
    public BaseRepository(BloggingContext bloggingContext)
    {
        this._dbContext = bloggingContext;
    }

    public async Task<bool> CreateMultipleAsync(List<T> entities)
    {
        try
        {
            foreach (T entity in entities)
            {
                await _dbContext.Set<T>().AddAsync(entity);
            }
            return await DbSaveAllChanges();
        }
        catch (Exception)
        {
            throw new RepositoryException("Insert failure");
        }
    }

    public async Task<bool> CreateOneAsync(T entity)
    {
        try
        {
            await _dbContext.Set<T>().AddAsync(entity);
            return await DbSaveAllChanges();
        }
        catch (Exception)
        {
            throw new RepositoryException("Insert failure");
        }

    }

    public async Task<bool> DeleteMultipleByConditionAsync(Expression<Func<T, bool>> func)
    {
        try
        {
            var entities = await QueryMultipleByCondition(func);
            _dbContext.Set<T>().RemoveRange(entities);
            return await DbSaveAllChanges();
        }
        catch (Exception)
        {
            throw new RepositoryException("Delete failure");
        }
    }

    public async Task<bool> DeleteMultipleAsync(List<T> entities)
    {
        try
        {
            _dbContext.Set<T>().RemoveRange(entities);
            return await DbSaveAllChanges();
        }
        catch (RepositoryException)
        {
            throw new RepositoryException("delete failure");
        }
    }

    public async Task<bool> DeleteOneByIdAsync(int id)
    {

        try
        {
            var entity = await QueryOneByIdAsync(id);
            _dbContext.Set<T>().Remove(entity);
            return await DbSaveAllChanges();
        }
        catch (Exception ex)
        {
            throw new RepositoryException(ex.Message + " => Delete failure");
        }

    }

    public async Task<List<T>> QueryAllAsync()
    {
        return await _dbContext.Set<T>().ToListAsync();
    }

    public async Task<List<T>> QueryMultipleByCondition(Expression<Func<T, bool>> func)
    {
        return await _dbContext.Set<T>().Where(func).ToListAsync();
    }

    public async Task<T> QueryOneByConditionAsync(Expression<Func<T, bool>> func)
    {
        try
        {
            return await _dbContext.Set<T>().SingleOrDefaultAsync(func);
        }
        catch (Exception ex)
        {
            throw new RepositoryException(ex.Message);
        }
         
    }

    public async Task<T> QueryOneByIdAsync(int id)
    {
        var res = await _dbContext.Set<T>().FindAsync(id);
        if (res == null)
        {
            throw new RepositoryException("No record found");
        }
        return res;
    }

    public async Task<bool> UpdateOneAsync(T entity)
    {
        try
        {
            _dbContext.Set<T>().Update(entity);
            return await DbSaveAllChanges();
        }
        catch (RepositoryException)
        {
            throw new RepositoryException("update failure");
        }

    }
    public async Task<bool> UpdateMultipleAsync(List<T> entities)
    {
        try
        {
            _dbContext.Set<T>().UpdateRange(entities);
            return await DbSaveAllChanges();
        }
        catch (RepositoryException)
        {
            throw new RepositoryException("update failure");
        }
    }

    public async Task<bool> DbSaveAllChanges()
    {
        int effectedRows = await _dbContext.SaveChangesAsync();
        if (effectedRows == 0)
        {
            throw new RepositoryException("0 row has been affected");
        }
        return true;
    }

    

    
}
