using System;

namespace Core.Specifications;

public class OrderSpecParams : PagingParams
{
    public string? Status { get; set; }
}
