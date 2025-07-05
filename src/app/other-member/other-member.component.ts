import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-other-member',
  templateUrl: './other-member.component.html',
  styleUrls: ['./other-member.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class OtherMemberComponent {
  otherMemberForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private router: Router) {
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

  goBack() {
    this.router.navigate(['/guardian-details']);
  }

  createAccount() {
    this.submitted = true;
    if (this.otherMemberForm.valid) {
      // Handle form submission
      this.router.navigate(['/patient-details']);
    } else {
      this.otherMemberForm.markAllAsTouched();
    }
  }
}