using Microsoft.EntityFrameworkCore;

namespace AutoParts;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddRazorPages();

        builder.Services.AddAntiforgery();

        builder.Services.AddControllers();

        string connectionString = builder.Configuration.GetConnectionString("LocalConnectionString") ?? "";
        builder.Services.AddDbContext<AppDbContext>(options => {
            options.UseSqlServer(connectionString, options => {
                options.EnableRetryOnFailure();
            });
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

        app.UseAuthorization();

        app.MapRazorPages();

        app.MapControllers();
        
        app.Run();
    }
}
