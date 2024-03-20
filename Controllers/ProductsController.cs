using Microsoft.AspNetCore.Mvc;
using AutoParts.Models;

using Microsoft.EntityFrameworkCore;

namespace AutoParts.WebApi;

[Route("api/products")]
public class ProductsController : Controller
{
    private readonly AppDbContext _dbContext;
    public ProductsController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    [HttpGet("{id}")]
    public IActionResult GetProduct(int id)
    {
        if(id <= 0){
            return GetJsonResponseMessage($"The ID can't be equal to or less than 0. ID = {id}", StatusCodes.Status400BadRequest);
        }
        Order? order = _dbContext.Orders
            .Include(o => o.AutoPartSoldAmount)
            .ThenInclude(sa => sa.AutoPart)
            .AsNoTracking()
            .Where(o => o.Id == id)
            .FirstOrDefault();
        
        if(order is null){
            return GetJsonResponseMessage("Data not found.", StatusCodes.Status404NotFound);
        }
        return Json(order.AutoPartSoldAmount);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteProduct(int id){
        if(id <= 0){
            return GetJsonResponseMessage($"The ID can't be equal to or less than 0. ID = {id}", StatusCodes.Status400BadRequest);
        }
        Console.WriteLine("Deleting the product ID: " + id);
        return GetJsonResponseMessage("Successfully deleted an item.", StatusCodes.Status200OK);
    }
    
    [HttpPut()]
    public IActionResult Sell([FromBody] OrderSummary order)
    {
        if (!ModelState.IsValid)
        {
            return GetJsonResponseMessage("Invalid request.", StatusCodes.Status400BadRequest);
        }
        AutoPart[] orderedParts = order.OrderedParts;
        AutoPart? temp = null;
        decimal totalPrice = 0;
        int totalAmount = 0;
        var originalData = _dbContext.AutoParts.Where(x => orderedParts.Select(x => x.Id).Contains(x.Id)).Include(auto => auto.Orders);
        if (!originalData.Any() || orderedParts.Length != originalData.Count())
        {
            return GetJsonResponseMessage("Data not found.", StatusCodes.Status404NotFound);
        }

        foreach (AutoPart orderedPart in orderedParts)
        {
            if (originalData.Contains(orderedPart))
            {
                temp = originalData.First(part => part.Id == orderedPart.Id);
                if (temp.Amount < orderedPart.Amount)
                {
                    return GetJsonResponseMessage($"The requested quantity for {orderedPart.Amount} for the '{orderedPart.Name} (ID: {orderedPart.Id})' exceeds current stock level ({temp.Amount}).", StatusCodes.Status409Conflict);
                }
                if (temp.Company == orderedPart.Company
                    && temp.Applicability == orderedPart.Applicability
                    && temp.Name == orderedPart.Name
                    && temp.PriceInRubles == orderedPart.PriceInRubles
                    && temp.PriceInTenge == orderedPart.PriceInTenge)
                {
                    totalPrice += orderedPart.Amount * temp.PriceInTenge;
                    temp.Amount -= orderedPart.Amount;
                    totalAmount += orderedPart.Amount;
                }
                else
                {
                    Console.WriteLine(
                        $"Company: '{temp.Company}' & '{orderedPart.Company}'\n" + $"Applicability: '{temp.Applicability}' & '{orderedPart.Applicability}'\n" + $"Name: '{temp.Name}' & '{orderedPart.Name}'\n" + $"Price in RUB: '{temp.PriceInRubles}' & '{orderedPart.PriceInRubles}'\n" + $"Price in KZT: '{temp.PriceInTenge}' & '{orderedPart.PriceInTenge}'\n"
                    );
                    return GetJsonResponseMessage($"Inconsistency with the original data. (Requested Product: Name: '{orderedPart.Name}', ID: {orderedPart.Id}).", StatusCodes.Status409Conflict);
                }
            }
            else
            {
                return GetJsonResponseMessage($"Request contains data that can't be found. (Name: '{orderedPart.Name}', ID: {orderedPart.Id}).", StatusCodes.Status404NotFound);
            }
        }
        if (totalPrice != order.TotalPrice)
        {
            return GetJsonResponseMessage($"Price calculation is not correct. Total price is: ₸{totalPrice}, but you requested product for the total of ₸{order.TotalPrice}.", StatusCodes.Status409Conflict);
        }

        Order thisOrder = new Order()
        {
            TotalPrice = totalPrice,
            Count = totalAmount,
            AutoPartSoldAmount = new List<AutoPartSoldAmount>()
        };

        foreach (AutoPart autoPart in originalData)
        {
            autoPart.Orders!.Add(thisOrder);
            AutoPartSoldAmount soldAmount = new AutoPartSoldAmount(){
                SoldAmount = orderedParts.First(a => a.Id == autoPart.Id).Amount,
                AutoPart = autoPart
            };
            thisOrder.AutoPartSoldAmount.Add(soldAmount);
        }

        _dbContext.SaveChanges();
        return GetJsonResponseMessage("Changes successfully applied.", StatusCodes.Status200OK);
    }

    [NonAction]
    private JsonResult GetJsonResponseMessage(string message, int code)
    {
        return new JsonResult(new { message = message })
        {
            StatusCode = code
        };
    }
}