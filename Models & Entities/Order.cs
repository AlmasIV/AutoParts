using System.ComponentModel.DataAnnotations.Schema;

namespace AutoParts.Models;

public class Order {
    public int Id { get; set; }
    public List<AutoPart> AutoParts { get; set; } = null!;
    public List<AutoPartOrder> AutoPartOrders { get; set; } = null!;
    [Column(TypeName = "decimal(10, 2)")]
    public decimal TotalPrice { get; set; }
    public int Count { get; set; }
    public List<AutoPartSoldAmount> AutoPartSoldAmount { get; set; } = null!;
    [Column(TypeName = "datetime2(0)")]
    public DateTime CreatedOn { get; set; }
}