import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import localeEn from '@angular/common/locales/en';
import localeFr from '@angular/common/locales/fr';
import { ReactiveFormsModule } from '@angular/forms';

import { ObserversModule } from '@angular/cdk/observers';
import { LayoutModule } from '@angular/cdk/layout';

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
import { ImageLoadDirective } from './features/images/image-load.directive';
import { LocalizedDatePipe } from './features/date/localized-date.pipe';
import { CoordinationComponent } from './pages/coordination/coordination.component';
import { DialognInnerContentDirective } from './features/dialog/dialogn-inner-content.directive';
import { IsFormArrayPipe } from './features/form/is-form-array.pipe';
import { IsCheckedPipe } from './features/form/is-checked.pipe';
import { CacheItemPipe } from './features/resources/user-content/cache-item.pipe';
import { CacheItemNamePipe } from './features/resources/user-content/cache-item-name.pipe';
import { FormArrayLengthPipe } from './features/form/form-array-length.pipe';
import { FormArrayControlsPipe } from './features/form/form-array-controls.pipe';
import { CoordinationFieldIsEmptyPipe } from './features/form/coordination-field-is-empty.pipe';
import { IsArrayPipe } from './features/form/is-array.pipe';
import { CacheItemPhotoPipe } from './features/resources/user-content/cache-item-photo.pipe';
import { CoordMainPiecePipe } from './features/resources/user-content/coord-main-piece.pipe';
import { DetailsComponent } from './features/dialog/details/details.component';
import { SimpleLoaderComponent } from './features/loaders/simple-loader/simple-loader.component';
import { from, Observable } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationComponent } from './features/pagination/pagination/pagination.component';
import { PaginationQueryParamsPipe } from './features/pagination/pagination-query-params.pipe';
import { PaginationInfoComponent } from './features/pagination/pagination-info/pagination-info.component';
import { PaginateInfoPipe } from './features/pagination/paginate-info.pipe';
import { DefaultDialogContentComponent } from './features/dialog/default-dialog-content/default-dialog-content.component';
import { ScIsParagraphPipe } from './features/static-content/sc-is-paragraph.pipe';
// import { NgScrollbarModule } from 'ngx-scrollbar';

registerLocaleData(localeEn, 'en');
registerLocaleData(localeFr, 'fr');

export class WebpackTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return from(import(`../assets/i18n/${lang}.json`));
  }
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
    ImageLoadDirective,
    LocalizedDatePipe,
    CoordinationComponent,
    DialognInnerContentDirective,
    IsFormArrayPipe,
    IsCheckedPipe,
    CacheItemPipe,
    CacheItemNamePipe,
    FormArrayLengthPipe,
    FormArrayControlsPipe,
    CoordinationFieldIsEmptyPipe,
    IsArrayPipe,
    CacheItemPhotoPipe,
    CoordMainPiecePipe,
    DetailsComponent,
    SimpleLoaderComponent,
    PaginationComponent,
    PaginationQueryParamsPipe,
    PaginationInfoComponent,
    PaginateInfoPipe,
    DefaultDialogContentComponent,
    ScIsParagraphPipe,
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
        useClass: WebpackTranslateLoader
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
      closeButton: true,
      toastComponent: ToastComponent
    }),
    NgSelectModule,
    ObserversModule,
    SafePipeModule,
    NgxPaginationModule,
    LayoutModule,
    // NgScrollbarModule,
  ],
  entryComponents: [
    ToastComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizationInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: InactiveInterceptor, multi: true },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
