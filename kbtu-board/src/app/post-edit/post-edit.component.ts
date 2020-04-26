import {Component, OnInit} from '@angular/core';
import {PostsService} from '../_services/posts.service';
import {Post} from '../_models/post';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {

  post: Post;

  constructor(
    private postsService: PostsService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    const id = +this.activatedRoute.snapshot.paramMap.get('postId');
    this.postsService.getPostById(id).subscribe(p => this.post = p);
  }

  savePost() {
    this.postsService.savePost(this.post);
    this.router.navigate(['profile']);
  }
}
