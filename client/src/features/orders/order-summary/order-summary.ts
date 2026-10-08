import { Component, inject, signal } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { CurrencyPipe, Location } from '@angular/common';
import { MatButton, MatIconButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { StripeService } from '../../../core/services/stripe.service';
import { disabled, form, FormField } from '@angular/forms/signals';
import { MatIcon } from '@angular/material/icon';

@Component({
  imports: [
    CurrencyPipe,
    MatButton,
    RouterLink,
    MatFormField,
    MatLabel,
    MatInput,
    MatIconButton,
    MatIcon,
    FormField
  ],
  selector: 'app-order-summary',
  styleUrl: './order-summary.css',
  templateUrl: './order-summary.html',
})
export class OrderSummary {
  protected cartService = inject(CartService);
  protected location = inject(Location);
  private router = inject(Router);
  private stripeService = inject(StripeService);
  loading = signal(false);
  couponPending = signal(false);

  async onCheckout() {
    this.loading.set(true);
    await this.router.navigateByUrl('/checkout');
    this.loading.set(false);
  }

  private couponModel = signal({
    code: this.cartService.cartResource.value()?.coupon?.name ?? ''
  });
  
  protected couponForm = form(this.couponModel, path => {
    disabled(path.code, {
      when: () => !!this.cartService.cartResource.value()?.coupon
    })
  });

  async applyCouponCode(event: Event) {
    event.preventDefault();
    if (!this.couponModel().code) return;
    this.couponPending.set(true);
    try {
      const coupon = await this.cartService.validateCoupon(this.couponModel().code);
      const cart = this.cartService.cartResource.value();
      if (cart) {
        cart.coupon = coupon;
        await this.cartService.setCart(cart);
        this.couponModel.set({ code: '' });
        if (this.location.path() === '/checkout') {
          await this.stripeService.createOrUpdatePaymentIntent();
        }
      }
    } catch (error) {
      this.couponModel.set({ code: '' });
    } finally {
      this.couponPending.set(false);
    }
  }

  async removeCouponCode() {
    const cart = this.cartService.cartResource.value();
    if (!cart) return;
    if (cart.coupon) cart.coupon = undefined;
    await this.cartService.setCart(cart);
    if (this.location.path() === '/checkout') {
      await this.stripeService.createOrUpdatePaymentIntent();
    }
  }
}
