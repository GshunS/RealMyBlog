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
        base.CreateMap<ArticleUpdateDTO, Article>()
            .ForAllMembers(
                opts => opts.Condition((src, dest, srcMember) =>
                    srcMember != null
                )
            );
        base.CreateMap<Article, ArticleUpdateDTO>();

        base.CreateMap<Article, ArticleDisplayDTO>();
        base.CreateMap<Category, CategoryDisplayDTO>();
        base.CreateMap<ArticleImage, ArticleImageDisplayDTO>()
            .ForMember(dest => dest.image_data, opt => opt.MapFrom(src => System.IO.File.ReadAllBytes(src.image_path))) 
            .ForMember(dest => dest.image_hashvalue, opt => opt.MapFrom(src => src.image_hashvalue))
            .ForMember(dest => dest.image_ext, opt => opt.MapFrom(src => Path.GetExtension(src.image_path)));
    }
}

