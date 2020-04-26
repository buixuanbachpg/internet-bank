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

  getHistoryDebit<T>(id) {
    return this.http.get<T>(`${this.base_path}/history/paydebit/${id}`,
      { headers: this.httpOptions(localStorage.getItem('access-token')), withCredentials: false }
    );
  }

  getHistoryTransfer<T>(id) {
    return this.http.get<T>(`${this.base_path}/history/transfer/${id}`,
      { headers: this.httpOptions(localStorage.getItem('access-token')), withCredentials: false }
    );
  }

  getHistoryReceive<T>(id) {
    return this.http.get<T>(`${this.base_path}/history/receive/${id}`,
      { headers: this.httpOptions(localStorage.getItem('access-token')), withCredentials: false }
    );
  }

}
