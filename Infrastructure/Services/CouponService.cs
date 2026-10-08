using System;
using Core.Entities;
using Core.Extensions;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace Infrastructure.Services;

public class CouponService(IConfiguration config) : ICouponService
{
    public async Task<long> CalculateDiscountFromSubtotal(AppCoupon appCoupon, long subtotal)
    {
        StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];

        var couponService = new Stripe.CouponService();

        var coupon = await couponService.GetAsync(appCoupon.CouponId);

        if (coupon.AmountOff.HasValue)
        {
            return Math.Min(coupon.AmountOff.Value, subtotal);
        }

        if (coupon.PercentOff.HasValue)
        {
            return Money.PercentOfCents(subtotal, coupon.PercentOff.Value);
        }

        return 0;
    }

    public async Task<AppCoupon?> GetCouponFromPromoCode(string code)
    {
        StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];

        var promotionService = new PromotionCodeService();

        var options = new PromotionCodeListOptions
        {
            Code = code,
            Limit = 1,
            Expand = ["data.promotion.coupon"]
        };

        var promotionCodes = await promotionService.ListAsync(options);
        var promotionCode = promotionCodes.Data.FirstOrDefault();

        if (promotionCode?.Promotion?.Coupon == null)
            return null;

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
