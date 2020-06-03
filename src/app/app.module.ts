/* Angular stuff */
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { rootRouterConfig } from './app.routes';

import { ChartsModule } from 'ng2-charts';

/* NG Bootstrap */
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; 
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

/* Firebase */
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { environment } from '@env/environment';
import { UserResolver } from '@app/site-layout/user/user.resolver';

/* Services */
import { UserService } from '@app/core/user/user.service';
import { AuthGuard } from '@app/core/auth/auth.guard';
import { AuthService } from '@app/core/auth/auth.service';

/* Components */
import { AppComponent } from './app.component';

import { LoginComponent } from '@app/auth-layout/login/login.component';
import { RegisterComponent } from '@app/auth-layout/register/register.component';

import { AuthLayoutComponent } from '@app/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from '@app/site-layout/site-layout.component';

import { UserComponent } from '@app/site-layout/user/user.component';
import { HomeComponent } from '@app/site-layout/home/home.component';
import { StatsComponent } from '@app/site-layout/stats/stats.component';
import { StatsItemComponent } from '@app/site-layout/stats/stats-item/stats-item.component';
import { UploadsComponent } from '@app/site-layout/uploads/uploads.component';
import { TableComponent, TableSortableHeaderComponent } from '@app/shared/table/table.component';

import { HttpErrorInterceptor } from '@app/core/http-error.interceptor';

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
    TableComponent,
    TableSortableHeaderComponent,
    StatsItemComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    ChartsModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: false }),

    // Firebase modules
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
  ],
  providers: [
    AuthService,
    UserService,
    UserResolver,
    AuthGuard,
    NgbActiveModal,
    DecimalPipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
