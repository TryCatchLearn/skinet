import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { Cart } from '../models/cart.model';
import { inject } from '@angular/core';
import { StripeService } from '../services/stripe.service';
import { SnackbarService } from '../services/snackbar.service';

export const paymentIntentResolver: ResolveFn<Cart | RedirectCommand> = async () => {
  const stripeService = inject(StripeService);
  const snackbar = inject(SnackbarService);
  const router = inject(Router);

  try {
    return await stripeService.createOrUpdatePaymentIntent();
  } catch (error: unknown) {
    if (error instanceof Error) snackbar.error(error.message);
    return new RedirectCommand(router.parseUrl('/cart'));
  }
};
