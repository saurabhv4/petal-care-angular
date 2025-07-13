import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { saveFormState, loadFormState, clearFormState } from '../services/form-persistence.util';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class PatientDetailsComponent implements OnInit {
  patientForm: FormGroup;
  formKey = 'patientForm';
  successMsg: string = '';
  errorMsg: string = '';
  submitted = false;

  constructor(private fb: FormBuilder, private router: Router, private location: Location, private http: HttpClient) {
    this.patientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      medicalHistory: [''],
      familyHistory: ['']
    });
  }

  ngOnInit() {
    // Clear any previously saved patient form state to avoid pre-filling old data
    clearFormState(this.formKey);
    clearFormState('patients');
    const saved = loadFormState(this.formKey);
    if (saved) {
      this.patientForm.patchValue(saved);
    }
    this.patientForm.valueChanges.subscribe(val => {
      saveFormState(this.formKey, val);
    });
  }

  goBack() {
    this.location.back();
  }

  addPatient() {
    let patients = JSON.parse(localStorage.getItem('patients') || '[]');
    patients.push({
      fname: this.patientForm.value.firstName,
      lname: this.patientForm.value.lastName,
      gender: this.patientForm.value.gender,
      dob: this.patientForm.value.dob,
      patientMedicalHistory: this.patientForm.value.medicalHistory,
      familyMedicalHistory: this.patientForm.value.familyHistory
    });
    localStorage.setItem('patients', JSON.stringify(patients));
    this.patientForm.reset();
  }

  onSubmit() {
    this.submitted = true;
    if (this.patientForm.valid) {
      const signupData = JSON.parse(localStorage.getItem('signupForm') || '{}');
      const guardianData = JSON.parse(localStorage.getItem('guardianForm') || '{}');
      let patients = JSON.parse(localStorage.getItem('patients') || '[]');

      // Always add the current form as a patient if not already added
      if (this.patientForm.value.firstName || this.patientForm.value.lastName || this.patientForm.value.dob) {
        patients.push({
          fname: this.patientForm.value.firstName,
          lname: this.patientForm.value.lastName,
          gender: this.patientForm.value.gender,
          dob: this.patientForm.value.dob,
          patientMedicalHistory: this.patientForm.value.medicalHistory,
          familyMedicalHistory: this.patientForm.value.familyHistory
        });
      }

      const otp = localStorage.getItem('signupOtp');
      if (!otp) {
        this.errorMsg = 'OTP not found. Please complete OTP verification first.';
        return;
      }

      if (patients.length === 0) {
        this.errorMsg = 'Please add at least one patient.';
        return;
      }

      const body = {
        ...signupData,
        ...guardianData,
        isActive: true,
        parentType: 'primary',
        createdAt: new Date().toISOString(),
        createdBy: 'system',
        updatedBy: 'system',
        updatedAt: new Date().toISOString(),
        subscriptionTier: 'gold',
        patients: patients
      };

      // Debugging output
      console.log('Signup (parent) data:', signupData);
      console.log('Guardian data:', guardianData);
      console.log('Patients array at submit:', patients);
      console.log('Signup body:', body);

      const url = `${environment.api.baseUrl}/api/v1/auth/signup?otp=${otp}`;
      this.http.post(url, body, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }).subscribe({
        next: (response: any) => {
          // Save session info for Early Detection
          const firstPatientDob = Array.isArray(response.patients) && response.patients.length > 0
            ? response.patients[0].dob
            : undefined;

          localStorage.setItem('userSession', JSON.stringify({
            token: response.token,
            firstName: response.fname,   // Parent's first name
            lastName: response.lname,    // Parent's last name
            dob: firstPatientDob         // Patient's DOB
          }));
          localStorage.setItem('authToken', response.token);
          console.log('Signup response:', response);
          console.log('Saving userSession:', {
            token: response.token,
            firstName: response.fname,
            lastName: response.lname,
            dob: response.patients?.[0]?.dob
          });
          // Clear all form states
          localStorage.removeItem('signupForm');
          localStorage.removeItem('guardianForm');
          localStorage.removeItem('patients');
          localStorage.removeItem('signupOtp');
          this.successMsg = 'Account created successfully!';
          setTimeout(() => {
            this.router.navigate(['/early-detection']);
          }, 1500);
        },
        error: (err) => {
          if (err.error && err.error.message) {
            this.errorMsg = err.error.message;
          } else if (err.status && err.statusText) {
            this.errorMsg = `Error ${err.status}: ${err.statusText}`;
          } else {
            this.errorMsg = 'Failed to create account. Please try again.';
          }
        }
      });
    }
  }
}