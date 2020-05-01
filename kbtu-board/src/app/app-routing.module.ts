import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Route, RouterModule} from '@angular/router';
import {MainPageComponent} from './main-page/main-page.component';
import {PostDetailsComponent} from './post-details/post-details.component';
import {ErrorPageComponent} from './error-page/error-page.component';
import {AuthComponent} from './auth/auth.component';
import {AboutPageComponent} from './about-page/about-page.component';
import {SearchPageComponent} from './search-page/search-page.component';
import {NewPostComponent} from './new-post/new-post.component';
import {ProfileComponent} from './profile/profile.component';
import {ProfileEditComponent} from './profile-edit/profile-edit.component';
import {PostEditComponent} from './post-edit/post-edit.component';
import { AuthGuard } from './_guards/auth.guard';

export const ROUTES: Route[] = [
  {path: '', component: MainPageComponent},
  {path: 'auth', component: AuthComponent},
  {path: 'auth/:logout', component: AuthComponent},
  {path: 'about', component: AboutPageComponent},
  {path: 'search', pathMatch: 'full', redirectTo: 'search/1/1'},
  {path: 'search/:categoryId', pathMatch: 'full', redirectTo: 'search/1/1'},
  {path: 'search/:categoryId/:subcategoryId', component: SearchPageComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'profile/edit', component: ProfileEditComponent, canActivate: [AuthGuard]},
  {path: 'posts/:postId', component: PostDetailsComponent, canActivate: [AuthGuard]},
  {path: 'posts/:postId/edit', component: PostEditComponent, canActivate: [AuthGuard]},
  {path: 'new', component: NewPostComponent, canActivate: [AuthGuard]},
  {path: '**', component: ErrorPageComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
