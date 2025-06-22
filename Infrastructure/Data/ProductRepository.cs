using System;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class ProductRepository(StoreContext context) : IProductRepository
{
    public async Task<IReadOnlyList<Product>> GetProductsAsync(string? brand, string? type, string? sort)
    {
        var query = context.Products.AsQueryable();

        if (!string.IsNullOrWhiteSpace(brand))
        {
            query = query.Where(p => p.Brand == brand);
        }

        if (!string.IsNullOrWhiteSpace(type))
        {
            query = query.Where(p => p.Type == type);
        }

        query = sort switch
        {
            "priceAsc" => query.OrderBy(p => p.Price),
            "priceDesc" => query.OrderByDescending(p => p.Price),
            _ => query.OrderBy(p => p.Name)
        };

        return await query.ToListAsync();
    }

    public async Task<Product?> GetProductByIdAsync(int id)
    {
        return await context.Products.FindAsync(id);
    }

    public void AddProduct(Product product)
    {
        context.Products.Add(product);
    }

    public void UpdateProduct(Product product)
    {
        context.Entry(product).State = EntityState.Modified;
    }

    public void DeleteProduct(Product product)
    {
        context.Products.Remove(product);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public bool ProductExists(int id)
    {
        return context.Products.Any(x => x.Id == id);
    }

    public async Task<IReadOnlyList<string>> GetBrandsAsync()
    {
        return await context.Products.Select(p => p.Brand)
            .Distinct()
            .ToListAsync();
    }

    public async Task<IReadOnlyList<string>> GetTypesAsync()
    {
        return await context.Products.Select(p => p.Type)
            .Distinct()
            .ToListAsync();
    }
}
