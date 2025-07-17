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
import { TherapistDashboardComponent } from './therapist-dashboard/therapist-dashboard.component'; // Import therapist dashboard component
import { FirebaseTestComponent } from './firebase-test/firebase-test.component'; // Import Firebase test component
import { ConfigComponent } from './config/config.component'; // Import config component
import { CreateNewPasswordComponent } from './create-new-password/create-new-password.component'; // Import create new password component
import { EarlyDetectionComponent } from './early-detection/early-detection.component';
import { QuestionariesComponent } from './questionaries/questionaries.component';
import { QuestionDescComponent } from './questiondesc/questiondesc.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AdditionalObservationComponent } from './additional-observation/additional-observation.component';
import { ResultComponent } from './result/result.component';
import { TherapistAppointmentsComponent } from './therapist-appointments/therapist-appointments.component';

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
  { path: 'therapist-dashboard', component: TherapistDashboardComponent }, // Add therapist dashboard route
  { path: 'firebase-test', component: FirebaseTestComponent }, // Add Firebase test route
  { path: 'config', component: ConfigComponent }, // Add config route
  { path: 'create-new-password', component: CreateNewPasswordComponent }, // Add create new password route
  { path: 'early-detection', component: EarlyDetectionComponent },
  { path: 'questionaries', component: QuestionariesComponent },
  { path: 'questiondesc/:index', component: QuestionDescComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'additional-observation', component: AdditionalObservationComponent },
  { path: 'result', component: ResultComponent },
  { path: 'therapist-appointments', component: TherapistAppointmentsComponent },
];
