using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;


using AutoParts.Models;

namespace AutoParts.Pages;
public class UploadModel : PageModel
{
    private readonly AppDbContext _dbContext;
    [BindProperty]
    public AutoPart? AutoPart { get; set; }
    public UploadModel(AppDbContext dbContext){
        _dbContext = dbContext;
    }
    public void OnGet(){}
    public IActionResult OnPost(){
        if(ModelState.IsValid){
            _dbContext.AutoParts.Add(AutoPart!);
            _dbContext.SaveChanges();
            return RedirectToPage("../Index");
        }
        return Page();
    }
}