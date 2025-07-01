using System;
using Core.Entities;

namespace Core.Interfaces;

public interface ICouponService
{
    Task<AppCoupon?> GetCouponFromPromoCode(string code);
}
