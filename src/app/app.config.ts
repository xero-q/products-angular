import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),provideHttpClient(),  provideAnimations(),  provideToastr({
    timeOut: 3000, // Duration of toast visibility
    positionClass: 'toast-top-right', // Toast position
    preventDuplicates: true, // Prevent duplicate toasts
  }),]
};
