namespace PersonalBlog.Models;

public class ArticleImage: BaseModel
{
    public string image_name {get; set;}
    public string image_path {get; set;}
    public int position {get; set;}

    public int article_id {get; set;}
    public Article article {get; set;} = null!;
}
