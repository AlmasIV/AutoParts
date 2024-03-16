using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using AutoParts.Models;

namespace AutoParts.Pages;

public class IndexModel : PageModel
{
    private readonly AppDbContext _dbContext;
    [BindNever]
    public List<AutoPart> AutoParts { get; set; } = null!;
    public IndexModel(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public IActionResult OnGet()
    {
        try{
            AutoParts = _dbContext.AutoParts.ToList();
            return Page();
        }
        catch(Exception exception){
            Console.WriteLine("An exception has occurred. " + exception.Message);
            return File("~/html/ErrorPages/serverError.html", "text/html");
        }
    }
}