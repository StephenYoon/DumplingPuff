import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SocialUser } from 'angularx-social-login';

const apiPath = 'api/signedInUser';

@Injectable({
  providedIn: 'root'
})
export class SignedInUserService {
  users$: BehaviorSubject<SocialUser[]>;

  constructor(private http: HttpClient) {
    this.users$ = new BehaviorSubject<SocialUser[]>([]);
  }
  
  getUsers(): Observable<SocialUser[]> {
    var options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.get<SocialUser[]>(apiPath, options)
      .pipe(map(res => {
          //console.log(res);
          return res;
      }));
  }

  getUserByEmail(email: string): Observable<SocialUser[]> {
    var options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.get<SocialUser[]>(`${apiPath}/${email}`,  options)
      .pipe(map(users => {
          this.users$.next(users);
          return users;
      }));
  }

  addUser(user: SocialUser): void {
    var options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    this.http.post<string>(apiPath, user,  options)
      .subscribe(res => {
        console.log(res);
      })
  }
  
  clearSignedInUsers(): void {
    var options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    this.http.delete<string>(apiPath,  options)
      .subscribe(res => {
        console.log(res);
      })
  }
}
