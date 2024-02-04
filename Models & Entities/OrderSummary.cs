using AutoParts.Models;
using System.ComponentModel.DataAnnotations;

namespace AutoParts.Models;

public class OrderSummary {
    [Required]
    [MinLength(1)]
    public AutoPart[] OrderedParts { get; set; }
    public decimal TotalPrice { get; set; }
}