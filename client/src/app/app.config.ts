import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from '../core/interceptors/error-interceptor';
import { loadingInterceptor } from '../core/interceptors/loading-interceptor';
import { authInterceptor } from '../core/interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(withInterceptors([errorInterceptor, loadingInterceptor, authInterceptor]))
  ]
};
