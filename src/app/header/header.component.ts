import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../user/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() isNavbarCollapsed = true;

  constructor(
        private router: Router, 
      private authService: AuthService) { }

  ngOnInit(): void {
      
  }

  logOut(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
