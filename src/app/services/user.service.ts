import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {from, Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map, switchMap, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userInfo;

  constructor(private http: HttpClient) {

  }

  getLoginStatus() {
    return localStorage.getItem('ds-auth');
  }

  saveUserStatus(data) {
    localStorage.setItem('ds-auth', data);
  }

  getUserInfo(): Observable<any> {
    return this.http.get('/user').pipe(tap((res: any) => {
      this.userInfo = res.data;
    }));
  }


  login(params: any): Observable<any> {
    return this.http.post('/login', params);
  }

  logout() {
    localStorage.removeItem('ds-auth');
  }

}
