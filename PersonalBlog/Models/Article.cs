namespace PersonalBlog.Models;

public class Article
{
    public int id { get; set; }
    public string title { get; set; }
    public string text { get; set; }

    public int author_id { get; set; }
    public Author author { get; set; } = null!;

    public int view_count { get; set; }
    public int upvote_count { get; set; }
    public int is_hide { get; set; }
    public DateTime created_time { get; set; }
    public DateTime update_time { get; set; }

    public int category_id { get; set; }
    public Category category { get; set; } = null!;

    public ICollection<ArticleImage> ArticleImages {get; set;} = new List<ArticleImage>();

}
