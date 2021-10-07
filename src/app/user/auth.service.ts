import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Constants } from '../shared/constants';
import { SessionStorageService } from './session-storage.service';

import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser!: User | null;
  token = '';
  redirectUrl: string = '';

  constructor(
    private sessionStorageService: SessionStorageService,
    private http: HttpClient
    ) 
  {
      this.currentUser = <User>JSON.parse(sessionStorageService.get('user'));
      this.token = this.sessionStorageService.get('token');
  }

  get isLoggedIn(): boolean {
    const token = this.sessionStorageService.get('token');
    return !!this.currentUser && !!token;
  }

  login (
    email: string, 
    accessCode: string, 
    token: string
    ): Observable<LoginResult> {

    if (!email) {
        return EMPTY;
    }      
    const url = `${Constants.Base_Url}/api/RequestLogin?code=${Constants.Code}`;

    const requestBody = {
      email: email,
      accesscode: accessCode,
      totp: token
    };

    return this.http
      .post<LoginResult>(url, JSON.stringify(requestBody), {
        headers: this.getHeaders(),
        observe: 'response'
      })
      .pipe(
        map((resp)=> {
          this.currentUser = { userName: email, accessCode, token }
  
          this.sessionStorageService.set('user', JSON.stringify(this.currentUser));             
          return resp.body as LoginResult;  
        }),
        catchError((error) => this.handleError(error))
      )
  }  

  logout(): void {
    this.currentUser = null;
    this.sessionStorageService.remove('currentUser'); 
    this.sessionStorageService.remove('token'); 
    this.sessionStorageService.clear();      
  }  

  getToken(): string {
    return this.sessionStorageService.get('token');
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'auth-key' : `${Constants.Auth_Key}`
    });
  }

	private handleError(error: HttpErrorResponse) {
		return throwError(error);
	}  
}

export interface LoginResult {
  token: string;
  hashcode: string;
  valid: number;
}

