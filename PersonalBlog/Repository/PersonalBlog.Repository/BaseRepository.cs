using System.Linq.Expressions;
using PersonalBlog.Repository.PersonalBlog.IRepository;

namespace PersonalBlog.Repository.PersonalBlog.Repository;

public class BaseRepository<T> : IBaseRepository<T> where T : class
{
    public Task<bool> CreateMultipleAsync(List<T> entities)
    {
        throw new NotImplementedException();
    }

    public Task<bool> CreateOneAsync(T entity)
    {
        throw new NotImplementedException();
    }

    public Task<bool> DeleteMultipleByConditionAsync(Expression<Func<T, bool>> func)
    {
        throw new NotImplementedException();
    }

    public Task<bool> DeleteOneByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<List<T>> QueryAllAsync()
    {
        throw new NotImplementedException();
    }

    public Task<List<T>> QueryMultipleByCondition(Expression<Func<T, bool>> func)
    {
        throw new NotImplementedException();
    }

    public Task<T> QueryOneByConditionAsync(Expression<Func<T, bool>> func)
    {
        throw new NotImplementedException();
    }

    public Task<T> QueryOneByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<bool> UpdateOneAsync(T entity)
    {
        throw new NotImplementedException();
    }

}
