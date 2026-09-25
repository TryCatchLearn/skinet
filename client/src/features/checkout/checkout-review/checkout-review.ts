import { Component, inject } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { StripeService } from '../../../core/services/stripe.service';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-checkout-review',
  styleUrl: './checkout-review.css',
  templateUrl: './checkout-review.html',
})
export class CheckoutReview {
  protected cartService = inject(CartService);
  protected stripeService = inject(StripeService);
}
