using Microsoft.EntityFrameworkCore;
using PersonalBlog.Models.Entities;
using PersonalBlog.Models.EntityTypeConfigurations;

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
        // Article entity configuration
        modelBuilder.ApplyConfiguration(new ArticleEntityTypeConfiguration());

        // Author entity configuration
        modelBuilder.ApplyConfiguration(new AuthorEntityTypeConfiguration());

        // Category entity configuration
        modelBuilder.ApplyConfiguration(new CategoryEntityTypeConfiguration());

        // ArticleImage entity configuration
        modelBuilder.ApplyConfiguration(new ArticleImageEntityTypeConfiguration());
        base.OnModelCreating(modelBuilder);
    }
}
