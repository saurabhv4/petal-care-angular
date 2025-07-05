import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor(private fb: FormBuilder, private router: Router) {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.otpForm.valid) {
      this.router.navigate(['/guardian-details']);
    }
  }

  resendCode() {
    console.log('Resend triggered');
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}
