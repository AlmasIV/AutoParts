using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace AutoParts
{
    public class Error : PageModel
    {
        public IActionResult OnGet(string? statusCode)
        {
            Console.WriteLine($"Here's the status code: {statusCode}" + statusCode);
            return Page();
        }
    }
}
