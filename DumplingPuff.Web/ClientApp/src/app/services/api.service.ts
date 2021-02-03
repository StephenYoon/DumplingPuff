import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SocialUser } from 'angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  user: SocialUser;
  defaultHeaders: HttpHeaders;

  constructor(private http: HttpClient) { }

  get<T>(url: string, cachable: boolean = true): Observable<T> {
    return this.sendRequest<T>('GET', url, cachable);
  }

  post<T, U>(url: string, item: U): Observable<T> {
    return this.sendRequest<T, U>('POST', url, false, item);
  }

  put<T, U>(url: string, item: U, id: number): Observable<T> {
    return this.sendRequest<T, U>('PUT', `${url}/${id}`, false, item);
  }
  
  delete<T, U>(url: string, item: U): Observable<T> {
    return this.sendRequest<T, U>('DELETE', url, false, item);
  }

  // declarations of sendRequest
  private sendRequest<T>(verb: string, url: string, cachable?: boolean): Observable<T>;
  private sendRequest<T, U>(verb: string, url: string, cachable?: boolean, body?: U): Observable<T>;

  // definition of sendRequest
  private sendRequest<T, U>(
    verb: string,
    url: string,
    cachable: boolean = true,
    body?: U
  ): Observable<T> {
    
    // Create request headers
    var requestHeaders = new HttpHeaders();
    requestHeaders = requestHeaders.append('Content-Type', 'application/json');

    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user != null) {
      requestHeaders = requestHeaders.append('Authorization', 'Bearer ' + this.user.idToken);
    }

    /*
    if (!cachable) {
      requestHeaders = requestHeaders.set('NoCache', 'true');
    }
    */

    return this.http
      .request<T>(verb, url, {
        body,
        headers: requestHeaders
      });
  }
}