import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { LeaderBoardService } from '../shared/services/leaderboard.service';
import { EMPTY } from 'rxjs';
import { LeaderBoardPlayer } from '../shared/models/leaderboard-data';
import { catchError, first, tap } from 'rxjs/operators';
import { LeaderBoardSearchModel } from '../shared/models/leaderboard-search-model';
import { cityStateValueMap } from '../shared/city-state-map';
import { Constants } from '../shared/constants';
import { LoadingService } from '../shared/services/loading-service';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.css']
})
export class LeaderBoardComponent implements OnInit {

  currentPage = 1;

  fromDate: NgbDateStruct | undefined;
  fromTime: {hour: 0, minute: 0};

  toDate: NgbDateStruct | undefined;
  toTime: {hour: 0, minute: 0};

  fromDateDto: Date = new Date;
  toDateDto: Date = new Date;
  locationDto: string = '';
  sortLocation = Constants.Cities;
  
  players: LeaderBoardPlayer[] = []

  totalResults$ = this.leaderBoardService.totalResults$;
  totalPages$ = this.leaderBoardService.totalPages$;
  pageSize$ = this.leaderBoardService.pageSizeAction$;

  leaderBoardData$ = this.leaderBoardService.playersData$
    .pipe(
      tap(data => this.loadingService.clearLoading()),
      catchError(err => {
        console.log('error', err);
        return EMPTY;
      })
    );     

  constructor (
    private leaderBoardService: LeaderBoardService,
    private loadingService: LoadingService
  ) {

  }

  ngOnInit(): void {
    this.getLastWeek();
    this.generateLeaderBoard();
  }

  setLocation(location: string){
    this.locationDto = location;
  }  

  getTimeEvent(event: any, dateType: string) {
    if(event) {
      if(dateType === 'fromTime') {
        this.fromTime = {
          hour: event.hour,
          minute: event.minute
        }
      } else {
        this.toTime = {
          hour: event.hour,
          minute: event.minute
        }
      }
    }
  }
  
  getLastDay() {
    this.fromDateDto = moment().subtract(1, 'days').startOf('day').toDate();
    this.fromDate = { day: this.fromDateDto.getUTCDate() + 1, month: this.fromDateDto.getUTCMonth() + 1, year: this.fromDateDto.getUTCFullYear()};
    this.toDateDto = moment().subtract(1, 'days').endOf('day').toDate();
    this.toDate = { day: this.toDateDto.getUTCDate(), month: this.toDateDto.getUTCMonth() + 1, year: this.toDateDto.getUTCFullYear()};
 
  }

  getLastWeek() {
    this.fromDateDto = moment().subtract(1, 'weeks').startOf('week').toDate();
    this.fromDate = { day: this.fromDateDto.getUTCDate() + 1, month: this.fromDateDto.getUTCMonth() + 1, year: this.fromDateDto.getUTCFullYear()};
    this.toDateDto = moment().subtract(1, 'weeks').endOf('week').toDate();
    this.toDate = { day: this.toDateDto.getUTCDate(), month: this.toDateDto.getUTCMonth() + 1, year: this.toDateDto.getUTCFullYear()};
  }

  getLastMonth() {
    this.fromDateDto = moment().subtract(1, 'months').startOf('month').toDate();
    this.fromDate = { day: 1, month: this.fromDateDto.getUTCMonth() + 2, year: this.fromDateDto.getUTCFullYear()};
    this.toDateDto = moment().subtract(1, 'months').endOf('month').toDate();
    this.toDate = { day: this.toDateDto.getUTCDate(), month: this.toDateDto.getUTCMonth() + 1, year: this.toDateDto.getUTCFullYear()};
  }

  generateLeaderBoard() {
    this.fromDateDto;
    this.toDateDto;
    this.locationDto;

    if(this.fromDateDto !== null && this.toDateDto !== null) 
    {
        
      var searchModel: LeaderBoardSearchModel = this.createSearchModel();
      this.leaderBoardService.changeFilter(searchModel);
    }
  }

  private createSearchModel() {
    this.fromDateDto = new Date(this.fromDate.year, this.fromDate.month, this.fromDate.day, this.fromTime ? this.fromTime.hour : 0, this.fromTime ? this.fromTime.minute : 0);
    this.toDateDto = new Date(this.toDate.year, this.toDate.month, this.toDate.day, this.toTime ? this.toTime.hour : 23, this.toTime ? this.toTime.minute : 50);
    const startUnixTime = this.fromDateDto.getTime() / 1000;
    const endUnixTime = this.toDateDto.getTime() / 1000;
    var searchModel: LeaderBoardSearchModel = {
      start: startUnixTime,
      end: endUnixTime,
      city: this.locationDto,
      state: cityStateValueMap.get(this.locationDto)
    };
    return searchModel;
  }

  getDateEvent(event: NgbDateStruct, dateType: string) {
    if(dateType === 'from')
      this.fromDateDto = new Date(event.year, event.month - 1, event.day);    
    else
      this.toDateDto = new Date(event.year, event.month - 1, event.day); 
  }

  getLocationEvent(location: string){
    this.locationDto = location;
  }

	onPageChange(pageNum: number) {
    this.loadingService.setLoading();
		this.leaderBoardService.setPage(pageNum - 1);
	} 
  
  exportToCSV(): void {
    var searchModel: LeaderBoardSearchModel = this.createSearchModel();
    this.loadingService.setLoading();
    this.leaderBoardService.exportToCSV(searchModel)
    .pipe(first())
    .subscribe((response: any) => {
      const contentType = response.headers.get('content-type');
      const blob = new Blob([response.body], { type: contentType });
      const fileName = 'Leaderboard.csv';
      const file = new File([blob], fileName, { type: contentType });
      saveAs(file);
      this.loadingService.clearLoading();
    })
  }

  get isValid() {
    return this.fromDateDto !== null && this.toDateDto !== null;
  }
}
