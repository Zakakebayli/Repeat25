import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage-angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    // Use Ionic's route strategy for better mobile navigation
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    
    // Provide Ionic Angular with default configuration
    provideIonicAngular(),
    
    // Setup routing with preloading strategy for better performance
    provideRouter(routes, withPreloading(PreloadAllModules)),
    
    // Provide HTTP client for API requests (required for project specifications)
    provideHttpClient(),
    
    // Import Ionic Storage Module for data persistence
    importProvidersFrom(IonicStorageModule.forRoot())
  ],
}).catch(err => console.error('Error starting app:', err));