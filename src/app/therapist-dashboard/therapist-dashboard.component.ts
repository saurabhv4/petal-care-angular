import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

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
  token = '';
  therapistId = '';

  // Remove all appointment-related state and methods
  // (No appointment form state, no availabilities, no addAvailability/fetchAvailabilities)

  constructor(private router: Router, private authService: AuthService, private http: HttpClient) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  ngOnInit(): void {
    // Check for JWT token authentication (regular login)
    const authToken = localStorage.getItem('authToken');
    const googleAuth = localStorage.getItem('googleAuth');
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    const therapistId = localStorage.getItem('therapistId');

    // Check if user is authenticated and has therapist role
    if ((authToken || (googleAuth === 'true' && userEmail)) && userRole === 'therapist') {
      this.isAuthenticated = true;
      this.userName = userName || userEmail || 'Therapist';
      this.token = authToken || '';
      this.therapistId = therapistId || '';
      console.log('Therapist authenticated via:', authToken ? 'JWT Token' : 'Google Auth');
      console.log('Therapist Dashboard Data:', { name: this.userName, token: this.token, therapistId: this.therapistId });
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

  // Remove addAvailability and fetchAvailabilities methods

  goToAppointments() {
    this.router.navigate(['/therapist-appointments']);
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