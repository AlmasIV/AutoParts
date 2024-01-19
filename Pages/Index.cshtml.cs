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
        _databaseAccess = databaseAcess;
    }

    public IActionResult OnGet()
    {
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
    public IActionResult OnPost([FromBody]AutoPart[] autoParts){
        if(!ModelState.IsValid){
            return new BadRequestResult();
        }
        List<AutoPart>? genuineData = _databaseAccess.RetrieveByIds(autoParts.Select(x => x.Id));
        if(genuineData is null){
            return new ObjectResult(new {errorMessage = "The requested data doesn't correspond to the original one. Try to reload the page."}){
                StatusCode = StatusCodes.Status400BadRequest
            };
        }
        return new OkResult();
    }
}