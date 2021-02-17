import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgAnimeDriverModule } from '@lheido/ng-anime-driver';
import { ButtonComponent } from './features/buttons/button/button.component';
import { HomeComponent } from './pages/home/home.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { TadaComponent } from './features/effects/tada/tada.component';
import { TadaOverlayDirective } from './features/effects/tada/tada-overlay.directive';
import { MyClosetComponent } from './pages/my-closet/my-closet.component';
import { MyWishlistComponent } from './pages/my-wishlist/my-wishlist.component';
import { MyCoordChecklistComponent } from './pages/my-coord-checklist/my-coord-checklist.component';
import { SearchComponent } from './pages/search/search.component';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    HomeComponent,
    TadaComponent,
    TadaOverlayDirective,
    MyClosetComponent,
    MyWishlistComponent,
    MyCoordChecklistComponent,
    SearchComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgAnimeDriverModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
