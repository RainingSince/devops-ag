import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReposService {

  constructor(private http: HttpClient) {
  }

  saveReposConfig(params): Observable<any> {
    return this.http.post('/repos/config', params);
  }

  getReposConfig(): Observable<any> {
    return this.http.get('/repos/config');
  }

  updateReposConfig(params): Observable<any> {
    return this.http.put('/repos/config', params);
  }

  getReposProjects(params): Observable<any> {
    return this.http.get('/repos/porjects', {params: params});
  }

}
