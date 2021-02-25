import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ToastNoAnimationModule, ToastrModule } from 'ngx-toastr';

import { NgAnimeDriverModule } from '@lheido/ng-anime-driver';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonComponent } from './features/buttons/button/button.component';
import { HomeComponent } from './pages/home/home.component';
import { environment } from '../environments/environment';
import { TadaComponent } from './features/effects/tada/tada.component';
import { TadaOverlayDirective } from './features/effects/tada/tada-overlay.directive';
import { MyClosetComponent } from './pages/my-closet/my-closet.component';
import { MyWishlistComponent } from './pages/my-wishlist/my-wishlist.component';
import { MyCoordChecklistComponent } from './pages/my-coord-checklist/my-coord-checklist.component';
import { SearchComponent } from './pages/search/search.component';
import { MenuComponent } from './features/buttons/menu/menu.component';
import { DialogComponent } from './features/dialog/dialog/dialog.component';
import { DialogAttachComponent } from './features/dialog/dialog-attach/dialog-container.component';
import { ThemeComponent } from './features/buttons/theme/theme.component';
import { BackComponent } from './features/buttons/back/back.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { ToastComponent } from './features/toast/toast/toast.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { AboutProjectComponent } from './pages/about-project/about-project.component';
import { TipsComponent } from './pages/tips/tips.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';

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
    MenuComponent,
    DialogComponent,
    DialogAttachComponent,
    ThemeComponent,
    BackComponent,
    RegistrationComponent,
    ToastComponent,
    AboutUsComponent,
    AboutProjectComponent,
    TipsComponent,
    SignInComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
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
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ToastNoAnimationModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-center',
      enableHtml: true,
      toastComponent: ToastComponent
    }),
  ],
  entryComponents: [
    ToastComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
