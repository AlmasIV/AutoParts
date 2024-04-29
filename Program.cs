using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace AutoParts;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddRazorPages(options => {
            options.Conventions.AuthorizePage("/Index");
            options.Conventions.AuthorizeFolder("/Main").AllowAnonymousToPage("/Main/Error");
            options.Conventions.AuthorizeFolder("/Identity").AllowAnonymousToPage("/Identity/Login").AllowAnonymousToPage("/Identity/Register");
        });

        builder.Services.AddAntiforgery();

        builder.Services.AddControllers();

        builder.Services.AddDbContext<AppDbContext>(options => {
            options.UseSqlServer(builder.Configuration.GetConnectionString("LocalConnectionString") ?? throw new NullReferenceException("The connection string wasn't found."), options => {
                options.EnableRetryOnFailure();
            });
        });

        builder.Services.AddDbContext<IdentityDbContext>(options => {
            options.UseSqlServer(builder.Configuration.GetConnectionString("IdentityConnection") ?? throw new NullReferenceException("The connection string wasn't found."), options => {
                options.EnableRetryOnFailure();
                options.MigrationsAssembly("AutoParts");
            });
        });

        builder.Services.AddIdentity<IdentityUser, IdentityRole>(options => {
            options.Password.RequiredLength = 12;
            options.Password.RequireDigit = true;
            options.Password.RequiredUniqueChars = 2;
            options.Password.RequireLowercase = true;
            options.Password.RequireNonAlphanumeric = true;
            options.Password.RequireUppercase = true;

            options.User.RequireUniqueEmail = true;
        }).AddEntityFrameworkStores<IdentityDbContext>().AddDefaultTokenProviders();

        builder.Services.Configure<SecurityStampValidatorOptions>(options => {
            options.ValidationInterval = TimeSpan.FromMinutes(2);
        });

        builder.Services.AddAuthentication();
        builder.Services.AddAuthorization();

        builder.Services.ConfigureApplicationCookie(options => {
            options.LoginPath = "/Identity/LogIn";
            options.ExpireTimeSpan = TimeSpan.FromDays(7);
        });
        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (!app.Environment.IsDevelopment())
        {
            app.UseExceptionHandler("/Main/Error/{statusCode?}");
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts();
        }

        app.UseHttpsRedirection();

        app.UseStaticFiles();
        
        app.UseRouting();

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapRazorPages().RequireAuthorization();

        app.MapControllers();
        
        app.Run();
    }
}
