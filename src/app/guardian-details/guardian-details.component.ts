import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { saveFormState, loadFormState, clearFormState } from '../services/form-persistence.util';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guardian-details',
  templateUrl: './guardian-details.component.html',
  styleUrls: ['./guardian-details.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class GuardianDetailsComponent implements OnInit {
  guardianForm: FormGroup;
  formKey = 'guardianForm';
  submitted = false;
  maxDob: string;

  constructor(private fb: FormBuilder, private router: Router, private location: Location) {
    this.guardianForm = this.fb.group({
      dob: ['', [Validators.required, this.minimumAgeValidator(18)]],
      occupation: ['', Validators.required],
      relationToChild: ['', Validators.required], // changed from 'relationship'
    });
    this.maxDob = this.calculateMaxDob(18);
  }

  minimumAgeValidator(minAge: number) {
    return (control: AbstractControl) => {
      const value = control.value;
      if (!value) return null;
      const today = new Date();
      const dob = new Date(value);
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      return age >= minAge ? null : { minAge: { requiredAge: minAge, actualAge: age } };
    };
  }

  calculateMaxDob(minAge: number): string {
    const today = new Date();
    today.setFullYear(today.getFullYear() - minAge);
    return today.toISOString().split('T')[0];
  }

  ngOnInit() {
    // Clear any previously saved guardian form state to avoid pre-filling old data
    clearFormState(this.formKey);
    const saved = loadFormState(this.formKey);
    if (saved) {
      this.guardianForm.patchValue(saved);
    }
    this.guardianForm.valueChanges.subscribe(val => {
      saveFormState(this.formKey, val);
    });
  }

  goBack() {
    this.location.back();
  }

  nextStep() {
    this.submitted = true;

    if (this.guardianForm.invalid) {
      this.guardianForm.markAllAsTouched();
      return;
    }

    // Save the full form value to localStorage for patient-details
    saveFormState(this.formKey, this.guardianForm.value);
    console.log('✅ Guardian form submitted:', this.guardianForm.value);
    this.router.navigate(['/patient-details']);
    // Do NOT clearFormState here, so data is available for patient-details
  }

  addOtherGuardian() {
    this.router.navigate(['/other-member']);
  }
}
