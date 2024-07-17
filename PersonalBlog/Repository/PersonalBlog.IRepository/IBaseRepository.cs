using System.Linq.Expressions;

namespace PersonalBlog.Repository.PersonalBlog.IRepository;

public interface IBaseRepository<T> where T: class
{
    // insert one record
    Task<bool> CreateOneAsync(T entity);
    // create multiple records
    Task<bool> CreateMultipleAsync(List<T> entities);

    // delete one by id
    Task<bool> DeleteOneByIdAsync(int id);
    // delete mulitple by conditions
    Task<bool> DeleteMultipleByConditionAsync(Expression<Func<T, bool>> func);

    // update one record
    Task<bool> UpdateOneAsync(T entity);

    // query one record by id
    Task<T> QueryOneByIdAsync(int id);
    // query one record by conditions
    Task<T> QueryOneByConditionAsync(Expression<Func<T, bool>> func);
    // query all records
    Task<List<T>> QueryAllAsync();
    // query multiple records by conditions
    Task<List<T>> QueryMultipleByCondition(Expression<Func<T, bool>> func);

}
