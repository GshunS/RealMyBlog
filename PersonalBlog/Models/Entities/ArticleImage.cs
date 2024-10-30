namespace PersonalBlog.Models.Entities;

public class ArticleImage: BaseModel
{
    public string image_path {get; set;}
    public string image_hashvalue {get; set;}
    public int article_id {get; set;}
    public Article article {get; set;} = null!;
}
