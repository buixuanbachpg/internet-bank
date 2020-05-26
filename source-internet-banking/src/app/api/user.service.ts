import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // private base_path = 'https://bank-demo-server.herokuapp.com/users';
  private base_path = 'http://localhost:3000/users';
  constructor(
    private http: HttpClient
  ) { }
  httpOptions = (otp?) => {
    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'x-access-token': localStorage.getItem('TOKEN')? localStorage.getItem('TOKEN'):'',
      'x-access-otp': otp ? otp:''
    });
  }

  login<T>(user) {
    return this.http.post<T>(`${this.base_path}/login`, user, {});
  }

  logout<T>(user) {
    return this.http.post<T>(`${this.base_path}/logout`, user, { headers: this.httpOptions(), withCredentials: false });
  }

  resetPassword<T>(data,otp) {
    return this.http.post<T>(`${this.base_path}/resetPassword`, data, { headers: this.httpOptions(otp), withCredentials: false });
  }

  getRecipient<T>(account_number) {
    return this.http.get<T>(`${this.base_path}/recipient/${account_number}`, { headers: this.httpOptions(), withCredentials: false });
  }

  getUserByAccNumber<T>(account_number) {
    return this.http.get<T>(`${this.base_path}/getbyacc/${account_number}`, { headers: this.httpOptions(), withCredentials: false });
  }

  getUserbyUsername<T>(username) {
    return this.http.get<T>(`${this.base_path}/getbyusername/${username}`, {});
  }

  addRecipient<T>(user_Recipient, account_number) {
    const data = {
      account_number: account_number,
      account_number_receive: user_Recipient.account_number_receive,
      name_reminiscent: user_Recipient.name_reminiscent
    }
    return this.http.post<T>(`${this.base_path}/recipient`, data, { headers: this.httpOptions(), withCredentials: false });
  }

  deleteRecipient<T>(account_number, account_number_receive) {
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

  changePassword<T>(data) {
    return this.http.put<T>(`${this.base_path}/changePassword`, data, { headers: this.httpOptions(), withCredentials: false });
  }

  renewToken<T>() {
    return this.http.post<T>(`${this.base_path}/renew-token`, JSON.stringify({ refreshToken: localStorage.getItem('RE_TOKEN') }),
      { headers: this.httpOptions(), withCredentials: false });
  }

  addindebit<T>(detail) {
    return this.http.post<T>(`${this.base_path}/indebit`, detail, { headers: this.httpOptions(), withCredentials: false });
  }

  getindebit<T>(account, opt) {
    return this.http.get<T>(`${this.base_path}/indebit?account_number=${account}&opt=${opt}`,
      { headers: this.httpOptions(), withCredentials: false });
  }

  deleteindebit<T>(account, accountdebit) {
    return this.http.delete<T>(`${this.base_path}/indebit?account_number=${account}&account_number_debit=${accountdebit}`,
      { headers: this.httpOptions(), withCredentials: false });
  }

  getHistoryDebit<T>(id) {
    return this.http.get<T>(`${this.base_path}/history/paydebit/${id}`,
      { headers: this.httpOptions(), withCredentials: false }
    );
  }

  getHistoryTransfer<T>(id) {
    return this.http.get<T>(`${this.base_path}/history/transfer/${id}`,
      { headers: this.httpOptions(), withCredentials: false }
    );
  }

  getHistoryReceive<T>(id) {
    return this.http.get<T>(`${this.base_path}/history/receive/${id}`,
      { headers: this.httpOptions(), withCredentials: false }
    );
  }

  queryInfo<T>(data) {
    return this.http.post<T>(`${this.base_path}/query_info`,
      data,
      { headers: this.httpOptions(), withCredentials: false }
    );
  }

  updateUserInfo<T>(data){
    return this.http.put<T>(`${this.base_path}/`,
      data,
      { headers: this.httpOptions(), withCredentials: false }
    );
  }
}
