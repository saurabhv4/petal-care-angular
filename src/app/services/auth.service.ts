// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, signOut, user } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth) {}

  googleLogin() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  logout() {
    return signOut(this.auth);
  }

  get currentUser() {
    return this.auth.currentUser;
  }

  get isAuthenticated(): Observable<boolean> {
    return user(this.auth).pipe(
      map(user => !!user) // Convert user object to boolean (true if user exists, false otherwise)
    );
  }
}
