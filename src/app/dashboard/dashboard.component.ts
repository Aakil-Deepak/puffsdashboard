import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { EMPTY, Subject } from 'rxjs';
import { catchError, first, takeUntil } from 'rxjs/operators';
import { cityStateValueMap } from '../shared/city-state-map';
import { Constants } from '../shared/constants';
import { DashboardData } from '../shared/models/dashboard-data';
import { DashboardSearchModel } from '../shared/models/dashboard-search.model';
import { FilterModel } from '../shared/models/filter-model';
import { DashboardService } from '../shared/services/dashboard.service';
import { LoadingService } from '../shared/services/loading-service';
import { ChartData } from './../shared/models/chart-data';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  sortLocation = Constants.Cities;

  fromDate: NgbDateStruct | undefined;
  fromTime:  { hour: 0, minute: 20 };

  toDate: NgbDateStruct | undefined;
  toTime: { hour: 0, minute: 0 };

  fromDateDto: Date = new Date();
  toDateDto: Date = new Date();
  locationDto: string = '';
  informationDto: string = '';

  gameOrigin = 0;

  filterModel: FilterModel = null;

  chartData: ChartData = null;
  dashboardData: DashboardData = null;

  dashboardData$ = this.dashboardService.dashboardData$.pipe(
    catchError((err) => {
      return EMPTY;
    })
  );

  private destroy$ = new Subject<void>();

  constructor(
    private dashboardService: DashboardService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.initializeModel();

    this.dashboardService.dashboardData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.dashboardData = data;
        this.loadingService.clearLoading();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  setInformation(information: string) {
    this.informationDto = information;
  }

  setLocation(location: string) {
    this.locationDto = location;
  }

  generateChart() {
    let validationMessage = 'The following fields are required:\n\n ';
    if (
      this.fromDateDto !== null &&
      this.toDateDto !== null &&
      this.informationDto !== '' &&
      this.gameOrigin != null
    ) {
      this.loadingService.setLoading();
      var searchModel: DashboardSearchModel = this.createSearchModel();
      this.dashboardService.changeFilter(searchModel);
    }  else {
      if(this.fromDateDto === null) {
        validationMessage += 'FromDate\n'
      }
      if(this.toDateDto === null) {
        validationMessage += 'ToDate\n'
      }
      if(!this.informationDto) {
        validationMessage += 'Information\n'
      }  
      if(!this.gameOrigin) {
        validationMessage += 'Origin\n'
      }             
      alert(validationMessage);
    }
  }

  get isValid() {
    return this.fromDateDto !== null && this.toDateDto !== null;
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

  getDateEvent(event: NgbDateStruct, dateType: string) {
    if (dateType === 'fromDate')
      this.fromDateDto = new Date(event.year, event.month - 1, event.day);
    else
      this.toDateDto = new Date(event.year, event.month - 1, event.day);
  }

  getLastWeek() {
    this.fromDateDto = moment().subtract(1, 'weeks').startOf('week').toDate();
    this.fromDate = { day: this.fromDateDto.getUTCDate() + 1, month: this.fromDateDto.getUTCMonth() + 1, year: this.fromDateDto.getUTCFullYear()};
    this.toDateDto = moment().subtract(1, 'weeks').endOf('week').toDate();
    this.toDate = { day: this.toDateDto.getUTCDate(), month: this.toDateDto.getUTCMonth() + 1, year: this.toDateDto.getUTCFullYear()};
  }

  sortInformation: string[] = Constants.InformationOptions;

  exportToCSV(): void {
    var searchModel: DashboardSearchModel = this.createSearchModel();
    this.loadingService.setLoading();
    this.dashboardService.exportToCSV(searchModel)
    .pipe(first())
    .subscribe((response: any) => {
      const contentType = response.headers.get('content-type');
      const blob = new Blob([response.body], { type: contentType });
      const fileName = 'Analytics.csv';
      const file = new File([blob], fileName, { type: contentType });
      saveAs(file);
      this.loadingService.clearLoading();
    })
  }

  private initializeModel() {
    this.getLastWeek();
  }

  private createSearchModel() {
    this.fromDateDto = new Date(this.fromDate.year, this.fromDate.month, this.fromDate.day, this.fromTime ? this.fromTime.hour : 0, this.fromTime ? this.fromTime.minute : 0);
    this.toDateDto = new Date(this.toDate.year, this.toDate.month, this.toDate.day, this.toTime ? this.toTime.hour : 23, this.toTime ? this.toTime.minute : 50);
    const startUnixTime = this.fromDateDto.getTime() / 1000;
    const endUnixTime = this.toDateDto.getTime() / 1000;
    var searchModel: DashboardSearchModel = {
      start: startUnixTime,
      end: endUnixTime,
      city: this.locationDto,
      state: cityStateValueMap.get(this.locationDto),
      type: this.gameOrigin,
      source: 'all',
    };
    return searchModel;
  }
}
