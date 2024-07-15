namespace PersonalBlog.Models;

public class Category : BaseModel
{
    public string first_category { get; set; }
    public string second_category { get; set; }
    public string third_category { get; set; }
    public string fourth_category { get; set; }

    public ICollection<Article> Articles { get; set; } = new List<Article>();
}
