namespace PersonalBlog.DTO.Display;

public class CategoryChildrenDisplayDTO
{
    public bool HasChildren { get; set; }
    public Dictionary<string, dynamic>? SubCategories { get; set; }
    public Dictionary<int, string>? Articles {get; set;}   
}
