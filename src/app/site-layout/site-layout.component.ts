import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import 'rxjs/add/operator/filter';

import { AuthService } from '@app/core/auth/auth.service';
import { FirebaseUserModel } from '@app/core/user/user.model';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss']
})
export class SiteLayoutComponent implements OnInit, OnDestroy {

  sidebarCollapse: boolean = false;
  user: FirebaseUserModel = new FirebaseUserModel();
  pageTitle: string;
  subscription: Subscription;

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.subscription = this.router.events
    .filter(event => event instanceof NavigationEnd)
    .subscribe(
        () => {
          this.pageTitle = this.route.snapshot.firstChild.data['title'];
        }
    );
  }

  ngOnInit(): void {
    this.route.data.subscribe(routeData => {
      let data = routeData['data'];
      if (data) {
        this.user = data;
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleSidebar = () => {
    this.sidebarCollapse = !this.sidebarCollapse;
  }

  logout(){
    this.authService.doLogout()
    .then((res) => {
      this.router.navigate(['/login']);
    }, (error) => {
      console.log("Logout error", error);
    });
  }

}
