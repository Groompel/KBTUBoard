import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, skip } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {

      let error = "";

      if (request.url === `${environment.apiUrl}/login/` && err.status === 400) {
        err.error = "Неверный логин или пароль. Проверьте и попробуйте еще раз."
      }
      else if (err.status !== 401 && err.status !== 403) {
        err.error = "Произошла непредвиденная ошибка. Попробуйте снова позже.";
      }


      return throwError(err);
    }))
}
}
