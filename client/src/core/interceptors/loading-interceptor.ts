import { HttpInterceptorFn } from '@angular/common/http';
import { inject, isDevMode } from '@angular/core';
import { delay, dematerialize, finalize, materialize } from 'rxjs';
import { BusyService } from '../services/busy.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  busyService.busy();

  return next(req).pipe(
    materialize(),
    delay(isDevMode() ? 500 : 0),
    dematerialize(),
    finalize(() => busyService.idle())
  );
};
