using PersonalBlog.Models;
using PersonalBlog.Models.Entities;
using PersonalBlog.Repository.PersonalBlog.IRepository;

namespace PersonalBlog.Repository.PersonalBlog.Repository;

public class CategoryRepository: BaseRepository<Category>, ICategoryRepository
{
    public CategoryRepository(BloggingContext bloggingContext) : base(bloggingContext)
    {
        
    }
}
