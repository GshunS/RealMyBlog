using AutoMapper;
using PersonalBlog.DTO.Create;
using PersonalBlog.Models.Entities;

namespace PersonalBlog.MyUtils.MyAutoMapper;

public class CustomAutoMapperProfile : Profile
{
    public CustomAutoMapperProfile()
    {
        base.CreateMap<AuthorCreateDTO, Author>();
    }
}

