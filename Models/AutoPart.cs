using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.Text.Json.Serialization;

namespace AutoParts.Model;

public class AutoPart{
    [JsonPropertyName("id")]
    public int Id { get; set; }


    [Required(), MinLength(3)]
    [JsonPropertyName("name")]
    public string Name { get; set; }


    [Required(), MinLength(3)]
    [JsonPropertyName("applicability")]
    public string Applicability { get; set; }

    [JsonPropertyName("company")]
    public string? Company { get; set; }


    [Range(0, int.MaxValue), DisplayName("Price(₽ - RUB)")]
    [JsonPropertyName("priceInRubles")]
    public decimal PriceInRubles { get; set; }


    [Range(0, int.MaxValue), DisplayName("Price(₸ - KZT)")]
    [JsonPropertyName("priceInTenge")]
    public decimal PriceInTenge { get; set; }


    [Range(0, short.MaxValue)]
    [JsonPropertyName("amount")]
    public short Amount { get; set; }

    [JsonIgnore]
    public List<IFormFile>? Images { get; set; }
}