import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private base_path = 'http://localhost:3000/users';
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

  getUser(id) {
    return this.http.get(this.base_path + `/${id}`).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

}
