import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { TherapistSignupComponent } from './therapist-signup/therapist-signup.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';

import { VerifyOtpsignupComponent } from './verify-otp-signup/verify-otp-signup.component';
import { GuardianDetailsComponent } from './guardian-details/guardian-details.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';
import { OtherMemberComponent } from './other-member/other-member.component';
import { BookAppointmentComponent } from './book-appointment/book-appointment.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component'; // Import the new component

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'therapist-signup', component: TherapistSignupComponent },
  { path: 'verify-otp', component: VerifyOtpComponent },
  { path: 'verify-otp-signup', component: VerifyOtpsignupComponent },
  // { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'guardian-details',
    component: GuardianDetailsComponent,
  },
  {
    path: 'patient-details',
    component: PatientDetailsComponent,
  },
  { path: 'other-member', component: OtherMemberComponent },
  { path: 'book-appointment', component: BookAppointmentComponent },
  { path: 'user-dashboard', component: UserDashboardComponent }, // Add the new route
];
