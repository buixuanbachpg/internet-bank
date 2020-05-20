import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { ConsoleReporter } from 'jasmine';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private base_path = 'http://localhost:3000/users';
  constructor(
    private http: HttpClient
  ) { }
  httpOptions = (token = localStorage.getItem('TOKEN')) => {
    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'x-access-token': token
    });
  }

  login<T>(user) {
    return this.http.post<T>(`${this.base_path}/login`, JSON.stringify(user), { headers: this.httpOptions(), withCredentials: false });
  }

  resetPassword<T>() {
    return this.http.post<T>(`${this.base_path}/resetPassword`, null, { headers: this.httpOptions(), withCredentials: false });
  }

  getRecipient<T>(account_number) {
    return this.http.get<T>(`${this.base_path}/recipient/${account_number}`, { headers: this.httpOptions(), withCredentials: false });
  }

}
