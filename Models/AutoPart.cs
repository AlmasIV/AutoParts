using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace AutoParts.Model;

public class AutoPart{
    public int Id { get; set; }
    [Required(ErrorMessage = "Название деталя обязательное поле."), MinLength(3), DisplayName("Название")]
    public string Name { get; set; }
    [Required(ErrorMessage = "Обязательно напишите на какие марки можно применять запчасть."), MinLength(3), DisplayName("Применяемость")]
    public string Applicability { get; set; }
    [Range(0, int.MaxValue), DisplayName("Цена(₽ - RUB)")]
    public decimal PriceInRubles { get; set; }
    [Range(0, int.MaxValue), DisplayName("Цена(₸ - KZT)")]
    public decimal PriceInTenge { get; set; }
    [DisplayName("Производитель")]
    public string Company { get; set; }
    [DisplayName("Фото")]
    public List<IFormFile>? Images { get; set; }
}