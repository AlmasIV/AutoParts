using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.ComponentModel.DataAnnotations;

using AutoParts.Models;

namespace AutoParts.Pages.Main;
public class UploadModel : PageModel
{
    private readonly AppDbContext _dbContext;
    public UploadModel(AppDbContext dbContext){
        _dbContext = dbContext;
    }
    public IActionResult OnGet(){
        return Page();
    }

    [Required]
    [BindProperty]
    public AutoPart? AutoPart { get; set; }

    public IActionResult OnPost(){
        if(ModelState.IsValid){
            _dbContext.AutoParts.Add(AutoPart!);
            _dbContext.SaveChanges();
            return RedirectToPage("../Index");
        }
        return Page();
    }
}