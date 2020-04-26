import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private base_path = 'https://bank-demo-server.herokuapp.com/users';
  constructor(
    private http: HttpClient
  ) { }
  httpOptions = (token = '') => {
    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'x-access-token': token
    });
  }

  login<T>(user) {
    return this.http.post<T>(`${this.base_path}/login`, JSON.stringify(user), { headers: this.httpOptions(), withCredentials: false });
  }

}
