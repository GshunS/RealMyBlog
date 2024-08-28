namespace PersonalBlog.DTO.Display;

public class CategoryChildrenDisplayDTO
{
    public int ?CategoryId {get; set;}
    public bool HasChildren { get; set; }
    public Dictionary<string, dynamic>? SubCategories { get; set; }
    public Dictionary<int, string>? Articles {get; set;}   
}
