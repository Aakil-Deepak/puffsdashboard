import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { SessionStorageService } from './session-storage.service';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    public auth: AuthService,
    private sessionStorageService: SessionStorageService,
    private router: Router    
    ) {}

  intercept(
    request: HttpRequest<any>, 
    next: HttpHandler
    ): Observable<HttpEvent<any>> {
      const currentToken = this.sessionStorageService.get('token');
      return next.handle(request).pipe(
        map((event: HttpEvent<any>) => {
          return event;
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 && error.statusText === 'Unauthorized') {
            this.router.navigate(['login']);
          }
          return throwError(error);
        })
      );
  }
}