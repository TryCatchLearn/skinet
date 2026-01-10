using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Config;

public class RoleConfiguration : IEntityTypeConfiguration<IdentityRole>
{
    public void Configure(EntityTypeBuilder<IdentityRole> builder)
    {
        builder.HasData(
            new IdentityRole{Id = "admin-id", ConcurrencyStamp = "admin", Name = "Admin", NormalizedName= "ADMIN"},
            new IdentityRole{Id = "customer-id", ConcurrencyStamp = "customer", Name = "Customer", NormalizedName= "CUSTOMER"}
        );
    }
}