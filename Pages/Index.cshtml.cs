using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using AutoParts.Model;
using System.Text.Json;

namespace AutoParts.Pages;

public class IndexModel : PageModel
{
    private readonly DatabaseAcess _databaseAccess;
    [BindNever]
    public List<AutoPart>? AutoParts { get; set; } = null;
    public List<string> JsonAutoParts { get; set; } = new List<string>();
    public IndexModel(DatabaseAcess databaseAcess)
    {
        Console.WriteLine("The constructor was called!");
        _databaseAccess = databaseAcess;
    }

    public IActionResult OnGet()
    {
        Console.WriteLine("OnGet is called!");
        (bool isSuccess, List<AutoPart>? autoParts) outputs = _databaseAccess.RetrieveAll();
        if(outputs.isSuccess){
            AutoParts = outputs.autoParts;
            foreach(AutoPart autoPart in AutoParts){
                JsonAutoParts.Add(JsonSerializer.Serialize(autoPart));
            }
            return Page();
        }
        return File("~/html/ErrorPages/serverError.html", "text/html");
    }
    [HttpPost]
    public IActionResult OnPost([FromBody]string jsonMessage){
        Console.WriteLine("OnPost is called!");
        return new OkResult();
    }
}