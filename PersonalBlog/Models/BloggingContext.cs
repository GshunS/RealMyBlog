using Microsoft.EntityFrameworkCore;
using PersonalBlog.Models.Entities;

namespace PersonalBlog.Models;

public class BloggingContext : DbContext
{
    public BloggingContext(DbContextOptions<BloggingContext> options)
        : base(options)
    {

    }
    public DbSet<Article> Articles { get; set; }
    public DbSet<ArticleImage> ArticleImages { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Author> Authors { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}
