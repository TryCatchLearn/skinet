using System;
using Core.Entities.OrderAggregate;

namespace Core.Interfaces;

public interface IOrderService
{
    Task<Order?> CreateOrderFromCart(string cartId, ShippingAddress shippingAddress, 
        PaymentSummary paymentSummary, string buyerEmail, 
        (string PaymentIntentId, long AmountInCents)? verifiedPayment = null);
}
