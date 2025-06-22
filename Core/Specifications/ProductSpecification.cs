using System;
using Core.Entities;

namespace Core.Specifications;

public class ProductSpecification : BaseSpecification<Product>
{
    public ProductSpecification(ProductSpecParams productParams)
        : base(x =>
            (string.IsNullOrEmpty(productParams.Search)
                || x.Name.ToLower().Contains(productParams.Search)) &&
            (!productParams.Brands.Any() || productParams.Brands.Contains(x.Brand)) &&
            (!productParams.Types.Any() || productParams.Types.Contains(x.Type)))
    {
        ApplyPaging(productParams.PageSize * (productParams.PageIndex - 1), productParams.PageSize);

        switch (productParams.Sort)
        {
            case "priceAsc":
                AddOrderBy(x => x.Price);
                break;
            case "priceDesc":
                AddOrderByDescending(x => x.Price);
                break;
            default:
                AddOrderBy(x => x.Name);
                break;
        }
    }
}