import { Component, OnInit, OnDestroy, ɵConsole } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { Subscription } from 'rxjs';
import 'rxjs/add/operator/filter';

import { AuthService } from '@app/core/auth/auth.service';
import { UploadService } from '@app/core/upload/upload.service';
import { FirebaseUserModel } from '@app/core/user/user.model';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    private _modalService: NgbModal,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {
    this.pageTitleSub = this._router.events
    .filter(event => event instanceof NavigationEnd)
    .subscribe(
        () => {
          this.pageTitle = this._route.snapshot.firstChild.data['title'];
        }
    );
  }

  ngOnInit(): void {
    this.userSub = this._route.data.subscribe(routeData => {
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

  logout() {
    this.authService.doLogout()
    .then((res) => {
      setTimeout(() => {
        this._router.navigate(['/login']);
      }, 1000);
    }, (error) => {
      console.log("Logout error", error);
    });
  }

  openConfirmSignoutModal(content: any) {
    this._modalService.open(content).result.then((result) => {
      if(result == 'confirm') {
        this.logout()
      }
    }, (reason) => {});
  }

}
