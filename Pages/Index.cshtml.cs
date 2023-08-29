using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using AutoParts.Model;

namespace AutoParts.Pages;

public class IndexModel : PageModel
{
    private readonly DatabaseAcess _databaseAccess;
    [BindNever]
    public List<AutoPart>? AutoParts { get; set; } = null;
    public IndexModel(DatabaseAcess databaseAcess)
    {
        _databaseAccess = databaseAcess;
    }

    public IActionResult OnGet()
    {
        (bool isSuccess, List<AutoPart>? autoParts) outputs = _databaseAccess.RetrieveAll();
        if(outputs.isSuccess){
            AutoParts = outputs.autoParts;
            return Page();
        }
        return File("~/html/ErrorPages/serverError.html", "text/html");
    }
}