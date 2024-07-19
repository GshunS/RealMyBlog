namespace PersonalBlog.DTO.Create;

public class ArticleCreateDTO
{
    public string title { get; set; }
    public string content { get; set; }

    public int category_id { get; set; }
}
