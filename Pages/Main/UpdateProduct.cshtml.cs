using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.ComponentModel.DataAnnotations;

using Microsoft.EntityFrameworkCore;

using AutoParts.Models;

namespace AutoParts.Pages.Main;
public class UpdateProductModel : PageModel
{
    private readonly AppDbContext _dbContext;
    public UpdateProductModel(AppDbContext dbContext){
        _dbContext = dbContext;
    }
    public IActionResult OnGet(int id)
    {
        AutoPart? autoPart = _dbContext.AutoParts.AsNoTracking().FirstOrDefault(a => a.Id == id);
        if(autoPart is null){
            return new NotFoundResult();
        }
        ViewData[nameof(AutoPart)] = autoPart;
        return Page();
    }

    [Required]
    [BindProperty]
    public AutoPart? AutoPart { get; set; }
    public IActionResult OnPost(){
        if(ModelState.IsValid){
            AutoPart? originalPart = _dbContext.AutoParts.AsNoTracking().FirstOrDefault(ap => ap.Id == AutoPart!.Id);

            if(originalPart is null){
                return new NotFoundResult();
            }

            _dbContext.AutoParts.Update(AutoPart!);

            _dbContext.SaveChanges();
            
            return RedirectToPage("../Index");
        }
        return Page();
    }
}