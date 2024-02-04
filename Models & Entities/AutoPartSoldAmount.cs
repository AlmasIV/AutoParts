namespace AutoParts.Models;

public class AutoPartSoldAmount {
    public int Id { get; set; }
    public int AutoPartId { get; set; }
    public AutoPart AutoPart { get; set; } = null!;
    public int SoldAmount { get; set; }
}