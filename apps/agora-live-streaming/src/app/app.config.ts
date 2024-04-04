import { ApplicationConfig } from '@angular/core';
import { APP_ROUTING } from './app.routes';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(APP_ROUTING, withEnabledBlockingInitialNavigation())],
};
