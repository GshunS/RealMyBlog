using PersonalBlog.Repository.PersonalBlog.IRepository;
using PersonalBlog.Service.PersonalBlog.IService;

namespace PersonalBlog.Service.PersonalBlog.Service;

public class BaseService<T>: IBaseService<T> where T: class
{
    protected IBaseRepository<T> _iBaseRepository;
    
}
