import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { BoardComponent } from './board/board.component';
import { LeaderBoardComponent } from './leaderboard/leader-board.component';
import { LoginComponent } from './login/login.component';
import { UserEmailComponent } from './user-email/user-email.component';
import { AuthGuard } from './user/auth.guard';
import { AuthService } from './user/auth.service';
import { ChartComponent } from './chart/chart.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownComponent } from './shared/dropdown/dropdown.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatepickerPopupComponent } from './shared/datepicker-popup/datepicker-popup.component';
import { DashboardService } from './shared/services/dashboard.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingComponent } from './shared/loading/loading.component';
import { UserEmailListService } from './user-email/user-email-list.service';
import { LeaderBoardService } from './shared/services/leaderboard.service';
import { AuthInterceptor } from './user/auth.interceptor';
import { LoadingService } from './shared/services/loading-service';
import { TimepickerComponent } from './shared/time-picker/time-picker.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    UserEmailComponent,
    LeaderBoardComponent,
    HeaderComponent,
    BoardComponent,
    ChartComponent,
    DropdownComponent,
    DatepickerPopupComponent,
    LoadingComponent,
    TimepickerComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    DashboardService,
    UserEmailListService,
    LeaderBoardService,    
    LoadingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }    
  ],
  exports: [RouterModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
