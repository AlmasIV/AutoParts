using Microsoft.EntityFrameworkCore;
using AutoParts.Models;

namespace AutoParts;

public class AppDbContext : DbContext{
    public DbSet<AutoPart> AutoParts => Set<AutoPart>();
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){} 
}