import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private base_path = 'http://localhost:3000';
  constructor(
    private http: HttpClient
  ) { }
  httpOptions = () => {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }


  insertCustomer(user: any) {
    return this.http.post(this.base_path + '/employee/', JSON.stringify(user), { headers: this.httpOptions(), withCredentials: false });
  }
}
