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
            new IdentityRole{Id = "admin", Name = "Admin", NormalizedName = "ADMIN", ConcurrencyStamp = "admin"},
            new IdentityRole{Id = "customer", Name = "Customer", NormalizedName = "CUSTOMER", ConcurrencyStamp = "customer"}
        );
    }
}
