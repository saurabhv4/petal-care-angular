import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-create-new-password',
  standalone: true,
  templateUrl: './create-new-password.component.html',
  styleUrls: ['./create-new-password.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class CreateNewPasswordComponent {
  passwordForm: FormGroup;
  submitted = false;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  errorMsg = '';
  email = '';

  public router = inject(Router);
  private route = inject(ActivatedRoute);
  private location = inject(Location);

  constructor(private fb: FormBuilder) {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordsMatchValidator });

    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  goBack() {
    this.location.back();
  }

  onSubmit() {
    this.submitted = true;
    this.errorMsg = '';
    if (this.passwordForm.valid) {
      // TODO: Call reset password API here
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.router.navigate(['/login']);
      }, 1200);
    } else {
      this.errorMsg = 'Please fix the errors above.';
    }
  }
} 