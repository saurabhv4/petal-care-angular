import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-firebase-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; max-width: 600px; margin: 0 auto;">
      <h2>Firebase Configuration Test</h2>
      
      <div *ngIf="testResult" [style.color]="testResult.success ? 'green' : 'red'">
        <h3>{{ testResult.success ? '✅ Success' : '❌ Error' }}</h3>
        <p>{{ testResult.message }}</p>
        <pre *ngIf="testResult.details">{{ testResult.details | json }}</pre>
      </div>
      
      <button (click)="testFirebaseConfig()" [disabled]="isTesting">
        {{ isTesting ? 'Testing...' : 'Test Firebase Configuration' }}
      </button>
      
      <button (click)="testGoogleAuth()" [disabled]="isTesting">
        {{ isTesting ? 'Testing...' : 'Test Google Auth' }}
      </button>
    </div>
  `,
  styles: []
})
export class FirebaseTestComponent {
  private authService = inject(AuthService);
  
  testResult: { success: boolean; message: string; details?: any } | null = null;
  isTesting = false;

  async testFirebaseConfig() {
    this.isTesting = true;
    this.testResult = null;
    
    try {
      // Test if we can access Firebase auth
      const auth = this.authService['auth'];
      console.log('Firebase Auth object:', auth);
      
      this.testResult = {
        success: true,
        message: 'Firebase configuration appears to be working correctly.',
        details: {
          authObject: !!auth,
          currentUser: auth?.currentUser
        }
      };
    } catch (error) {
      console.error('Firebase config test failed:', error);
      this.testResult = {
        success: false,
        message: 'Firebase configuration test failed. Check your API key and configuration.',
        details: error
      };
    } finally {
      this.isTesting = false;
    }
  }

  async testGoogleAuth() {
    this.isTesting = true;
    this.testResult = null;
    
    try {
      const result = await this.authService.googleLogin();
      this.testResult = {
        success: true,
        message: 'Google authentication is working correctly!',
        details: {
          user: result.user.email,
          displayName: result.user.displayName
        }
      };
    } catch (error) {
      console.error('Google auth test failed:', error);
      this.testResult = {
        success: false,
        message: 'Google authentication failed. Check your Firebase configuration and Google OAuth setup.',
        details: error
      };
    } finally {
      this.isTesting = false;
    }
  }
} 