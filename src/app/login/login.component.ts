import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../user/auth.service';
import { SessionStorageService } from '../user/session-storage.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { LoadingService } from '../shared/services/loading-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  isLoggedIn = false; 
  loginForm: FormGroup = new FormGroup({});
  errorMessage = '';

  constructor(
    private router: Router, 
    private fb: FormBuilder,
    private authService: AuthService,
    private sessionStorageService: SessionStorageService,
    private loadingService: LoadingService) {

  }

  ngOnInit(): void {
    const token = this.sessionStorageService.get('token');
    if(token) {
      this.router.navigateByUrl('/board');
    }
    this.createForm(); 
  }

  ngOnDestroy(): void {
		this.destroy$.next();
	}

  createForm() {
    this.loginForm = this.fb.group({
       email: ['', [Validators.required, Validators.email] ],
       accessCode: ['', Validators.required ],
       token: ['', Validators.required ],
    });
  }
  
  
  login(): void {
    if(this.loginForm && this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const accessCode = this.loginForm.get('accessCode')?.value;
      const token = this.loginForm.get('token')?.value;

      this.loadingService.setLoading();

      this.authService
        .login(email, accessCode, token)
        .pipe(
          takeUntil(this.destroy$), 
          finalize(() => this.loadingService.clearLoading())
        )
        .subscribe((data) => {
          this.sessionStorageService.set('token', data.token)
          this.router.navigate(['/board']);          
        }, err => {
          this.errorMessage = 'Invalid credentials';
          this.sessionStorageService.set('token', '');
        });
    } else {
      alert("Invalid login credentials");
    }
  }

  get email() { return this.loginForm.get('email');}
  get accessCode() { return this.loginForm.get('accessCode');}
  get token() { return this.loginForm.get('token');}
}
