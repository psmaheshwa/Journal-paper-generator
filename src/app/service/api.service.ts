  import { Injectable } from '@angular/core';
  import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
  import {Observable, throwError} from 'rxjs';
  import {catchError} from 'rxjs/operators';
  import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUri: string = 'http://localhost:5000/generate';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http: HttpClient) { }

  getApiData(){
    let url = `${this.baseUri}/`;
    this.http
      .get(url, { responseType: "blob" })
      .toPromise()
      .then(blob => {
        saveAs(blob, "dump.gz");
      })
      .catch(err => console.error("download error = ", err))
  }

  postApiData(data): Observable<any> {
    let url = `${this.baseUri}/`;
    return this.http.post(url, data).pipe(catchError(this.errorMgmt));
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
