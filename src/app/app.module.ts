import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { rootRouterConfig } from './app.routes';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; 

/* Firebase */
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { environment } from '@env/environment';

import { AppComponent } from './app.component';
import { UserComponent } from '@app/site-layout/user/user.component';
import { LoginComponent } from '@app/auth-layout/login/login.component';
import { RegisterComponent } from '@app/auth-layout/register/register.component';

import { UserResolver } from '@app/site-layout/user/user.resolver';

import { UserService } from '@app/core/user/user.service';
import { AuthGuard } from '@app/core/auth/auth.guard';
import { AuthService } from '@app/core/auth/auth.service';
import { AuthLayoutComponent } from '@app/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from '@app/site-layout/site-layout.component';
import { HomeComponent } from './site-layout/home/home.component';
import { StatsComponent } from './site-layout/stats/stats.component';
import { UploadsComponent } from './site-layout/uploads/uploads.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    SiteLayoutComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UploadsComponent,
    StatsComponent,
    UserComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: false }),

    // Firebase modules
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
  ],
  providers: [AuthService, UserService, UserResolver, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
