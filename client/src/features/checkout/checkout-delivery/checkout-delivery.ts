import { Component, effect, inject, output } from '@angular/core';
import { CheckoutService } from '../../../core/services/checkout.service';
import { CartService } from '../../../core/services/cart.service';
import { MatRadioGroup, MatRadioButton, MatRadioChange } from '@angular/material/radio';
import { CurrencyPipe } from '@angular/common';
import { StripeService } from '../../../core/services/stripe.service';

@Component({
  imports: [MatRadioGroup, MatRadioButton, CurrencyPipe],
  selector: 'app-checkout-delivery',
  styleUrl: './checkout-delivery.css',
  templateUrl: './checkout-delivery.html',
})
export class CheckoutDelivery {
  protected checkoutService = inject(CheckoutService);
  protected cartService = inject(CartService);
  private stripeService = inject(StripeService);
  deliveryComplete = output<boolean>();

  constructor() {
    effect(() => this.deliveryComplete.emit(!!this.cartService.cartResource.value()?.deliveryMethodId))
  }

  async updateDeliveryMethod(event: MatRadioChange) {
    let cart = this.cartService.cartResource.value();
    if (!cart) return;
    cart = {...cart, deliveryMethodId: event.value.id};
    await this.cartService.setCart(cart);
    await this.stripeService.createOrUpdatePaymentIntent();
  }
}
