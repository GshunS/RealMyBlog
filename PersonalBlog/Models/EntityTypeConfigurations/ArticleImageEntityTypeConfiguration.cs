using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PersonalBlog.Models.Entities;

namespace PersonalBlog.Models.EntityTypeConfigurations;

public class ArticleImageEntityTypeConfiguration : IEntityTypeConfiguration<ArticleImage>
{
    public void Configure(EntityTypeBuilder<ArticleImage> builder)
    {
        builder.ToTable("ArticleImage");
        
        // Primary key
        builder.HasKey(e => e.id);

        // id - int - not null - autoincrement
        builder
            .Property(e => e.id)
            .ValueGeneratedOnAdd()
            .IsRequired();

        // Properties
        builder.Property(e => e.image_name)
            .HasMaxLength(100)
            .IsRequired(false);
        builder.Property(e => e.image_path)
            .HasMaxLength(255)
            .IsRequired();
        builder.Property(e => e.position)
            .IsRequired();
        builder.Property(e => e.article_id)
            .IsRequired();

        // Index on ArticleId
        builder.HasIndex(e => e.article_id);

        // Foreign key relationship
        builder.HasOne(e => e.article)
            .WithMany(a => a.ArticleImages)
            .HasForeignKey(e => e.article_id);
    }

}
