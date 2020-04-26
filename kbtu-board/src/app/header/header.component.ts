import {Component, OnInit} from '@angular/core';
import {AuthService} from '../_services/auth.service';
import {Router, RoutesRecognized} from '@angular/router';

declare const $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  profileWindowVisible = true;
  isLoggedIn = false;
  user;
  showBg = true;


  toggleProfileWindow() {
    $(".profile-window").toggleClass("profile-window-show");
  }

  constructor(
    private authService: AuthService,
    private router: Router,

  ) {
  }

  logout() {
    this.authService.logout();
    location.reload(true);
  }

  ngOnInit(): void {
    // To remove bg when on the main page
    this.router.events.subscribe(event => {
      if(this.authService.currentUserValue) {
        this.isLoggedIn = true;
        this.authService.currentUser.subscribe(data => {
          this.user = data;
          this.user = this.user.user;
        });
      }
      if(event instanceof RoutesRecognized) {

        if (event.url === "/") {
          this.showBg = false;
        } else {
          this.showBg = true;
        }
      }
    });
  }

}
