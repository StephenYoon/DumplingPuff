import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';

export class ApiService {
  /*
  apiURL = environment.apiUrl;
  user: SocialUser;
  defaultHeaders: HttpHeaders;

  constructor(private httpClient: HttpClient) {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.defaultHeaders = new HttpHeaders();
    this.defaultHeaders = this.defaultHeaders.append('Content-Type', 'application/json');
    if (this.user != null) {
      this.defaultHeaders = this.defaultHeaders.append('Authorization', 'Bearer ' + this.user.idToken);
    }
  }

  public getAccounts() {
    const accounts = this.httpClient.get<Account[]>(`${this.apiURL}/accounts`, { headers: this.defaultHeaders });
    return accounts;
  }
  */
}