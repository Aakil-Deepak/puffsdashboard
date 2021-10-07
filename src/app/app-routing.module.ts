import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BoardComponent } from './board/board.component';
import { LeaderBoardComponent } from './leaderboard/leader-board.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { UserEmailComponent } from './user-email/user-email.component';
import { AuthGuard } from './user/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },  
  { 
    path: 'board', 
    component: BoardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'useremail', component: UserEmailComponent },
      { path: 'leader', component: LeaderBoardComponent },
    ]
  },  
  { path: '', redirectTo: 'login', pathMatch: 'full' },  
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}