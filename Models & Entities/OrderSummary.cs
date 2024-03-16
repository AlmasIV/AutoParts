using System.ComponentModel.DataAnnotations;

namespace AutoParts.Models;

public class OrderSummary {
    [Required]
    [MinLength(1)]
    public AutoPart[] OrderedParts { get; set; } = null!;
    public decimal TotalPrice { get; set; }
}