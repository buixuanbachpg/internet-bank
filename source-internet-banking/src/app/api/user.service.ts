import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private base_path = 'http://localhost:3000/users';
  constructor(
    private http: HttpClient
  ) { }
  httpOptions = (token = localStorage.getItem('TOKEN') ? localStorage.getItem('TOKEN'):'') => {
    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'x-access-token': token
    });
  }

  login<T>(user) {
    return this.http.post<T>(`${this.base_path}/login`, JSON.stringify(user), { headers: this.httpOptions(), withCredentials: false });
  }

  logout<T>(user) {
    return this.http.post<T>(`${this.base_path}/logout`, user, { headers: this.httpOptions(), withCredentials: false });
  }

  resetPassword<T>() {
    return this.http.post<T>(`${this.base_path}/resetPassword`, null, { headers: this.httpOptions(), withCredentials: false });
  }

  getRecipient<T>(account_number) {
    return this.http.get<T>(`${this.base_path}/recipient/${account_number}`, { headers: this.httpOptions(), withCredentials: false });
  }

  getUserByAccNumber<T>(account_number) {
    return this.http.get<T>(`${this.base_path}/getbyacc/${account_number}`, { headers: this.httpOptions(), withCredentials: false });
  }

  addRecipient<T>(user_Recipient, account_number) {
    const data = {
      account_number: account_number,
      account_number_receive: user_Recipient.account_number_receive,
      name_reminiscent: user_Recipient.name_reminiscent
    }
    return this.http.post<T>(`${this.base_path}/recipient`, data, { headers: this.httpOptions(), withCredentials: false });
  }

  deleteRecipient<T>(account_number,account_number_receive) {
    const data = {
      "account_number": account_number,
      "account_number_receive": account_number_receive
    }
    return this.http.post<T>(`${this.base_path}/recipient/delete`, data, { headers: this.httpOptions(), withCredentials: false });
  }

  updateRecipient<T>(user_Recipient, account_number) {
    const data = {
      account_number: account_number,
      account_number_receive: user_Recipient.account_number_receive,
      name_reminiscent: user_Recipient.name_reminiscent
    }
    return this.http.put<T>(`${this.base_path}/recipient`, data, { headers: this.httpOptions(), withCredentials: false });
  }

}
