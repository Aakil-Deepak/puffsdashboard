import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject, throwError } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Constants } from '../shared/constants';
import { UserEmailData } from './user-email-data';
import { SessionStorageService } from './../user/session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserEmailListService {
  pageSize = 20;
  
  private pageNumberSubject = new BehaviorSubject<number>(0);
  private pageSizeSubject = new BehaviorSubject<number>(this.pageSize);
  private filterSubject = new BehaviorSubject<string>('');

  pageSizeAction$ = this.pageSizeSubject.asObservable();
  filterAction$ = this.filterSubject.asObservable();
  downloadCsvSubject = new Subject();
  
  constructor(
    private http: HttpClient,
    private sessionStorageService: SessionStorageService
  ) {}

  setPage(pageNumber: number): void {
		this.pageNumberSubject.next(pageNumber);
	}

	userEmailsData$ = combineLatest([
		this.pageNumberSubject,
		this.filterAction$
	]).pipe(
		switchMap(([currentPage, filterParameters]) => {
			return this.getUserEmails(filterParameters, currentPage, this.pageSize);
		}),
		shareReplay(1)
	);  

  totalResults$ = this.userEmailsData$.pipe(
		map((auditData) => auditData.total)
	);

  totalPages$ = combineLatest([
    this.totalResults$,
    this.pageSizeAction$
  ])
  .pipe(
    map(([total, pageSize]) => Math.ceil(total/pageSize))
  )

  getUserEmails(
    filterBy: string = '',
    pageNumber: number = 0,
    limit: number = 20
  ): Observable<UserEmailData> {

    const url = `${Constants.Base_Url}/api/RequestUsers?code=${Constants.Code}&start=${pageNumber}&limit=${limit}&q=${filterBy}`;

    return this.http
      .get<UserEmailData>(url, {
        observe: 'response',
        headers: this.getHeaders(),
      })
      .pipe(
        map((resp) => {
          return resp.body as UserEmailData;
        }),
        catchError((error) => this.handleError(error))
      );
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'auth-key': `${Constants.Auth_Key}`,
      token: `${this.sessionStorageService.get('token')}`,
    });
  }

  changeFilter(searchBy: string): void {
    this.filterSubject.next(searchBy);
  }

  exportToCSV(
    filterBy: string = ''    
  ): Observable<any> {
    const httpOptions: any = {
      observe: 'response',
      headers: this.getHeaders(),
      responseType: 'arraybuffer'
    }
    const url = `${Constants.Base_Url}/api/RequestUsers?code=${Constants.Code}&q=${filterBy}&export=csv`;
    return this.http.get(url, httpOptions)
    .pipe(
      catchError((response: HttpResponse<null>) => {
        return this.getError(response);
      })
    )
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }  

  private getError(res: HttpResponse<any>): Observable<any> {
    return throwError(new Error(`Server error: ${res.statusText} (${res.status})`));
  }
}
