// src/app/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User,
  AuthError,
  authState,
  UserCredential  // Added missing import
} from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth: Auth = inject(Auth);

  /**
   * Login with Google using Firebase Auth
   * @returns Promise<UserCredential>
   */
  googleLogin(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    return signInWithPopup(this.auth, provider);
  }

  /**
   * Logout current user
   * @returns Promise<void>
   */
  logout(): Promise<void> {
    return signOut(this.auth);
  }

  /**
   * Get current user synchronously
   * @returns User | null
   */
  get currentUser(): User | null {
    return this.auth.currentUser;
  }

  /**
   * Observable of current authentication state
   * @returns Observable<boolean>
   */
  get isAuthenticated$(): Observable<boolean> {
    return authState(this.auth).pipe(
      map(user => !!user),
      catchError(error => {
        console.error('Auth state error:', error);
        return of(false);
      })
    );
  }

  /**
   * Observable of current user data
   * @returns Observable<User | null>
   */
  get user$(): Observable<User | null> {
    return authState(this.auth);
  }

  /**
   * Get ID token for current user
   * @returns Promise<string | null>
   */
  async getIdToken(): Promise<string | null> {
    try {
      return await this.auth.currentUser?.getIdToken() ?? null;
    } catch (error) {
      console.error('Failed to get ID token:', error);
      return null;
    }
  }

  /**
   * Handle Firebase Auth errors
   * @param error AuthError
   * @returns string - User friendly error message
   */
  getFriendlyAuthError(error: unknown): string {
    if (typeof error !== 'object' || error === null) {
      return 'Authentication failed. Please try again.';
    }

    const authError = error as AuthError;
    
    switch (authError.code) {
      case 'auth/popup-closed-by-user':
        return 'Login popup was closed. Please try again.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      default:
        console.warn('Unhandled auth error:', authError);
        return 'Authentication failed. Please try again.';
    }
  }
}