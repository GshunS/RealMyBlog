using System.Linq.Expressions;

namespace PersonalBlog.Service.PersonalBlog.IService;

public interface IBaseService<T> where T: class
{
    // update one record
    Task<bool> UpdateOneAsync(T entity);

    // query all records
    Task<List<T>> QueryAllAsync();

    // query one record by id
    Task<T> QueryOneByIdAsync(int id);

    // query one record by conditions
    Task<T> QueryOneByConditionAsync(Expression<Func<T, bool>> func);

    // query multiple records by conditions
    Task<List<T>> QueryMultipleByConditionAsync(Expression<Func<T, bool>> func);

    // delete one by id
    Task<bool> DeleteOneByIdAsync(int id);

    // create multiple records
    Task<bool> CreateMultipleAsync(List<T> entities);
}
