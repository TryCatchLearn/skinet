import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  const isLoading$ = toObservable(accountService.userResource.isLoading);
  await firstValueFrom(isLoading$.pipe(filter(isLoading => !isLoading)))
  
  if (!accountService.currentUser()) {
    return new RedirectCommand(router.parseUrl('/account/login'), {
      state: {
        attemptedUrl: state.url
      }
    })
  }

  return true;
};
