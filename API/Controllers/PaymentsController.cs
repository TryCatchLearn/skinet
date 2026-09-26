using System;
using API.Controllers;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace API;

public class PaymentsController(IPaymentService paymentService, IUnitOfWork unit, 
    IOrderService orderService, IConfiguration config, ILogger<PaymentsController> logger) 
        : BaseApiController
{
    private readonly string _whSecret = config["StripeSettings:WhSecret"]
        ?? throw new InvalidOperationException("Stripe webhook secret not configured");

    [Authorize]
    [HttpPost("{cartId}")]
    public async Task<ActionResult> CreateOrUpdatePaymentIntent(string cartId)
    {
        var cart = await paymentService.CreateOrUpdatePaymentIntent(cartId);

        if (cart == null) return BadRequest("Problem with your cart on the API");

        return Ok(cart);
    }

    [HttpGet("delivery-methods")]
    public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethods()
    {
        return Ok(await unit.Repository<DeliveryMethod>().ListAllAsync());
    }

    [AllowAnonymous]
    [HttpPost("webhook")]
    public async Task<IActionResult> StripeWebhook()
    {
        var json = await new StreamReader(Request.Body).ReadToEndAsync();

        try
        {
            var stripeEvent = EventUtility.ConstructEvent(json, 
                Request.Headers["Stripe-Signature"], _whSecret);

            if (stripeEvent.Type == "charge.succeeded" && stripeEvent.Data.Object is Charge charge)
            {
                await HandleChargeSucceeded(charge);
            }

            return Ok();
        }
        catch (StripeException e)
        {
            logger.LogError(e, "Stripe webhook signature verification failed");
            return BadRequest(e.Message);
        }
    }

    private async Task HandleChargeSucceeded(Charge charge)
    {
        var cartId = charge.Metadata.GetValueOrDefault("cartId");
        var card = charge.PaymentMethodDetails?.Card;
        var buyerEmail = charge.BillingDetails?.Email;

        if (cartId == null || card == null || charge.Shipping == null || buyerEmail == null)
        {
            logger.LogWarning("Charge {ChargeId} succeeded but is missing data needed to create an order", charge.Id);
            return;
        }

        var shippingAddress = new ShippingAddress
        {
            Name = charge.Shipping.Name,
            Line1 = charge.Shipping.Address.Line1,
            Line2 = charge.Shipping.Address.Line2,
            City = charge.Shipping.Address.City,
            Country = charge.Shipping.Address.Country,
            State = charge.Shipping.Address.State,
            PostalCode = charge.Shipping.Address.PostalCode
        };

        var paymentSummary = new PaymentSummary
        {
            Last4 = int.Parse(card.Last4),
            Brand = card.Brand,
            ExpMonth = (int)card.ExpMonth,
            ExpYear = (int)card.ExpYear
        };

        var order = await orderService.CreateOrderFromCart(cartId, shippingAddress, 
            paymentSummary, buyerEmail, (charge.PaymentIntentId, charge.Amount));

        if (order == null)
        {
            logger.LogWarning("Charge {ChargeId} succeeded but no order created", charge.Id);
        }
    }
}