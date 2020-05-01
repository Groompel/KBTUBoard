import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {BEST_TEACHERS, LAST_ADS, USERS} from '../_backend_data/backend-data';
import {environment} from 'src/environments/environment';
import {map} from 'rxjs/operators';
import { User } from '../_models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiUrl = 'localhost:8000/api';

  constructor(private httpClient: HttpClient, private authService: AuthService) {
  }

  checkTelegramCode(code): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/check-code/`, {code: code}).pipe(map(response => {
      return response;
    }));
  }

  getTelegramCode(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/code/`).pipe(map(code => {
      return code;
    }));
  }


  setUser(user: User) {
    const username = this.authService.currentUserValue.username;
    return this.httpClient.put(`${environment.apiUrl}/users/${username}`, {user: user}).pipe(map(user => {
      return user;
    }));
  }


  getUserInfo(username): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/users/${username}`).pipe(map(user => {
      return user;
    }));
  }

  getLastAds(number): Observable<any> {
    const res = LAST_ADS;
    return of(res);
  }

  getBestTeachers(number): Observable<any> {
    const res = BEST_TEACHERS;
    return of(res);
  }

  isAvailableUsername(username) {
    const usernames = USERS.map(u => u.username);
    return !usernames.includes(username);
  }
}
