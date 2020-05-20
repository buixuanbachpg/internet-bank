import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  private base_path = 'http://localhost:3000/users';
  constructor(
    private http: HttpClient
  ) { }
  httpOptions = (token = '') => {
    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'x-access-token': localStorage.getItem('TOKEN')
    });
  }

  transfer<T>(data) {
    return this.http.post<T>(`${this.base_path}/transfer`, JSON.stringify(data), { headers: this.httpOptions(), withCredentials: false });
  }

}
