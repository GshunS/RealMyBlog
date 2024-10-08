using AutoMapper;
using PersonalBlog.DTO.Create;
using PersonalBlog.DTO.Display;
using PersonalBlog.DTO.Update;
using PersonalBlog.Models.Entities;

namespace PersonalBlog.MyUtils.MyAutoMapper;

public class CustomAutoMapperProfile : Profile
{
    public CustomAutoMapperProfile()
    {
        base.CreateMap<AuthorCreateDTO, Author>();
        base.CreateMap<CategoryCreateDTO, Category>();
        base.CreateMap<ArticleCreateDTO, Article>();

        base.CreateMap<CategoryUpdateDTO, Category>();

        base.CreateMap<Article, ArticleDisplayDTO>();
        base.CreateMap<Category, CategoryDisplayDTO>();
    }
}

