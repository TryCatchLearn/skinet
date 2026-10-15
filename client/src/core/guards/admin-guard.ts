import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { firstValueFrom, filter } from 'rxjs';
import { AccountService } from '../services/account.service';
import { SnackbarService } from '../services/snackbar.service';

export const adminGuard: CanActivateFn = async (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  const snackbar = inject(SnackbarService);

  const isLoading$ = toObservable(accountService.userResource.isLoading);
  await firstValueFrom(isLoading$.pipe(filter(isLoading => !isLoading)))

  if (accountService.isAdmin()) {
    return true;
  } else {
    snackbar.error('Nope, not allowed in here');
    return new RedirectCommand(router.parseUrl('/shop'))
  }
};
