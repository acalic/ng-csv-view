import { Routes } from '@angular/router';

import { AuthLayoutComponent } from '@app/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from '@app/site-layout/site-layout.component';

import { LoginComponent } from '@app/auth-layout/login/login.component';
import { RegisterComponent } from '@app/auth-layout/register/register.component';

import { UserComponent } from '@app/site-layout/user/user.component';
import { UserResolver } from '@app/site-layout/user/user.resolver';
import { HomeComponent } from '@app/site-layout/home/home.component';
import { UploadsComponent } from '@app/site-layout/uploads/uploads.component';
import { StatsComponent } from '@app/site-layout/stats/stats.component';

import { AuthGuard } from '@app/core/auth/auth.guard';

export const rootRouterConfig: Routes = [

  // Auth routes goes here 
  { 
      path: '', 
      component: AuthLayoutComponent,
      children: [
        { path: '', redirectTo: 'login', pathMatch: 'full' },
        { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
        { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
      ]
  },

  // App routes goes here here
  { 
      path: '',
      component: SiteLayoutComponent,
      resolve: { data: UserResolver},
      children: [
        { path: 'home', component: HomeComponent},
        { path: 'uploads', component: UploadsComponent},
        { path: 'stats', component: StatsComponent},
        { path: 'user', component: UserComponent, resolve: { data: UserResolver}}
      ]
  },

  // No layout routes
  // TODO: ADD 404 page!
  /* { path: '', redirectTo: 'login', pathMatch: 'full' }, */
];