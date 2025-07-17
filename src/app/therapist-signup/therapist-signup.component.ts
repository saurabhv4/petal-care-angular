import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-therapist-signup',
  templateUrl: './therapist-signup.component.html',
  styleUrls: ['./therapist-signup.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule]  // ✅ FIXED: Import form, template, and common modules
})
export class TherapistSignupComponent {
  therapistForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  submitted = false;
  isLoading = false;
  errorMessage = '';
  otpSent = false;
  otpSuccessMessage = '';
  updateMessage = '';
  updateMessageType: 'success' | 'error' = 'success';

  specialities = ['Occupational Therapist', 'Speech Therapist', 'Child Psychologist ', 'Behavioural Therapist'];

  constructor(private fb: FormBuilder, private router: Router, private apiService: ApiService) {
    this.therapistForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        licenceNumber: ['', Validators.required],
        speciality: ['', Validators.required],
        experience: ['', [Validators.required, Validators.min(0)]],
        country: ['', Validators.required],
        city: ['', Validators.required],
        pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
        address: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        otp: ['']
      },
      { validators: this.passwordMatchValidator }
    );
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  sendOtp() {
    this.errorMessage = '';
    this.otpSuccessMessage = '';
    this.otpSent = false;
    this.updateMessage = '';
    // Don't reset the otp value - keep the user's entered OTP
    // Only require email for OTP
    const email = this.therapistForm.get('email')?.value;
    if (!email || this.therapistForm.get('email')?.invalid) {
      this.errorMessage = 'Please enter a valid email before requesting OTP.';
      this.updateMessage = this.errorMessage;
      this.updateMessageType = 'error';
      this.autoHideUpdateMessage();
      return;
    }
    this.isLoading = true;
    this.apiService.sendOtp(email, 'signup').subscribe({
      next: (res) => {
        this.isLoading = false;
        this.otpSent = true;
        this.otpSuccessMessage = 'OTP sent successfully! Please check your email.';
        this.updateMessage = this.otpSuccessMessage;
        this.updateMessageType = 'success';
        this.autoHideUpdateMessage();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Failed to send OTP. Please try again.';
        this.updateMessage = this.errorMessage;
        this.updateMessageType = 'error';
        this.autoHideUpdateMessage();
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    this.updateMessage = '';
    const otpValue = this.therapistForm.get('otp')?.value;
    console.log('OTP value:', otpValue);
    console.log('OTP sent:', this.otpSent);
    if (this.therapistForm.invalid) {
      this.therapistForm.markAllAsTouched();
      return;
    }
    // Check if OTP is required and entered
    if (this.otpSent && !otpValue) {
      console.log('OTP validation failed - OTP is empty');
      this.errorMessage = 'Please enter the OTP sent to your email.';
      this.updateMessage = this.errorMessage;
      this.updateMessageType = 'error';
      this.autoHideUpdateMessage();
      return;
    }
    
    // Check if OTP was sent but not entered
    if (!this.otpSent) {
      console.log('OTP not sent yet');
      this.errorMessage = 'Please send OTP first before creating account.';
      this.updateMessage = this.errorMessage;
      this.updateMessageType = 'error';
      this.autoHideUpdateMessage();
      return;
    }
    console.log('Proceeding with signup, OTP:', otpValue);
    const therapistObj = this.mapFormToTherapistObj();
    this.isLoading = true;
    this.apiService.therapistSignupWithOtp(therapistObj, otpValue).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.therapistId) {
          localStorage.setItem('therapistId', res.therapistId);
        }
        this.updateMessage = 'Account created successfully!';
        this.updateMessageType = 'success';
        this.autoHideUpdateMessage();
        // On success, navigate to therapist dashboard after a short delay
        setTimeout(() => {
          this.router.navigate(['/therapist-dashboard']);
        }, 1200);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Failed to create account. Please try again.';
        this.updateMessage = this.errorMessage;
        this.updateMessageType = 'error';
        this.autoHideUpdateMessage();
      }
    });
  }

  mapFormToTherapistObj() {
    const f = this.therapistForm.value;
    return {
      name: `${f.firstName} ${f.lastName}`,
      emailId: f.email,
      password: f.password,
      yearsOfExperience: f.experience,
      specialist: f.speciality,
      registrationNo: f.licenceNumber,
      address: f.address,
      phoneNumber: f.contactNumber,
      pincode: f.pincode,
      city: f.city
    };
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  get f(): { [key: string]: AbstractControl } {
    return this.therapistForm.controls;
  }

  autoHideUpdateMessage() {
    setTimeout(() => {
      this.updateMessage = '';
    }, 3000);
  }
}
