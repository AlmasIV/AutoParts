using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc;
using AutoParts.Models;

using Microsoft.EntityFrameworkCore;

namespace AutoParts.Pages.Main;    
public class HistoryModel : PageModel
{
    private readonly AppDbContext _dbContext;
    public HistoryModel(AppDbContext dbContext){
        _dbContext = dbContext;
    }
    
    [BindNever]
    public List<Order>? Orders { get; set; } = null;
    public IActionResult OnGet()
    {
        Orders = _dbContext.Orders.AsNoTracking().ToList();
        return Page();
    }
}
