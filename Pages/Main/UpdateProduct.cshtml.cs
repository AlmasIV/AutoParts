using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

using Microsoft.EntityFrameworkCore;

using AutoParts.Models;

namespace AutoParts.Pages
{
    public class UpdateProductModel : PageModel
    {
        private readonly AppDbContext _dbContext;
        public AutoPart? AutoPart;
        public UpdateProductModel(AppDbContext dbContext){
            _dbContext = dbContext;
        }
        public IActionResult OnGet(int id)
        {
            AutoPart = _dbContext.AutoParts.AsNoTracking().FirstOrDefault(a => a.Id == id);
            if(AutoPart is null){
                return new NotFoundResult();
            }
            return Page();
        }

        public IActionResult OnPost(AutoPart? autoPart){
            Console.WriteLine("Everything is OK: " + autoPart?.Name);
            return new OkResult();
        }
    }
}
