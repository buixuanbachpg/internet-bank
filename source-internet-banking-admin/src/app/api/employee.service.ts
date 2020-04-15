import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private base_path = 'http://localhost:3000/employee';
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

  logout<T>(email) {
    return this.http.post<T>(`${this.base_path}/logout`, JSON.stringify(email),
      { headers: this.httpOptions(localStorage.getItem('access-token')), withCredentials: false });
  }

  renew<T>() {
    return this.http.post<T>(`${this.base_path}/renew-token`, JSON.stringify({ refreshToken: localStorage.getItem('refresh-token') }),
      { headers: this.httpOptions(), withCredentials: false });
  }

  insertCustomer(user) {
    return this.http.post(this.base_path + '/', JSON.stringify(user),
      { headers: this.httpOptions(localStorage.getItem('access-token')), withCredentials: false });
  }

}
