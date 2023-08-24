using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.ModelBinding;

using AutoParts.Model;

namespace AutoParts.Pages;
public class UploadModel : PageModel
{
    private readonly DatabaseAcess _databaseAccess;
    [BindProperty]
    public AutoPart? AutoPart { get; set; }
    public UploadModel(DatabaseAcess databaseAcess){
        _databaseAccess = databaseAcess;
    }
    public void OnGet()
    {
        
    }
    public IActionResult OnPost(){
        if(ModelState.IsValid){
            bool isSuccess = _databaseAccess.InsertData(AutoPart!);
            return RedirectToPage("../Index");
        }
        return Page();
    }
}