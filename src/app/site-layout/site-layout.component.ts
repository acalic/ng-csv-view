import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '@app/core/auth/auth.service';
import { FirebaseUserModel } from '@app/core/user/user.model';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss']
})
export class SiteLayoutComponent implements OnInit {

  sidebarCollapse: boolean = false;
  user: FirebaseUserModel = new FirebaseUserModel();

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(routeData => {
      let data = routeData['data'];
      if (data) {
        this.user = data;
        console.log(this.user);
      }
    })
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
