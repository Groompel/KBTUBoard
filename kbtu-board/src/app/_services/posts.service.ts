import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Post} from '../_models/post';
import {POSTS} from '../_backend_data/mock-posts';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  posts = POSTS;
  postsSubject = new BehaviorSubject<Post[]>(POSTS);
  userPostsSubject = new BehaviorSubject<Post[]>(POSTS);

  constructor() {
  }

  public getPostsByCategoryId(categoryId: number, subcategoryId): Observable<any> {

    // const posts = this.getCategory(categoryId);
    // if (!posts) {
    //   return of(false);
    // }

    // return of(posts.filter(post => post.subcategoryId === subcategoryId));
    return of(false);
  }

  getCategory(categoryId) {
    // if (categoryId === 1) {
    //   return POSTS.help;
    // } else if (categoryId === 2) {
    //   return POSTS.lostAndFound;
    // } else if (categoryId === 3) {
    //   return POSTS.study;
    // } else {
    //   return false;
    // }
    return of(false);
  }


  public getPostById(id: number): Observable<Post> {
    return of(this.postsSubject.value.find(p => p.id === id));
  }


  public getAllPosts(): Observable<Post[]> {
    return of(this.posts);
  }

  public getUserPosts(userId: number): Observable<Post[]> {
    this.userPostsSubject.next(this.postsSubject.value.filter(p => p.user_id === userId));
    return this.userPostsSubject;
  }

  public removePost(post: Post) {
    this.userPostsSubject.next(this.userPostsSubject.value.filter(p => p.id !== post.id));
    this.postsSubject.next(this.postsSubject.value.filter(p => p.id !== post.id));
  }

  public createPost(post: Post) {
    let arr = this.postsSubject.value;
    arr.push(post);
    this.postsSubject.next(arr);
    arr = this.userPostsSubject.value;
    arr.push(post);
    this.userPostsSubject.next(arr);
    console.warn(this.userPostsSubject.value);
  }

  public savePost(post: Post) {
    let arr = this.userPostsSubject.value.filter(p => p.id !== post.id);
    arr.push(post);
    this.userPostsSubject.next(arr);
    arr = this.postsSubject.value.filter(p => p.id !== post.id);
    arr.push(post);
    this.postsSubject.next(arr);
  }

  public generatePostId() {
    let id: number;
    do {
      id = Math.floor(Math.random() * 1000);
    }
    while (this.postsSubject.value.find(p => p.id === id));
    return id;
  }
}
