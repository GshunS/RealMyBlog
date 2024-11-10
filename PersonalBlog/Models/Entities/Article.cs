namespace PersonalBlog.Models.Entities;

public class Article: BaseModel
{
    public string title { get; set; }
    public string content { get; set; }
    public string json_content { get; set; }

    public int author_id { get; set; }
    public Author author { get; set; } = null!;

    public int view_count { get; set; }
    public int upvote_count { get; set; }
    public bool is_hide { get; set; }
    public DateTime created_time { get; set; }
    public DateTime update_time { get; set; }

    public int category_id { get; set; }
    public Category category { get; set; } = null!;

    public ICollection<ArticleImage> ArticleImages {get; set;} = new List<ArticleImage>();

}
