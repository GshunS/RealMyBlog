using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PersonalBlog.Models.Entities;

namespace PersonalBlog.Models.EntityTypeConfigurations;

public class ArticleEntityTypeConfiguration : IEntityTypeConfiguration<Article>
{

    public void Configure(EntityTypeBuilder<Article> builder)
    {
        builder.ToTable("Article");
        builder.HasKey(article => article.id);

        // id - int - not null - autoincrement
        builder
        .Property(e => e.id)
        .HasColumnName("id")
        .HasColumnType("int")
        .ValueGeneratedOnAdd()
        .IsRequired();

        // Title
        builder.Property(e => e.title)
            .IsRequired()
            .HasMaxLength(100);
        builder.HasIndex(e => e.title);

        // Content
        builder.Property(e => e.content)
            .IsRequired()
            .HasColumnType("text");
        // Full-Text index can be created via migrations or manually on the database

        // Foreign Key for Author
        builder.Property(e => e.AuthorId)
            .IsRequired();
        builder.HasOne(e => e.Author)
            .WithMany(a => a.Articles)
            .HasForeignKey(e => e.AuthorId);

        // ViewCount
        builder.Property(e => e.ViewCount)
            .HasDefaultValue(0);

        // UpvoteCount
        builder.Property(e => e.UpvoteCount)
            .HasDefaultValue(0);

        // IsHide
        builder.Property(e => e.IsHide)
            .HasColumnType("TINYINT(1)")
            .HasDefaultValue(false);

        // CreatedTime
        builder.Property(e => e.CreatedTime)
            .IsRequired();

        // UpdatedTime
        builder.Property(e => e.UpdatedTime)
            .IsRequired();

        // Foreign Key for Category
        builder.Property(e => e.CategoryId)
            .IsRequired();
        builder.HasOne(e => e.Category)
            .WithMany(c => c.Articles)
            .HasForeignKey(e => e.CategoryId);

        // Indexes
        builder.HasIndex(e => e.CategoryId);
    }

}
