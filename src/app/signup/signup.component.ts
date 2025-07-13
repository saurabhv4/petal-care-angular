import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Location } from '@angular/common';
import { saveFormState, loadFormState, clearFormState } from '../services/form-persistence.util';

@Component({
  standalone: true,
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  submitted = false; // <-- use this instead of formSubmitted
  otpError = '';
  isLoading = false;
  formKey = 'signupForm';

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient, private location: Location) {
    this.signupForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        emailId: ['', [Validators.required, Validators.email]], // changed from 'email'
        mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // changed from 'contactNumber'
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        gender: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit() {
    // Clear any previously saved signup form state to avoid pre-filling old data
    clearFormState(this.formKey);
    const saved = loadFormState(this.formKey);
    if (saved) {
      this.signupForm.patchValue(saved);
    }
    this.signupForm.valueChanges.subscribe(val => {
      saveFormState(this.formKey, val);
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  goToLogin(): void {
    this.location.back();
  }

  onSubmit(): void {
    this.submitted = true;
    this.otpError = '';
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    // Save the full form value to localStorage for patient-details
    saveFormState(this.formKey, this.signupForm.value);
    const emailId = this.signupForm.value.emailId;
    const url = `${environment.api.baseUrl}${environment.api.endpoints.sendOtp}?id=${encodeURIComponent(emailId)}&action=signup`;
    this.http.post(url, {}, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/verify-otp-signup'], { queryParams: { email: emailId } });
        // Do NOT clearFormState here, so data is available for patient-details
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 409) {
          this.otpError = 'An account with this email or mobile already exists.';
        } else if (err.error && err.error.message) {
          this.otpError = err.error.message;
        } else {
          this.otpError = 'Failed to send OTP. Please try again.';
        }
      }
    });
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  get f(): { [key: string]: AbstractControl } {
    return this.signupForm.controls;
  }
}
