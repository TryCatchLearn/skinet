import { afterRenderEffect, Component, computed, inject, signal } from '@angular/core';
import { OrderSummary } from '../orders/order-summary/order-summary';
import { MatStepper, MatStep, MatStepperNext, MatStepperPrevious } from '@angular/material/stepper';
import { StripeService } from '../../core/services/stripe.service';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatCheckbox } from '@angular/material/checkbox';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Address } from '../../core/models/user.model';
import { AccountService } from '../../core/services/account.service';
import { firstValueFrom } from 'rxjs';
import { CheckoutDelivery } from './checkout-delivery/checkout-delivery';
import { CheckoutReview } from './checkout-review/checkout-review';
import { CartService } from '../../core/services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { SnackbarService } from '../../core/services/snackbar.service';
import { StripeError } from '@stripe/stripe-js';
import { OrderToCreate, ShippingAddress } from '../../core/models/order.model';
import { OrderService } from '../../core/services/order.service';

enum CheckoutStep {
  Address,
  Delivery,
  Payment,
  Review
}

@Component({
  imports: [
    OrderSummary,
    MatStepper,
    MatStep,
    MatButton,
    MatStepperNext,
    RouterLink,
    MatCheckbox,
    CheckoutDelivery,
    MatStepperPrevious,
    CheckoutReview,
    CurrencyPipe
  ],
  selector: 'app-checkout',
  styleUrl: './checkout.css',
  templateUrl: './checkout.html',
})
export class Checkout {
  private stripeService = inject(StripeService);
  protected saveAddress = signal(false);
  private accountService = inject(AccountService);
  protected cartService = inject(CartService);
  protected addressComplete = signal(false);
  protected deliveryComplete = signal(false);
  protected paymentComplete = signal(false);
  private snackbar = inject(SnackbarService);
  protected processing = signal(false);
  private router = inject(Router);
  private orderService = inject(OrderService);

  protected checkoutComplete = computed(() => {
    return this.addressComplete() && this.deliveryComplete() && this.paymentComplete()
  })

  constructor() {
    afterRenderEffect(() => {
      const addressElement = this.stripeService.addressElementResource.value();
      if (addressElement) {
        addressElement.mount('#address-element');
        addressElement.on('change', event => this.addressComplete.set(event.complete))
      };

      const paymentElement = this.stripeService.paymentElementResource.value();
      if (paymentElement) {
        paymentElement.mount('#payment-element');
        paymentElement.on('change', event => this.paymentComplete.set(event.complete));
      };
    })
  }

  async onStepChange(event: StepperSelectionEvent) {
    if (event.selectedIndex === CheckoutStep.Delivery) {
      if (this.saveAddress()) {
        const address = await this.getAddressFromStripeAddress();
        address && void firstValueFrom(this.accountService.updateAddress(address))
      }
    }
    if (event.selectedIndex === CheckoutStep.Review) {
      const result = await this.stripeService.createConfirmationToken();
      if (result?.error) this.snackbar.error(result.error.message ?? 'Payment details invalid');
    }
  }

  async onConfirmPayment(stepper: MatStepper) {
    this.processing.set(true);
    try {
      const result = await this.stripeService.confirmPayment();
      if (result?.error) throw result.error;
      if (result?.paymentIntent?.status === 'succeeded') {
        this.createOrder();
      }
    } catch (error) {
      this.snackbar.error((error as StripeError)?.message ?? 'Payment could not be processed');
      stepper.previous();
    } finally {
      this.processing.set(false);
    }
  }

  private async createOrder() {
    try {
      const orderModel = await this.createOrderModel();
      const order = await firstValueFrom(this.orderService.createOrder(orderModel));
      this.cartService.deleteCart();
      this.snackbar.success('Payment successful');
      void this.router.navigateByUrl(`/orders/${order.id}`);
    } catch (error) {
      console.log(error);
      this.cartService.forgetCart();
      this.snackbar.success('Payment successful.  We are finalizing your order.  This could take a while');
      void this.router.navigateByUrl('/');
    }
  }

  private async getAddressFromStripeAddress(): Promise<Address | ShippingAddress | null> {
    const addressElement = this.stripeService.addressElementResource.value();
    const result = await addressElement?.getValue();
    const address = result?.value.address;
    if (address) {
      return {
        name: result.value.name,
        line1: address.line1,
        line2: address.line2 || undefined,
        city: address.city,
        state: address.state,
        country: address.country,
        postalCode: address.postal_code
      }
    } else return null;
  }

  private async createOrderModel(): Promise<OrderToCreate> {
    const cart = this.cartService.cartResource.value();
    const shippingAddress = await this.getAddressFromStripeAddress() as ShippingAddress;
    const card = this.stripeService.confirmationToken()?.payment_method_preview.card;

    if (!cart?.id || !cart.deliveryMethodId || !card || !shippingAddress)
      throw new Error('Problem creating order');

    return {
      cartId: cart.id,
      paymentSummary: {
        last4: +card.last4,
        brand: card.brand,
        expMonth: card.exp_month,
        expYear: card.exp_year
      },
      shippingAddress
    }
  }
}
