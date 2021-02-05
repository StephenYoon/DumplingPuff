import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SocialUser } from 'angularx-social-login';
import { ApiService } from './api.service';

const apiPath = 'api/signedInUser';

@Injectable({
  providedIn: 'root'
})
export class SignedInUserService {
  users$: BehaviorSubject<SocialUser[]>;

  constructor(private apiService: ApiService) {
    this.users$ = new BehaviorSubject<SocialUser[]>([]);
  }
  
  getUsers(): Observable<SocialUser[]> {
    var options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.apiService.get<SocialUser[]>(apiPath)
      .pipe(map(res => {
          //console.log(res);
          return res;
      }));
  }

  getUserByEmail(email: string): Observable<SocialUser[]> {
    var options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.apiService.get<SocialUser[]>(`${apiPath}/${email}`)
      .pipe(map(users => {
          this.users$.next(users);
          return users;
      }));
  }

  addUser(user: SocialUser): void {
    var options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    this.apiService.post<string, SocialUser>(apiPath, user)
      .subscribe(res => {
        console.log(res);
      })
  }
  
  clearSignedInUsers(): void {
    var options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    this.apiService.delete<string, string>(apiPath, 'na')
      .subscribe(res => {
        console.log(res);
      })
  }
}
