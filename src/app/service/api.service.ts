  import { Injectable } from '@angular/core';
  import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
  import {Observable, throwError} from 'rxjs';
  import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUri: string = 'http://localhost:5000/pdfmake';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http: HttpClient) { }

  postApiData(data): Observable<any> {
    let url = `${this.baseUri}/`;
    return this.http.post(url+'/pdf', data).pipe(catchError(this.errorMgmt));
  }
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
