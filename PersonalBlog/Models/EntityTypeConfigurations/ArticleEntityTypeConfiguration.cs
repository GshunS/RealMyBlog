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

        // title - varchar(100) - not null - index
        builder.Property(e => e.title)
            .IsRequired()
            .HasMaxLength(100);
        builder.HasIndex(e => e.title);

        // content - text - not null
        builder.Property(e => e.content)
            .IsRequired()
            .HasColumnType("text");
        

        // Foreign Key for Author
        builder.Property(e => e.author_id)
            .IsRequired();
        builder.HasOne(e => e.author)
            .WithMany(a => a.Articles)
            .HasForeignKey(e => e.author_id);

        // view_count - default 0
        builder.Property(e => e.view_count)
            .HasDefaultValue(0);
 
        // upvote_count - default 0
        builder.Property(e => e.upvote_count)
            .HasDefaultValue(0);

        // is_hide - tinyint(1) - default false
        builder.Property(e => e.is_hide)
            .HasColumnType("TINYINT(1)")
            .HasDefaultValue(0)
            .HasComment("0 for show, 1 for hide");

        // created_time
        builder.Property(e => e.created_time)
            .ValueGeneratedOnAdd()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // update_time
        builder.Property(e => e.update_time)
            .ValueGeneratedOnUpdate()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Foreign Key for Category
        builder.Property(e => e.category_id)
            .IsRequired();
        builder.HasOne(e => e.category)
            .WithMany(c => c.Articles)
            .HasForeignKey(e => e.category_id);

        // set Indexes for Foreign Key category_id
        builder.HasIndex(e => e.category_id);
    }

}
