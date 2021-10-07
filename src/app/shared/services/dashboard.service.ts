import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { SessionStorageService } from 'src/app/user/session-storage.service';
import { Constants } from '../constants';
import { DashboardSearchModel } from '../models/dashboard-search.model';
import { DashboardData } from './../models/dashboard-data';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  pageSize = 20;

  private filterSubject = new BehaviorSubject<DashboardSearchModel>(null);

  filterAction$ = this.filterSubject.asObservable();

  dashboardData$ = this.filterAction$.pipe(
    filter(filterParam => !!filterParam),
    switchMap((filterParameters) => {
      return this.getDashboardData(filterParameters);
    }),
    shareReplay(1)
  );

  constructor(
    private http: HttpClient,
    private sessionStorageService: SessionStorageService
  ) {}

  getDashboardData(
    filterParameter: DashboardSearchModel
  ): Observable<DashboardData> {

    const {source, type} = {...filterParameter};

    const dateSegment = `start=${filterParameter.start}&end=${filterParameter.end}`;
    const locationSegment = `state=${filterParameter.state}&city=${filterParameter.state}`;
    const url = `${Constants.Base_Url}/api/RequestAnalytics?code=${Constants.Code}&${dateSegment}&source=${source}&type=${type}&${locationSegment}`;

    return this.http
      .get<DashboardData>(url, {
        observe: 'response',
        headers: this.getHeaders(),
      })
      .pipe(
        map((resp) => {
          return resp.body as DashboardData;
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

  changeFilter(filterModel: DashboardSearchModel): void {
    this.filterSubject.next(filterModel);
  }

  exportToCSV(filterParameter: DashboardSearchModel): Observable<any> {
    const httpOptions: any = {
      observe: 'response',
      headers: this.getHeaders(),
      responseType: 'arraybuffer'
    }
    const {source, type} = {...filterParameter};
    const dateSegment = `start=${filterParameter.start}&end=${filterParameter.end}`;
    const locationSegment = `state=${filterParameter.state}&city=${filterParameter.state}`;
    const url = `${Constants.Base_Url}/api/RequestAnalytics?code=${Constants.Code}&${dateSegment}&source=${source}&type=${type}&${locationSegment}&export=csv`;

    return this.http.get(url, httpOptions)
    .pipe(
      catchError((response: HttpResponse<null>) => {
        return this.getError(response);
      })
    )
  }   

  private getError(res: HttpResponse<any>): Observable<any> {
    return throwError(new Error(`Server error: ${res.statusText} (${res.status})`));
  }   

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}