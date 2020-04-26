import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';
import { retry, catchError, retryWhen, delay, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private base_path = 'https://bank-demo-server.herokuapp.com/admin';
  constructor(
    private http: HttpClient
  ) { }
  httpOptions = (token = '') => {
    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'x-access-token': token
    });
  }

  getall<T>() {
    return this.http.get<T>(`${this.base_path}/`,
      { headers: this.httpOptions(localStorage.getItem('access-token')), withCredentials: false });
  }

  insert<T>(user) {
    return this.http.post<T>(`${this.base_path}/`, JSON.stringify(user),
      { headers: this.httpOptions(localStorage.getItem('access-token')), withCredentials: false });
  }

  update<T>(user) {
    return this.http.put<T>(`${this.base_path}/`, JSON.stringify(user),
      { headers: this.httpOptions(localStorage.getItem('access-token')), withCredentials: false });
  }

  delete<T>(id) {
    return this.http.delete<T>(`${this.base_path}/${id}`,
      { headers: this.httpOptions(localStorage.getItem('access-token')), withCredentials: false });
  }

  reset<T>(email, pass) {
    return this.http.put<T>(`${this.base_path}/${email}`, JSON.stringify({ password: pass }),
      {
        headers: this.httpOptions(localStorage.getItem('access-token')),
        withCredentials: false
      });
  }

  getone<T>(id) {
    return this.http.get<T>(`${this.base_path}/${id}`,
      { headers: this.httpOptions(localStorage.getItem('access-token')), withCredentials: false });
  }

  gethistory<T>(data) {
    return this.http.get<T>(`${this.base_path}/history`,
      {
        headers: this.httpOptions(localStorage.getItem('access-token')),
        withCredentials: false,
        params: {
          fromDate: data.fromDate,
          toDate: data.toDate,
          bank: data.bank
        }
      });
  }
}
