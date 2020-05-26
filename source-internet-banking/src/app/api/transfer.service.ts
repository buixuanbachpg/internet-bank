import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  private base_path = 'http://localhost:3000/users';
  private otp_path = 'http://localhost:3000/otp';
  constructor(
    private http: HttpClient
  ) { }
  httpOptions = (otp?) => {
    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'x-access-token': localStorage.getItem('TOKEN')? localStorage.getItem('TOKEN'):'',
      'x-access-otp': otp ? otp : ''
    });
  }

  transferInternal<T>(data, otp) {
    return this.http.post<T>(`${this.base_path}/transfer`, data, { headers: this.httpOptions(otp), withCredentials: false });
  }

  transferInterbank<T>(data,bank,otp) {
    return this.http.post<T>(`${this.base_path}/transfer/${bank}`, data, { headers: this.httpOptions(otp), withCredentials: false });
  }

  sendOTP<T>(email) {
    return this.http.post<T>(`${this.otp_path}/${email}`, null, {});
  }
}
