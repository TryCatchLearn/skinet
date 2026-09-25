using System;
using Core.Entities;
using Infrastructure.Config;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class StoreContext(DbContextOptions options) : IdentityDbContext<AppUser>(options)
{
    public DbSet<Product> Products { get; set; }
    public DbSet<Address> Addresses { get; set; }
    public DbSet<DeliveryMethod> DeliveryMethods { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ProductConfiguration).Assembly);
    }
}
