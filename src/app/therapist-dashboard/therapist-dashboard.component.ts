import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-therapist-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './therapist-dashboard.component.html',
  styleUrls: ['./therapist-dashboard.component.css']
})
export class TherapistDashboardComponent implements OnInit {

  isAuthenticated$: Observable<boolean>;
  isAuthenticated = false;
  userName = '';

  constructor(private router: Router, private authService: AuthService) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  ngOnInit(): void {
    // Check for JWT token authentication (regular login)
    const authToken = localStorage.getItem('authToken');
    const googleAuth = localStorage.getItem('googleAuth');
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');

    // Check if user is authenticated and has therapist role
    if ((authToken || (googleAuth === 'true' && userEmail)) && userRole === 'therapist') {
      this.isAuthenticated = true;
      this.userName = userName || userEmail || 'Therapist';
      console.log('Therapist authenticated via:', authToken ? 'JWT Token' : 'Google Auth');
    } else if (authToken || (googleAuth === 'true' && userEmail)) {
      // User is authenticated but not a therapist, redirect to user dashboard
      console.log('User is not a therapist, redirecting to user dashboard');
      this.router.navigate(['/user-dashboard']);
    } else {
      // Check Firebase authentication as fallback
      this.isAuthenticated$.subscribe(isAuthenticated => {
        if (!isAuthenticated) {
          console.log('No authentication found, redirecting to login');
          this.router.navigate(['/login']);
        } else {
          this.isAuthenticated = true;
          console.log('Therapist authenticated via Firebase');
        }
      });
    }
  }

  logout() {
    // Clear all authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('googleAuth');
    
    // Also logout from Firebase if needed
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    }).catch(() => {
      // If Firebase logout fails, still redirect to login
      this.router.navigate(['/login']);
    });
  }
} 