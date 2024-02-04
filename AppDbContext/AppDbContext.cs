using Microsoft.EntityFrameworkCore;
using AutoParts.Models;

namespace AutoParts;

public class AppDbContext : DbContext{
    public DbSet<AutoPart> AutoParts => Set<AutoPart>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<AutoPartOrder> AutoPartOrders => Set<AutoPartOrder>();
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){}
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AutoPart>()
            .HasMany(part => part.Orders)
            .WithMany(order => order.AutoParts)
            .UsingEntity<AutoPartOrder>(
                j => j
                    .HasOne(ao => ao.Order)
                    .WithMany(o => o.AutoPartOrders)
                    .HasForeignKey(ao => ao.OrdersId),
                j => j
                    .HasOne(ao => ao.AutoPart)
                    .WithMany(a => a.AutoPartOrders)
                    .HasForeignKey(ao => ao.AutoPartsId),
                j => {
                    j.HasKey(t => new { t.AutoPartsId, t.OrdersId });
                    j.ToTable("AutoPartOrders");
                }
            );
        modelBuilder.Entity<Order>()
            .Property(x => x.CreatedOn)
            .HasDefaultValueSql("SYSUTCDATETIME()");
    }
}