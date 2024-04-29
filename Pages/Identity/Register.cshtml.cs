using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

using AutoParts.Additions;

namespace AutoParts.Pages.Identity;

public class RegisterModel : PageModel {
    private UserManager<IdentityUser> UserManager { get; set; }
    public RegisterModel(UserManager<IdentityUser> userManager){
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

    [Required]
    [BindProperty]
    public string? ConfirmedPassword { get; set; }

    public async Task<IActionResult> OnPostAsync(){
        if(!ModelState.IsValid){
            return Page();
        }
        
        if(Password != ConfirmedPassword){
            ModelState.AddModelError(String.Empty, "Password and its confirmation must be identical.");
            return Page();
        }

        IdentityUser? user = await UserManager.FindByEmailAsync(Email!);

        if(user is null){
            user = new IdentityUser(){
                UserName = Email!,
                Email = Email!,
                EmailConfirmed = false
            };

            IdentityResult result = await UserManager.CreateAsync(user);

            if(result.Process(ModelState)){
                result = await UserManager.AddPasswordAsync(user, Password!);

                if(result.Process(ModelState)){
                    return RedirectToPage("./LogIn");
                }
                else{
                    await UserManager.DeleteAsync(user);
                }
            }
        }
        else{
            ModelState.AddModelError(String.Empty, "The email is already registered.");
        }
        return Page();
    }
}