namespace AutoParts.Models;

public class AutoPartOrder {
    public int AutoPartsId { get; set; }
    public int OrdersId { get; set; }

    public AutoPart AutoPart { get; set; } = null!;
    public Order Order { get; set; } = null!;
}