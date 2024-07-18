using PersonalBlog.Models;
using PersonalBlog.Models.Entities;
using PersonalBlog.Repository.PersonalBlog.IRepository;

namespace PersonalBlog.Repository.PersonalBlog.Repository;

public class AuthorRepository: BaseRepository<Author>, IAuthorRepository
{
    public AuthorRepository(BloggingContext bloggingContext) : base(bloggingContext)
    {
        
    }
    
}
