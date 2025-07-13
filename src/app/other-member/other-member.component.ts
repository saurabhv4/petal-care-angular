import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { saveFormState, loadFormState, clearFormState } from '../services/form-persistence.util';

@Component({
  selector: 'app-other-member',
  templateUrl: './other-member.component.html',
  styleUrls: ['./other-member.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class OtherMemberComponent implements OnInit {
  otherMemberForm: FormGroup;
  submitted = false;
  formKey = 'otherMemberForm';

  constructor(private fb: FormBuilder, private router: Router, private location: Location) {
    this.otherMemberForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,}$')]],
      dob: ['', Validators.required],
      occupation: ['', Validators.required],
      relationship: ['', Validators.required],
    });
  }

  ngOnInit() {
    const saved = loadFormState(this.formKey);
    if (saved) {
      this.otherMemberForm.patchValue(saved);
    }
    this.otherMemberForm.valueChanges.subscribe(val => {
      saveFormState(this.formKey, val);
    });
  }

  goBack() {
    this.location.back();
  }

  onSubmit() {
    this.submitted = true;
    if (this.otherMemberForm.valid) {
      // Handle form submission
      this.router.navigate(['/patient-details']);
      clearFormState(this.formKey);
    } else {
      this.otherMemberForm.markAllAsTouched();
    }
  }
}