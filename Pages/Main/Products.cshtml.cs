using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.RazorPages;

using Microsoft.EntityFrameworkCore;

using AutoParts.Models;

namespace AutoParts.Pages
{
    public class ProductsModel : PageModel
    {
        private readonly AppDbContext _dbContext;
        public AutoPart? requestedPart = null;
        public ProductsModel(AppDbContext dbContext){
            _dbContext = dbContext;
        }
        public IActionResult OnGet(int id)
        {
            requestedPart = _dbContext.AutoParts.AsNoTracking().FirstOrDefault(a => a.Id == id);
            if(requestedPart is null){
                return new NotFoundResult();
            }
            return Page();
        }

        public IActionResult OnPost(int id){
            Console.WriteLine("Everything is fine!");
            return new OkResult();
        }
    }
}
