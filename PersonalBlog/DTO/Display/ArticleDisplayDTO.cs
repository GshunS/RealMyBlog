using PersonalBlog.Models.Entities;

namespace PersonalBlog.DTO.Display;

public class ArticleDisplayDTO
{
    public int id { set; get; }
    public string title { get; set; }
    public string? content { get; set; }
    public string? json_content { get; set; }
    public string? part_content { get; set; }

    public int author_id { get; set; }
    public string? author_name {get; set;}

    public int view_count { get; set; }
    public int upvote_count { get; set; }
    public bool is_hide { get; set; }
    public DateTime? created_time { get; set; }
    public DateTime? update_time { get; set; }

    public int? category_id { get; set; }
    public CategoryDisplayDTO? Category {get; set;}

}
