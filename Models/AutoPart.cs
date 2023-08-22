using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace AutoParts.Model;

public class AutoPart{
    public int Id { get; set; }


    [Required(), MinLength(3)]
    public string Name { get; set; }


    [Required(), MinLength(3)]
    public string Applicability { get; set; }


    [Range(0, int.MaxValue), DisplayName("Price(₽ - RUB)")]
    public decimal PriceInRubles { get; set; }


    [Range(0, int.MaxValue), DisplayName("Price(₸ - KZT)")]
    public decimal PriceInTenge { get; set; }


    public string? Company { get; set; }


    [Range(0, short.MaxValue)]
    public short Amount { get; set; }


    public List<IFormFile>? Images { get; set; }
}