using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace AutoParts.Additions;

public static class IdentityExtensions {
    public static bool Process(this IdentityResult result, ModelStateDictionary modelState){
        foreach(IdentityError error in result.Errors ?? Enumerable.Empty<IdentityError>()){
            modelState.AddModelError(string.Empty, error.Description);
        }
        return result.Succeeded;
    }
}