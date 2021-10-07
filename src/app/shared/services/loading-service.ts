import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject$ = new BehaviorSubject<boolean>(null);
  loadingAction = this.loadingSubject$.asObservable();

  setLoading(): void {
    this.loadingSubject$.next(true);
  }

  clearLoading(): void {
    this.loadingSubject$.next(false);
  }
}
