using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
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
        foreach (T entity in entities)
        {
            await _dbContext.Set<T>().AddAsync(entity);
        }
        return await DbSaveAllChanges();
    }

    public async Task<bool> CreateOneAsync(T entity)
    {
        await _dbContext.Set<T>().AddAsync(entity);
        return await DbSaveAllChanges();
    }

    public async Task<bool> DeleteMultipleByConditionAsync(Expression<Func<T, bool>> func)
    {
        var entities = await QueryMultipleByCondition(func);
        _dbContext.Set<T>().RemoveRange(entities);
        return await DbSaveAllChanges();
    }

    public async Task<bool> DeleteOneByIdAsync(int id)
    {
        var entity = await QueryOneByIdAsync(id);
        if(entity == null){
            return false;
        }
        _dbContext.Set<T>().Remove(entity);
        return await DbSaveAllChanges();
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
        return await _dbContext.Set<T>().SingleAsync(func);
    }

    public async Task<T> QueryOneByIdAsync(int id)
    {
        return await _dbContext.Set<T>().FindAsync(id);
        
    }

    public async Task<bool> UpdateOneAsync(T entity)
    {
        _dbContext.Set<T>().Update(entity);
        return await DbSaveAllChanges();
    }

    public async Task<bool> DbSaveAllChanges()
    {
        int effectedRows = await _dbContext.SaveChangesAsync();
        if (effectedRows == 0)
        {
            return false;
        }
        return true;
    }

}
