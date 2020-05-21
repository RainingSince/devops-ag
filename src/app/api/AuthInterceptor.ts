import {Injectable} from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse
} from '@angular/common/http';

import {Observable} from 'rxjs';
import {UserService} from '../services/user.service';
import {tap} from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private userSerivce: UserService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    const token = this.userSerivce.getLoginStatus();
    const authReq = req.clone({
      headers: req.headers.set('Authorization', token ? token : ''),
      url: 'http://localhost:8088' + req.url
    });
    return next.handle(authReq).pipe(
      tap(
        response => {
          if (response instanceof HttpResponse) {
            if (response.status == 200) {
              return response.body;
            }
          }
        },
        error => {
          if (error instanceof HttpErrorResponse) {

          }
        }
      ));
  }
}
