import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PostsService} from '../_services/posts.service';
import {Post} from '../_models/post';
import {AuthService} from '../_services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {

  constructor(
    private postsService: PostsService,
    private authService: AuthService,
    private router: Router) {
  }

  category = '';

  post = new FormGroup(
    {
      title: new FormControl('',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(40)
        ]),

      description: new FormControl('',
        [
          Validators.minLength(10),
          Validators.maxLength(200)
        ]),
      date: new FormControl(),
      time: new FormControl(),
      place: new FormControl(),
      subcategory_id: new FormControl('',
        Validators.required)
    }
  );

  get title() {
    return this.post.get('title');
  }

  get description() {
    return this.post.get('description');
  }

  get date() {
    return this.post.get('reward');
  }

  get time() {
    return this.post.get('time');
  }

  get place() {
    return this.post.get('place');
  }

  get subcategory_id() {
    return this.post.get('subcategory_id');
  }

  disableButton(): boolean {
    return !this.post.valid;
  }

  submitForm() {
    const post: Post = {
      id: this.postsService.generatePostId(),
      title: this.title.value,
      subcategory_id: this.subcategory_id.value,
      user_id: this.authService.currentUserValue.id
    };
    if (this.place.value.length > 0) {
      post.place = this.place.value;
    }
    if (this.time.value.length > 0) {
      post.time = this.time.value;
    }
    if (this.description.value.length > 0) {
      post.description = this.description.value;
    }
    this.postsService.createPost(post);
    this.router.navigate(['/profile']);
  }

  ngOnInit()
    :
    void {
    this.openCategory('lost');
  }

  openCategory(category) {
    let i;
    let tabcontent;
    let tablinks;

    tabcontent = document.getElementsByClassName('content');
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
    }

    tablinks = document.getElementsByClassName('tablinks');
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(' active', '');
    }

    document.getElementById(category).style.display = 'block';
    document.getElementById(category).className += ' active';

    this.category = category;
    this.post.get(this.category).enable();
    const form = document.getElementsByTagName('FORM').item(0);
    if (category === 'study') {
      // @ts-ignore
      form.style.display = 'none';
    } else {
      // @ts-ignore
      form.style.display = 'block';
    }
  }
}
