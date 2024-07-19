namespace PersonalBlog.DTO.Update;

public class ArticleUpdateDTO
{
    public int id { set; get; }
    public string title { get; set; }

    public int view_count { get; set; }
    public int upvote_count { get; set; }
    public bool is_hide { get; set; }
    public int category_id { get; set; }

}
