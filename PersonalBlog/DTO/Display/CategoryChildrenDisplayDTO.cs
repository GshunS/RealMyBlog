namespace PersonalBlog.DTO.Display;

public class CategoryChildrenDisplayDTO
{
    public List<string>? CategoryNames { get; set; }
    public List<ArticleForCategoryDisplayDTO>? Articles {get; set;}   
}
