using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using AutoParts.Models;

using Microsoft.EntityFrameworkCore;

namespace AutoParts.Pages
{
    public class HistoryModel : PageModel
    {
        private readonly AppDbContext _dbContext;
        [BindNever]
        public List<Order>? Orders { get; set; } = null;
        public HistoryModel(AppDbContext dbContext){
            _dbContext = dbContext;
        }
        public void OnGet()
        {
            Orders = _dbContext.Orders.AsNoTracking().ToList();
        }
    }
}
