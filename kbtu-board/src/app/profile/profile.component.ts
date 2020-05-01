import {Component, OnInit} from '@angular/core';
import {PostsService} from '../_services/posts.service';
import {Post} from '../_models/post';
import {User} from '../_models/user';
import {AuthService} from '../_services/auth.service';
import {USERS} from '../_backend_data/backend-data';
import { ApiService } from '../_services/api.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  posts;
  user;

  constructor(
    public postsService: PostsService,
    public authService: AuthService,
    private apiService: ApiService) {
  }

  ngOnInit(): void {
    // this.authService.currentUser.subscribe(u => this.user = u);
    this.apiService.getUserInfo(this.authService.currentUserValue.username).subscribe(user => {
      this.user = user;
      this.user.username = this.authService.currentUserValue.username;
    });
    // this.postsService.getUserPosts(this.user.id).subscribe(p => this.posts = p);
  }

}
