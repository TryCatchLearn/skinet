import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { firstValueFrom, filter } from 'rxjs';
import { CartService } from '../services/cart.service';
import { SnackbarService } from '../services/snackbar.service';

export const emptyCartGuard: CanActivateFn = async () => {
  const cartService = inject(CartService);
  const router = inject(Router);
  const snack = inject(SnackbarService);

  const isLoading$ = toObservable(cartService.cartResource.isLoading);
  await firstValueFrom(isLoading$.pipe(filter(isLoading => !isLoading)));

  const cart = cartService.cartResource.value();
  if (!cart || cart.items.length === 0) {
    snack.error('Your cart is empty');
    return new RedirectCommand(router.parseUrl('/cart'));
  }

  return true;
};
