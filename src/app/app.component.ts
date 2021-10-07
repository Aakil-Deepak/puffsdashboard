import { Component } from '@angular/core';
import { LoadingService } from './shared/services/loading-service';
import { AuthService } from './user/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title="PuffsDashboard";

  loading$ = this.loadingService.loadingAction;

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService) {
  }  

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }
  
  get userName(): string {
    if (this.authService.currentUser) {
      return this.authService.currentUser.userName;
    }
    return '';
  }  
}

