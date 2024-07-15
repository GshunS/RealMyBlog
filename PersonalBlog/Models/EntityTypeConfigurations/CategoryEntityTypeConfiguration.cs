using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PersonalBlog.Models.Entities;

namespace PersonalBlog.Models.EntityTypeConfigurations;

public class CategoryEntityTypeConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("Category");

        // Composite primary key
        builder.HasKey(e => e.id);

        // id - int - not null - autoincrement
        builder
            .Property(e => e.id)
            .ValueGeneratedOnAdd()
            .IsRequired();

        builder.HasIndex(e => new { e.first_category, e.second_category, e.third_category, e.fourth_category })
            .IsUnique();

        builder.Property(e => e.first_category).IsRequired().HasMaxLength(100);
        builder.Property(e => e.second_category).HasMaxLength(100);
        builder.Property(e => e.third_category).HasMaxLength(100);
        builder.Property(e => e.fourth_category).HasMaxLength(100);
    }

}
