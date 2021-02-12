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
    this.apiService.get<SocialUser[]>(apiPath)
      .pipe(map(users => {
          //console.log(res);
          this.users$.next(users);
          return users;
      }));

    return this.users$;
  }

  updateUsers(users: SocialUser[]): Observable<SocialUser[]>{
    this.users$.next(users);
    return this.users$;
  }

  getUserByEmail(email: string): Observable<SocialUser> {
    return this.apiService.get<SocialUser>(`${apiPath}/${email}`)
      .pipe(map(users => {
          return users;
      }));
  }

  addUser(user: SocialUser): void {
    this.apiService.post<string, SocialUser>(apiPath, user)
      .subscribe(res => {
        console.log(res);
      })
  }
  
  removeUser(email: string): void {
    this.apiService.delete<string, string>(`${apiPath}/${email}`, 'na')
      .subscribe(res => {
        console.log(res);
      })
  }

  clearSignedInUsers(): void {
    this.apiService.delete<string, string>(apiPath, 'na')
      .subscribe(res => {
        console.log(res);
      })
  }
}
