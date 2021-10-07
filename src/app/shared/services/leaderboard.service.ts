import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  throwError,
} from 'rxjs';
import {
  catchError,
  filter,
  map,
  shareReplay,
  switchMap,
} from 'rxjs/operators';
import { SessionStorageService } from '../../user/session-storage.service';
import { Constants } from '../constants';
import { LeaderBoardData } from '../models/leaderboard-data';
import { LeaderBoardSearchModel } from '../models/leaderboard-search-model';
import { LoadingService } from './loading-service';

@Injectable({
  providedIn: 'root',
})
export class LeaderBoardService {
  pageSize = 20;

  private pageNumberSubject = new BehaviorSubject<number>(0);
  private pageSizeSubject = new BehaviorSubject<number>(this.pageSize);
  private filterSubject = new BehaviorSubject<LeaderBoardSearchModel>(null);

  pageSizeAction$ = this.pageSizeSubject.asObservable();
  filterAction$ = this.filterSubject.asObservable();

  constructor(
    private http: HttpClient,
    private sessionStorageService: SessionStorageService,
    private loadingService: LoadingService
  ) {}

  setPage(pageNumber: number): void {
    this.pageNumberSubject.next(pageNumber);
  }

  playersData$ = combineLatest([
    this.pageNumberSubject,
    this.filterAction$,
  ]).pipe(
    filter(([currentPage, filterParameters]) => !!filterParameters),
    switchMap(([currentPage, filterParameters]) => {
      return this.getPlayers(filterParameters, currentPage, this.pageSize);
    }),
    shareReplay(1)
  );

  totalResults$ = this.playersData$.pipe(map((auditData) => auditData.total));

  totalPages$ = combineLatest([this.totalResults$, this.pageSizeAction$]).pipe(
    map(([total, pageSize]) => Math.ceil(total / pageSize))
  );

  getPlayers(
    filterParameter: LeaderBoardSearchModel,
    pageNumber: number = 0,
    limit: number = 20
  ): Observable<LeaderBoardData> {
    const pagingSegment = `pos=${pageNumber}&limit=${limit}`;
    const dateSegment = `start=${filterParameter.start}&end=${filterParameter.end}`;
    const locationSegment = `state=${filterParameter.state}&city=${filterParameter.state}`;
    const url = `${Constants.Base_Url}/api/RequestMainLeaderboard?code=${Constants.Code}&${dateSegment}&${pagingSegment}&${locationSegment}`;

    return this.http
      .get<LeaderBoardData>(url, {
        observe: 'response',
        headers: this.getHeaders(),
      })
      .pipe(
        map((resp) => {
          return resp.body as LeaderBoardData;
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

  changeFilter(filterModel: LeaderBoardSearchModel): void {
    this.filterSubject.next(filterModel);
    this.setPage(0);
  }

  exportToCSV(filterParameter: LeaderBoardSearchModel): Observable<any> {
    const httpOptions: any = {
      observe: 'response',
      headers: this.getHeaders(),
      responseType: 'arraybuffer'
    }

    const dateSegment = `start=${filterParameter.start}&end=${filterParameter.end}`;
    const locationSegment = `state=${filterParameter.state}&city=${filterParameter.state}`;
    const url = `${Constants.Base_Url}/api/RequestMainLeaderboard?code=${Constants.Code}&${dateSegment}&${locationSegment}&export=csv`;

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
