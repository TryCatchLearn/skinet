using System;
using Core.Entities;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace Infrastructure.Services;

public class CouponService : ICouponService
{
    public CouponService(IConfiguration config)
    {
        StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];
    }

    public async Task<AppCoupon?> GetCouponFromPromoCode(string code)
    {
        var promotionService = new PromotionCodeService();

        var options = new PromotionCodeListOptions
        {
            Code = code,
            Expand = ["data.promotion.coupon"]
        };

        var promotionCodes = await promotionService.ListAsync(options);

        var promotionCode = promotionCodes.FirstOrDefault();

        if (promotionCode?.Promotion.Coupon == null) return null;

        var coupon = promotionCode.Promotion.Coupon;

        return new AppCoupon
        {
            Name = coupon.Name,
            AmountOff = coupon.AmountOff,
            PercentOff = coupon.PercentOff,
            CouponId = coupon.Id,
            PromotionCode = promotionCode.Code
        };

    }
}
