import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { APP_ROUTES } from './app.token';
import { ResourcesBrandsResolver } from './features/resources/brands/brands.resolver';
import { ResourcesCategoriesResolver } from './features/resources/categories/categories.resolver';
import { ResourcesColorsResolver } from './features/resources/colors/colors.resolver';
import { ResourcesFeaturesResolver } from './features/resources/features/features.resolver';
import { ResourcesItemResolver } from './features/resources/items/item.resolver';
import { CoordinationGuard } from './features/resources/user-content/coordination.guard';
import { CoordinationResolver } from './features/resources/user-content/coordination.resolver';
import { UserContentReadyGuard } from './features/resources/user-content/user-content-ready.guard';
import { SignedInGuard } from './features/user/signed-in.guard';
import { AboutProjectComponent } from './pages/about-project/about-project.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { CoordinationComponent } from './pages/coordination/coordination.component';
import { HomeComponent } from './pages/home/home.component';
import { ItemComponent } from './pages/item/item.component';
import { MyClosetComponent } from './pages/my-closet/my-closet.component';
import { MyCoordChecklistComponent } from './pages/my-coord-checklist/my-coord-checklist.component';
import { MyWishlistComponent } from './pages/my-wishlist/my-wishlist.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { SearchComponent } from './pages/search/search.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { TipsComponent } from './pages/tips/tips.component';

const routes: Routes = [
  {
    path: '', canActivateChild: [UserContentReadyGuard], children: [
      {
        path: '', component: HomeComponent,
        data: {
          animation: 'home',
          isHome: true,
        }
      },
      {
        path: 'my-closet', component: MyClosetComponent,
        resolve: {
          brands: ResourcesBrandsResolver,
          colors: ResourcesColorsResolver,
          categories: ResourcesCategoriesResolver,
          features: ResourcesFeaturesResolver,
        },
        data: {
          home: true,
          linkLabel: 'HOME.LINKS.MY_CLOSET',
          animation: 'my_closet',
          pageTitle: 'PAGES.TITLES.MY_CLOSET',
        }
      },
      {
        path: 'my-wishlist', component: MyWishlistComponent,
        resolve: {
          brands: ResourcesBrandsResolver,
          colors: ResourcesColorsResolver,
          categories: ResourcesCategoriesResolver,
          features: ResourcesFeaturesResolver,
        },
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
        path: 'my-coord-checklist/:id', component: CoordinationComponent,
        resolve: {
          coordination: CoordinationResolver
        },
        canActivate: [CoordinationGuard],
        data: {
          animation: 'coordination',
          backHome: true
        }
      },
      {
        path: 'search', component: SearchComponent,
        resolve: {
          brands: ResourcesBrandsResolver,
          colors: ResourcesColorsResolver,
          categories: ResourcesCategoriesResolver,
          features: ResourcesFeaturesResolver,
        },
        data: {
          home: true,
          linkLabel: 'HOME.LINKS.SEARCH',
          animation: 'search',
          pageTitle: 'PAGES.TITLES.SEARCH',
        }
      },
      {
        path: 'sign-in', component: SignInComponent,
        data: {
          home: false,
          linkLabel: 'MENU.LINKS.SIGN_IN',
          animation: 'sign_in',
          pageTitle: 'PAGES.TITLES.SIGN_IN',
        }
      },
      {
        path: 'registration', component: RegistrationComponent,
        data: {
          home: false,
          linkLabel: 'MENU.LINKS.REGISTRATION',
          animation: 'registration',
          pageTitle: 'PAGES.TITLES.REGISTRATION',
        }
      },
      {
        path: 'about-us', component: AboutUsComponent,
        data: {
          home: false,
          others: true,
          linkLabel: 'MENU.LINKS.ABOUT_US',
          animation: 'about_us',
          pageTitle: 'PAGES.TITLES.ABOUT_US',
        }
      },
      {
        path: 'about-the-project', component: AboutProjectComponent,
        data: {
          home: false,
          others: true,
          linkLabel: 'MENU.LINKS.ABOUT_PROJECT',
          animation: 'about_project',
          pageTitle: 'PAGES.TITLES.ABOUT_PROJECT',
        }
      },
      {
        path: 'tips', component: TipsComponent,
        data: {
          home: false,
          others: true,
          linkLabel: 'MENU.LINKS.TIPS',
          animation: 'tips',
          pageTitle: 'PAGES.TITLES.TIPS',
        }
      },
      {
        path: 'item/:id', component: ItemComponent,
        resolve: {
          brands: ResourcesBrandsResolver,
          colors: ResourcesColorsResolver,
          categories: ResourcesCategoriesResolver,
          features: ResourcesFeaturesResolver,
          item: ResourcesItemResolver,
        },
        data: {
          animation: 'item',
          backHome: true
        }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
  providers: [
    { provide: APP_ROUTES, useValue: routes[0].children }
  ]
})
export class AppRoutingModule { }
