import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service'; // ✅ Import Firebase auth service

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  showPassword = false;
  selectedRole: 'user' | 'therapist' = 'user';
  email: string = '';
  password: string = '';
  loginError: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService   // ✅ Inject Firebase AuthService
  ) {}

  switchRole(role: 'user' | 'therapist') {
    this.selectedRole = role;
  }

  login(): void {
    this.loginError = '';
    const apiUrl = 'http://3.7.210.24:9001/api/v1/auth/login';
    const credentials = {
      email: this.email,
      password: this.password
    };

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    this.http.post(apiUrl, credentials, httpOptions).subscribe({
      next: (response: any) => {
        console.log('Login successful', response);
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }
        this.router.navigate(['/user-dashboard']);
      },
      error: (error) => {
        console.error('Login failed', error);
        this.loginError = 'Invalid credentials. Please try again.';
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  sendOtp(): void {
    const trimmedEmail = this.email.trim();
    if (!trimmedEmail) {
      alert("Please enter your email to receive OTP.");
      return;
    }

    const apiUrl = `http://3.7.210.24:9001/api/v1/auth/send-otp?id=${encodeURIComponent(trimmedEmail)}&action=signup`;

    this.http.post(apiUrl, {}).subscribe({
      next: () => {
        alert('OTP sent to your email.');
        this.router.navigate(['/verify-otp'], { queryParams: { email: trimmedEmail } });
      },
      error: (err) => {
        console.error('OTP error:', err);
        alert('Failed to send OTP. Please check the email and try again.');
      }
    });
  }

  // ✅ Google Login using Firebase
  loginWithGoogle(): void {
    this.authService.googleLogin()
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Google login success:', user);

        // Optional: Send user.email/token to backend to create session if needed
        alert(`Welcome, ${user.displayName}`);
        this.router.navigate(['/user-dashboard']);
      })
      .catch((error) => {
        console.error('Google login failed:', error);
        this.loginError = 'Google login failed. Please try again.';
      });
  }
}
