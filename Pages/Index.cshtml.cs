using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using AutoParts.Models;

namespace AutoParts.Pages;

public class IndexModel : PageModel
{
    private readonly AppDbContext _dbContext;
    [BindNever]
    public List<AutoPart>? AutoParts { get; set; } = null;
    public IndexModel(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public IActionResult OnGet()
    {
        try{
            AutoParts = _dbContext.AutoParts.ToList();
            return Page();
        }
        catch(Exception exception){
            Console.WriteLine("An exception has occurred. " + exception.Message);
            return File("~/html/ErrorPages/serverError.html", "text/html");
        }
    }
    [HttpPost]
    public IActionResult OnPost([FromBody]OrderSummary order){
        if(!ModelState.IsValid){
            return GetJsonResponse("Invalid request.", StatusCodes.Status400BadRequest);
        }
        AutoPart[] orderedParts = order.OrderedParts;
        AutoPart? temp = null;
        decimal totalPrice = 0;
        var originalData = _dbContext.AutoParts.Where(x => orderedParts.Select(x => x.Id).Contains(x.Id));
        if(!originalData.Any() || orderedParts.Length != originalData.Count()){
            return GetJsonResponse("Data not found.", StatusCodes.Status404NotFound);
        }

        foreach(AutoPart orderedPart in orderedParts){
            if(originalData.Contains(orderedPart)){
                temp = originalData.First(part => part.Id == orderedPart.Id);
                if(temp.Amount < orderedPart.Amount){
                    return GetJsonResponse($"The requested quantity for {orderedPart.Amount} for the '{orderedPart.Name} (ID: {orderedPart.Id})' exceeds current stock level ({temp.Amount}).", StatusCodes.Status409Conflict);
                }
                if(temp.Company == orderedPart.Company
                    && temp.Applicability == orderedPart.Applicability
                    && temp.Name == orderedPart.Name
                    && temp.PriceInRubles == orderedPart.PriceInRubles
                    && temp.PriceInTenge == orderedPart.PriceInTenge){
                        totalPrice += orderedPart.Amount * temp.PriceInTenge;
                        temp.Amount -= orderedPart.Amount;
                }
                else{
                    return GetJsonResponse($"Inconsistency with the original data. (Requested Product: Name: '{orderedPart.Name}', ID: {orderedPart.Id}).", StatusCodes.Status409Conflict);
                }
            }
            else{
                return GetJsonResponse($"Request contains data that can't be found. (Name: '{orderedPart.Name}', ID: {orderedPart.Id}).", StatusCodes.Status404NotFound);
            }
        }
        
        _dbContext.SaveChanges();

        JsonResult GetJsonResponse(string message, int code){
            return new JsonResult(new { message = message }){
                StatusCode = code
            };
        }
        return GetJsonResponse("Changes successfully applied.", StatusCodes.Status200OK);
    }
}