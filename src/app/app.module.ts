// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';
// import { AppRoutingModule } from './app-routing.module';
// import { routes } from './app.routes';

// // ✅ Firebase Imports
// import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
// import { provideAuth, getAuth } from '@angular/fire/auth';
// import { environment } from '../environments/environment';

// // ✅ Components
// import { AppComponent } from './app.component';
// import { LoginComponent } from './login/login.component';
// import { SignupComponent } from './signup/signup.component';
// import { VerifyOtpComponent } from './verify-otp/verify-otp.component';

// @NgModule({
//   declarations: [
//     AppComponent,
//     LoginComponent,
//     SignupComponent,
//     VerifyOtpComponent,
//   ],
//   imports: [
//     BrowserModule,
//     FormsModule,
//     ReactiveFormsModule,
//     RouterModule.forRoot(routes),
//     AppRoutingModule,

//     // ✅ Firebase initialization
//     provideFirebaseApp(() => initializeApp(environment.firebase)),
//     provideAuth(() => getAuth())
//   ],
//   providers: [],
//   bootstrap: [AppComponent]
// })
// export class AppModule {}
