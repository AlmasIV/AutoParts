using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel;
using System.Text.Json.Serialization;

namespace AutoParts.Models;

public class AutoPart{
    [JsonPropertyName("id")]
    public int Id { get; set; }


    [Required(), MinLength(3)]
    [JsonPropertyName("name")]
    public string Name { get; set; } = null!;


    [Required(), MinLength(3)]
    [JsonPropertyName("applicability")]
    public string Applicability { get; set; } = null!;


    [JsonPropertyName("company")]
    public string? Company { get; set; }


    [Range(0, int.MaxValue), DisplayName("Price(₽ - RUB)")]
    [JsonPropertyName("priceInRubles")]
    [Column(TypeName = "decimal(10, 2)")]
    public decimal PriceInRubles { get; set; }


    [Range(0, int.MaxValue), DisplayName("Price(₸ - KZT)")]
    [JsonPropertyName("priceInTenge")]
    [Column(TypeName = "decimal(10, 2)")]
    public decimal PriceInTenge { get; set; }


    [Range(0, short.MaxValue)]
    [JsonPropertyName("amount")]
    public short Amount { get; set; }


    [JsonIgnore]
    public List<Order>? Orders { get; set; }

    
    [JsonIgnore]
    public List<AutoPartOrder>? AutoPartOrders { get; set; }
}