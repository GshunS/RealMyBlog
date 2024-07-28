namespace PersonalBlog.DTO.Display;

public class CategoryChildrenDisplayDTO
{
    public Dictionary<string, bool>? CategoryDict { get; set; }
    public List<ArticleForCategoryDisplayDTO>? Articles {get; set;}   
}
