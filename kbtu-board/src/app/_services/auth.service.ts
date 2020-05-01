import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from '../_models/user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    ) {

    this.currentUserSubject =  new BehaviorSubject<User>(JSON.parse(localStorage.getItem("currentUser")));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {

    return this.currentUserSubject.value;
  }

  login(username, password) {
    console.log('Logging in...')
    return this.httpClient.post<any>(`${environment.apiUrl}/login/`, {username, password}).pipe(map(user => {
      console.log('Recieved')
      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        this.currentUserSubject.next(user);
      }
      return user;
    }));
  }

  register(user) {
    return this.httpClient.post<any>(`${environment.apiUrl}/register/`, {user}).pipe(map(data => {
      console.log(data)
      if (data === 'Success') {
        this.login(user.username, user.password);
      }
      return user;
    }));
  }

  logout() {
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
  }
}
