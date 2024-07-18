using PersonalBlog.Models;
using Microsoft.EntityFrameworkCore;
using PersonalBlog.Repository.PersonalBlog.IRepository;
using PersonalBlog.Repository.PersonalBlog.Repository;
using PersonalBlog.Service.PersonalBlog.IService;
using PersonalBlog.Service.PersonalBlog.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.ApiKey,
                Description = "input 'Bearer token'",
                Name = "Authorization",
                BearerFormat = "JWT",
                Scheme = "Bearer"
        });
        c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
          {
            new OpenApiSecurityScheme
            {
              Reference=new OpenApiReference
              {
                Type=ReferenceType.SecurityScheme,
                Id="Bearer"
              }
            },
            new string[] {}
          }
        });
});

var serverVersion = new MySqlServerVersion(new Version(8, 0, 35));
builder.Services.AddDbContext<BloggingContext>(
        options => options.UseMySql(builder.Configuration["ConnectionString"], serverVersion));


// Dependency Injection
builder.Services.AddScoped<IAuthorRepository, AuthorRepository>();
builder.Services.AddScoped<IArticleImageRepository, ArticleImageRepository>();
builder.Services.AddScoped<IArticleRepository, ArticleRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();

builder.Services.AddScoped<IAuthorService, AuthorService>();
builder.Services.AddScoped<IArticleImageService, ArticleImageService>();
builder.Services.AddScoped<IArticleService, ArticleService>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();



builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                            ValidateIssuerSigningKey = true,
                            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("SHUN-CJAS1-SAD-DFSFA-SADHJVF-VFKSDK")),
                            ValidateIssuer = true,
                            ValidIssuer = "http://localhost:7219",
                            ValidateAudience = true,
                            ValidAudience = "http://localhost:7219",
                            ValidateLifetime = true,
                            ClockSkew = TimeSpan.FromMinutes(60)
                    };
            });




var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();

// // Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {

// }

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

app.Run();
