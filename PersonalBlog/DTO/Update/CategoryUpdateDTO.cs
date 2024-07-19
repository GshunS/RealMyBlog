namespace PersonalBlog.DTO.Update;

public class CategoryUpdateDTO
{
    public int id { get; set; }
    public string first_category { get; set; }
    public string? second_category { get; set; }
    public string? third_category { get; set; }
    public string? fourth_category { get; set; }
}
