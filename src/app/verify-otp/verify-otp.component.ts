import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class VerifyOtpComponent {
  email: string = '';
  otpForm: FormGroup;
  submitted = false;
  isLoading = false;
  errorMsg = '';
  successMsg = '';

  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor(private fb: FormBuilder) {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
    });
    // Get email from query params or localStorage
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || localStorage.getItem('verifyEmail') || '';
      if (this.email) localStorage.setItem('verifyEmail', this.email);
    });
  }

  onSubmit() {
    this.submitted = true;
    this.errorMsg = '';
    this.successMsg = '';
    if (this.otpForm.valid && this.email) {
      this.isLoading = true;
      const otp = this.otpForm.value.otp;
      const url = `${environment.api.baseUrl}${environment.api.endpoints.verifyOtp}?id=${encodeURIComponent(this.email)}&otp=${encodeURIComponent(otp)}`;
      this.http.post(url, {}, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }).subscribe({
        next: () => {
          this.successMsg = 'OTP verified! Redirecting...';
          setTimeout(() => {
            this.router.navigate(['/create-new-password'], { queryParams: { email: this.email } });
          }, 1000);
        },
        error: (err) => {
          this.errorMsg = 'Invalid or expired code. Please try again.';
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  resendCode() {
    this.errorMsg = '';
    this.successMsg = '';
    if (!this.email) return;
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
    this.router.navigate(['/patient-details']);
  }
}
