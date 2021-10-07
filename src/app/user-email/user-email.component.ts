import { Component, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Subject } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { UserData } from './user-email-data';
import { UserEmailListService } from './user-email-list.service';
import { saveAs } from 'file-saver';
import { LoadingService } from '../shared/services/loading-service';

@Component({
  selector: 'app-user-email',
  templateUrl: './user-email.component.html',
  styleUrls: ['./user-email.component.css']
})
export class UserEmailComponent implements OnInit, OnDestroy  {

  private destroy$ = new Subject<void>();

  userEmails: UserData[] = []
  searchBy = '';
  downloadingCsv = false;

  totalResults$ = this.userEmailListService.totalResults$;
  totalPages$ = this.userEmailListService.totalPages$;
  pageSize$ = this.userEmailListService.pageSizeAction$;

  userEmailsData$ = this.userEmailListService.userEmailsData$
  .pipe(
    tap(data => this.loadingService.clearLoading()),
    catchError(err => {
      return EMPTY;
    })
  )

  currentPage = 1;

  constructor(
    private userEmailListService: UserEmailListService,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {

  }

  searchUsers(): void {
    this.userEmailListService.changeFilter(this.searchBy);
  }

  ngOnDestroy(): void {
		this.destroy$.next();
	}  

	onPageChange(pageNum: number) {
    this.loadingService.setLoading();
		this.userEmailListService.setPage(pageNum);
	}  

  exportToCSV(): void {
    this.loadingService.setLoading();
    this.userEmailListService.exportToCSV(this.searchBy)
    .pipe(first())
    .subscribe((response: any) => {
      const contentType = response.headers.get('content-type');
      const blob = new Blob([response.body], { type: contentType });
      const fileName = 'UserAndEmails.csv';
      const file = new File([blob], fileName, { type: contentType });
      saveAs(file);
      this.loadingService.clearLoading();
    })
  }
}
