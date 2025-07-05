import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-therapist-signup',
  templateUrl: './therapist-signup.component.html',
  styleUrls: ['./therapist-signup.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]  // ✅ FIXED: Import form and common modules
})
export class TherapistSignupComponent {
  therapistForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  submitted = false;

  specialities = ['Occupational Therapist', 'Speech Therapist', 'Child Psychologist ', 'Behavioural Therapist'];

  constructor(private fb: FormBuilder, private router: Router) {
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
    const email = this.therapistForm.get('email')?.value;
    console.log('Send OTP to:', email);
  }

  onSubmit() {
    this.submitted = true;
    if (this.therapistForm.invalid) {
      this.therapistForm.markAllAsTouched();
      return;
    }

    console.log('✅ Therapist signup data:', this.therapistForm.value);
    // API integration logic here
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  get f(): { [key: string]: AbstractControl } {
    return this.therapistForm.controls;
  }
}
