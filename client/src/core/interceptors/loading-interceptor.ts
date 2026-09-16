import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, dematerialize, finalize, materialize } from 'rxjs';
import { BusyService } from '../services/busy.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  busyService.busy();

  return next(req).pipe(
    materialize(),
    delay(1000),
    dematerialize(),
    finalize(() => busyService.idle())
  );
};
