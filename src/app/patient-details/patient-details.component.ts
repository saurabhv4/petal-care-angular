import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class PatientDetailsComponent {
  patientForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.patientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      medicalHistory: [''],
      familyHistory: ['']
    });
  }

  goBack() {
    this.router.navigate(['/guardian-details']);
  }

  createAccount() {
    if (this.patientForm.valid) {
      console.log('🎉 Account created with data:', this.patientForm.value);
      // TODO: Navigate or save
    }
  }
}
