import { Route } from '@angular/router';
import { LiveStreamingComponent } from './live-streaming/live-streaming.component';

export const APP_ROUTING: Route[] = [
  {
    path: '',
    component: LiveStreamingComponent,
  },
];
