import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  showPassword = false;
  selectedRole: 'user' | 'therapist' = 'user';
  email: string = '';
  password: string = '';
  loginError: string = '';
  loginSuccess: string = '';
  isLoading = false;

  private router = inject(Router);
  private authService = inject(AuthService);
  private apiService = inject(ApiService);

  switchRole(role: 'user' | 'therapist'): void {
    this.selectedRole = role;
    this.loginError = '';
    this.loginSuccess = '';
  }

  async login(): Promise<void> {
    if (!this.email || !this.password) {
      this.loginError = 'Please fill all fields';
      return;
    }

    this.isLoading = true;
    this.loginError = '';
    this.loginSuccess = '';

    try {
      console.log('Attempting login with:', { email: this.email, role: this.selectedRole });
      console.log('API Config:', this.apiService.getApiConfig());
      
      const response = await this.apiService.login(this.email, this.password).toPromise();

      console.log('Login response:', response);

      if (response?.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userRole', this.selectedRole);
        
        console.log('Login successful, navigating to dashboard...');
        
        // Use window.location for hard navigation to ensure it works
        if (this.selectedRole === 'user') {
          window.location.href = '/user-dashboard';
        } else {
          window.location.href = '/therapist-dashboard';
        }
      } else {
        this.loginError = 'Invalid response from server';
      }
    } catch (error: unknown) {
      console.error('Login failed', error);
      this.loginError = 'Invalid credentials. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  async loginWithGoogle(): Promise<void> {
    this.isLoading = true;
    this.loginError = '';
    this.loginSuccess = '';

    try {
      console.log('Attempting Google login with role:', this.selectedRole);
      
      // Use the AuthService for Google login
      const result = await this.authService.googleLogin();
      
      console.log('Google login successful:', result.user);
      
      // Check if user exists in your backend
      const userEmail = result.user.email;
      if (!userEmail) {
        throw new Error('No email found from Google login');
      }

      try {
        // Check if user exists using the API
        console.log('Checking if user exists with email:', userEmail);
        
        // Try POST first, if it fails, try GET
        let userCheckResponse: any;
        try {
          userCheckResponse = await this.apiService.checkUser(userEmail).toPromise();
          console.log('POST request successful');
        } catch (postError) {
          console.log('POST request failed, trying GET...');
          userCheckResponse = await this.apiService.checkUserGet(userEmail).toPromise();
          console.log('GET request successful');
        }

        console.log('User check response:', userCheckResponse);

        if (userCheckResponse?.exists) {
          // User exists, store info and navigate
          localStorage.setItem('userRole', this.selectedRole);
          localStorage.setItem('userEmail', userEmail);
          localStorage.setItem('userName', result.user.displayName || '');
          localStorage.setItem('googleAuth', 'true');
          
          console.log('User exists, navigating to dashboard...');
          
          // Use window.location for hard navigation
          if (this.selectedRole === 'user') {
            window.location.href = '/user-dashboard';
          } else {
            window.location.href = '/therapist-dashboard';
          }
        } else {
          // User doesn't exist
          this.loginError = 'User does not exist. Please sign up first.';
          console.log('User does not exist in backend');
        }
      } catch (apiError: any) {
        console.error('API check failed:', apiError);
        console.error('API Error details:', {
          status: apiError.status,
          statusText: apiError.statusText,
          error: apiError.error,
          message: apiError.message,
          url: apiError.url
        });
        
        // If API fails, we can either:
        // Option 1: Allow login anyway (for testing)
        // Option 2: Show error message
        
        // For now, let's allow the login to proceed if the API fails
        // This is useful for testing when the API might be down
        console.log('API check failed, allowing login to proceed...');
        
        localStorage.setItem('userRole', this.selectedRole);
        localStorage.setItem('userEmail', userEmail);
        localStorage.setItem('userName', result.user.displayName || '');
        localStorage.setItem('googleAuth', 'true');
        
        console.log('Proceeding with login despite API failure...');
        
        // Use window.location for hard navigation
        if (this.selectedRole === 'user') {
          window.location.href = '/user-dashboard';
        } else {
          window.location.href = '/therapist-dashboard';
        }
      }
    } catch (error: unknown) {
      console.error('Google login failed:', error);
      const errorMessage = this.authService.getFriendlyAuthError(error);
      this.loginError = errorMessage;
    } finally {
      this.isLoading = false;
    }
  }

  async sendOtp(): Promise<void> {
    const trimmedEmail = this.email.trim();
    if (!trimmedEmail) {
      this.loginError = 'Please enter your email to receive OTP.';
      return;
    }

    this.isLoading = true;
    this.loginError = '';
    this.loginSuccess = '';

    try {
      await this.apiService.sendOtp(trimmedEmail, 'signup').toPromise();

      this.loginSuccess = 'OTP sent successfully! Please check your email.';
      
      // Navigate to OTP verification after a short delay
      setTimeout(() => {
        this.router.navigate(['/verify-otp'], { 
          queryParams: { email: trimmedEmail } 
        });
      }, 2000);
    } catch (error: unknown) {
      console.error('OTP error:', error);
      this.loginError = 'Failed to send OTP. Please check your email.';
    } finally {
      this.isLoading = false;
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}