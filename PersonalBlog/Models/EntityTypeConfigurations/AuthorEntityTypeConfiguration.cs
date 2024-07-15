using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PersonalBlog.Models.Entities;

namespace PersonalBlog.Models.EntityTypeConfigurations;

public class AuthorEntityTypeConfiguration : IEntityTypeConfiguration<Author>
{
    public void Configure(EntityTypeBuilder<Author> builder)
    {
        builder.ToTable("Author");
        // Primary key
        builder.HasKey(e => e.id);

        // id - int - not null - autoincrement
        builder
            .Property(e => e.id)
            .HasColumnName("id")
            .HasColumnType("int")
            .ValueGeneratedOnAdd()
            .IsRequired();

        // Unique constraints
        builder.HasIndex(e => e.nickname).IsUnique();
        builder.HasIndex(e => e.username).IsUnique();

        // Required fields
        builder.Property(e => e.nickname).IsRequired().HasMaxLength(100);
        builder.Property(e => e.username).IsRequired().HasMaxLength(30);
        builder.Property(e => e.password).IsRequired().HasMaxLength(30);
    }
}
