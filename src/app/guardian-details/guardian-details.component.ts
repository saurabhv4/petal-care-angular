import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-guardian-details',
  templateUrl: './guardian-details.component.html',
  styleUrls: ['./guardian-details.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class GuardianDetailsComponent {
  guardianForm: FormGroup;
  formSubmitted = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.guardianForm = this.fb.group({
      dob: ['', Validators.required],
      occupation: ['', Validators.required],
      relationship: ['', Validators.required],
    });
  }

  goBack() {
    this.router.navigate(['/verify-otp']);
  }

  nextStep() {
    this.formSubmitted = true;

    if (this.guardianForm.invalid) {
      this.guardianForm.markAllAsTouched();
      return;
    }

    console.log('✅ Guardian form submitted:', this.guardianForm.value);
    this.router.navigate(['/patient-details']);
  }

  addOtherGuardian() {
    this.router.navigate(['/other-member']);
  }
}
