namespace PersonalBlog.Models;

public class Author: BaseModel
{
    public string nickname { get; set; }
    public string username { get; set; }
    public string password { get; set; }

    public ICollection<Article> Articles { get; set; } = new List<Article>();
}
