import {Component, OnInit} from '@angular/core';
import {PostsService} from '../_services/posts.service';
import {Post} from '../_models/post';
import {User} from '../_models/user';
import {AuthService} from '../_services/auth.service';
import {USERS} from '../_backend_data/backend-data';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  posts: Post[];
  user: User;

  constructor(
    public postsService: PostsService,
    public authService: AuthService) {
  }

  ngOnInit(): void {
    // this.authService.currentUser.subscribe(u => this.user = u);
    this.user = USERS[0];
    // this.postsService.getUserPosts(this.user.id).subscribe(p => this.posts = p);
  }

}
