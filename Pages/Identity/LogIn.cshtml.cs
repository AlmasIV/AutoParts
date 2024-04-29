using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace AutoParts.Pages.Identity;
public class LogInModel : PageModel {
    private SignInManager<IdentityUser> SignInManager { get; set; }
    private UserManager<IdentityUser> UserManager { get; set; }
    public LogInModel(SignInManager<IdentityUser> signInManager, UserManager<IdentityUser> userManager){
        SignInManager = signInManager;
        UserManager = userManager;
    }
    public IActionResult OnGet(){
        return Page();
    }

    [Required]
    [EmailAddress]
    [BindProperty]
    public string? Email { get; set; }

    [Required]
    [BindProperty]
    public string? Password { get; set; }
    public async Task<IActionResult> OnPostAsync(){
        if(ModelState.IsValid){
            IdentityUser? user = await UserManager.FindByEmailAsync(Email!);
            if(user is not null){
                SignInResult result = await SignInManager.PasswordSignInAsync(Email!, Password!, true, true);
                if(result.Succeeded){
                    return RedirectToPage("../Index");
                }
            }
        }
        ModelState.AddModelError(String.Empty, "The email or password is incorrect.");
        return Page();
    }
}