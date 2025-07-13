import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  templateUrl: './verify-otp-signup.component.html',
  styleUrls: ['./verify-otp-signup.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class VerifyOtpsignupComponent {
  email: string = 'example@example.com';
  otpForm: FormGroup;
  submitted = false;
  errorMsg = '';
  successMsg = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private location: Location,
    private route: ActivatedRoute
  ) {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
    });
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  onSubmit() {
    this.submitted = true;
    this.errorMsg = '';
    this.successMsg = '';
    if (this.otpForm.valid && this.email) {
      this.isLoading = true;
      const otp = this.otpForm.value.otp;
      console.log('Verifying OTP for', this.email, 'with code', otp);
      const url = `${environment.api.baseUrl}${environment.api.endpoints.verifyOtp}?id=${encodeURIComponent(this.email)}&otp=${encodeURIComponent(otp)}`;
      this.http.post(url, {}, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }).subscribe({
        next: () => {
          this.successMsg = 'OTP verified! Redirecting...';
          this.isLoading = false;
          localStorage.setItem('signupOtp', otp);
          setTimeout(() => {
            this.router.navigate(['/guardian-details'], { queryParams: { email: this.email } });
          }, 1000);
        },
        error: () => {
          this.errorMsg = 'Invalid or expired code. Please try again.';
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  resendCode() {
    this.errorMsg = '';
    this.successMsg = '';
    if (!this.email) {
      this.errorMsg = 'Email is missing. Please go back and try again.';
      this.isLoading = false;
      return;
    }
    this.isLoading = true;
    const url = `${environment.api.baseUrl}${environment.api.endpoints.sendOtp}?id=${encodeURIComponent(this.email)}&action=signup`;
    this.http.post(url, {}, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }).subscribe({
      next: () => {
        this.successMsg = `Code has been sent to ${this.email}`;
      },
      error: () => {
        this.errorMsg = 'Failed to resend code. Please try again.';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  goBack() {
    this.location.back();
  }
}
