import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { ObserversModule } from '@angular/cdk/observers';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ToastNoAnimationModule, ToastrModule } from 'ngx-toastr';

import { NgSelectModule } from '@ng-select/ng-select';

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
import { ItemComponent } from './pages/item/item.component';
import { FieldsetComponent } from './features/form/fieldset/fieldset.component';
import { FormFieldComponent } from './features/form/form-field/form-field.component';
import { LabelComponent } from './features/form/form-field/label.component';
import { InputDirective } from './features/form/form-field/input.directive';
import { PhotosPipe } from './features/resources/items/photos.pipe';
import { ItemPhotoPipe } from './features/resources/items/item-photo.pipe';
import { CloudContainerComponent } from './features/cloud-container/cloud-container/cloud-container.component';
import { AuthorizationInterceptor } from './features/http/interceptors/authorization.interceptor';
import { InactiveInterceptor } from './features/http/interceptors/inactive.interceptor';
import { InClosetDirective } from './features/resources/user-content/in-closet.directive';
import { InWishListDirective } from './features/resources/user-content/in-wishlist.directive';
import { SearchFormComponent } from './features/form/search-form/search-form.component';
import { SafePipeModule } from 'safe-pipe';
import { ImageZoomDirective } from './features/dialog/image-zoom.directive';
import { ImageDialogComponent } from './features/dialog/image-dialog/image-dialog.component';

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
    ItemComponent,
    FieldsetComponent,
    FormFieldComponent,
    LabelComponent,
    InputDirective,
    PhotosPipe,
    ItemPhotoPipe,
    CloudContainerComponent,
    InClosetDirective,
    InWishListDirective,
    SearchFormComponent,
    ImageZoomDirective,
    ImageDialogComponent,
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
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerImmediately',
    }),
    ToastNoAnimationModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-center',
      enableHtml: true,
      toastComponent: ToastComponent
    }),
    NgSelectModule,
    ObserversModule,
    SafePipeModule,
  ],
  entryComponents: [
    ToastComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizationInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: InactiveInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
