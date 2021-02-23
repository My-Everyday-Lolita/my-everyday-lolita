import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { APP_ROUTES } from './app.token';
import { HomeComponent } from './pages/home/home.component';
import { MyClosetComponent } from './pages/my-closet/my-closet.component';
import { MyCoordChecklistComponent } from './pages/my-coord-checklist/my-coord-checklist.component';
import { MyWishlistComponent } from './pages/my-wishlist/my-wishlist.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { SearchComponent } from './pages/search/search.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    data: {
      animation: 'home',
      isHome: true,
    }
  },
  {
    path: 'my-closet', component: MyClosetComponent,
    data: {
      home: true,
      linkLabel: 'HOME.LINKS.MY_CLOSET',
      animation: 'my_closet',
      pageTitle: 'PAGES.TITLES.MY_CLOSET',
    }
  },
  {
    path: 'my-wishlist', component: MyWishlistComponent,
    data: {
      home: true,
      linkLabel: 'HOME.LINKS.MY_WISHLIST',
      animation: 'my_wishlist',
      pageTitle: 'PAGES.TITLES.MY_WISHLIST',
    }
  },
  {
    path: 'my-coord-checklist', component: MyCoordChecklistComponent,
    data: {
      home: true,
      linkLabel: 'HOME.LINKS.MY_COORD_CHECKLIST',
      animation: 'my_coord_checklist',
      pageTitle: 'PAGES.TITLES.MY_COORD_CHECKLIST',
    }
  },
  {
    path: 'search', component: SearchComponent,
    data: {
      home: true,
      linkLabel: 'HOME.LINKS.SEARCH',
      animation: 'search',
      pageTitle: 'PAGES.TITLES.SEARCH',
    }
  },
  {
    path: 'registration', component: RegistrationComponent,
    data: {
      home: false,
      linkLabel: 'HOME.LINKS.REGISTRATION',
      animation: 'registration',
      pageTitle: 'PAGES.TITLES.REGISTRATION',
    }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    { provide: APP_ROUTES, useValue: routes }
  ]
})
export class AppRoutingModule { }
