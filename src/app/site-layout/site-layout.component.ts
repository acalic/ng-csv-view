import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { take } from 'rxjs/internal/operators/take';
import { Subscription, Observable } from 'rxjs';
import 'rxjs/add/operator/filter';

import { AuthService } from '@app/core/auth/auth.service';
import { UploadService } from '@app/core/upload/upload.service';
import { FirebaseUserModel } from '@app/core/user/user.model';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss']
})
export class SiteLayoutComponent implements OnInit, OnDestroy {

  user: FirebaseUserModel = new FirebaseUserModel();
  userSub: Subscription;

  sidebarCollapse: boolean = false;

  pageTitle: string;
  pageTitleSub: Subscription;

  uploadsNum: number;
  uploadsNumSub: Subscription;

  constructor(
    public authService: AuthService,
    public uploadService: UploadService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.pageTitleSub = this.router.events
    .filter(event => event instanceof NavigationEnd)
    .subscribe(
        () => {
          this.pageTitle = this.route.snapshot.firstChild.data['title'];
        }
    );
  }

  ngOnInit(): void {
    this.userSub = this.route.data.subscribe(routeData => {
      let data = routeData['data'];
      if (data) {
        this.user = data;
      }
    })
    this.uploadsNumSub = this.uploadService.getFileUploadsNumber().subscribe(res => {
      this.uploadsNum = res;
    })
  }

  ngOnDestroy() {
    this.pageTitleSub.unsubscribe();
    this.uploadsNumSub.unsubscribe();
    this.userSub.unsubscribe();
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
