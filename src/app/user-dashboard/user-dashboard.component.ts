import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  isAuthenticated$: Observable<boolean>;
  isAuthenticated = false;
  userName = '';
  firstName = '';
  currentDate = '';
  token = '';
  userId = '';
  patientId = '';
  patientDob = '';
  drawerOpen = false;

  constructor(private router: Router, private authService: AuthService) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  ngOnInit(): void {
    // Get current date
    const today = new Date();
    this.currentDate = today.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

    // Get user/session info from localStorage
    const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
    this.token = userSession.token || localStorage.getItem('authToken') || '';
    this.firstName = userSession.firstName || localStorage.getItem('userName') || 'User';
    this.userId = userSession.userId || '';
    this.patientId = userSession.patientId || '';
    this.patientDob = userSession.dob || '';

    // Fallback for authentication
    const googleAuth = localStorage.getItem('googleAuth');
    const userEmail = localStorage.getItem('userEmail');
    if (this.token || (googleAuth === 'true' && userEmail)) {
      this.isAuthenticated = true;
      this.userName = this.firstName || userEmail || 'User';
    } else {
      this.isAuthenticated$.subscribe(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
        } else {
          this.isAuthenticated = true;
        }
      });
    }
  }

  toggleDrawer() {
    this.drawerOpen = !this.drawerOpen;
  }

  closeDrawer() {
    this.drawerOpen = false;
  }

  navigateToProfile() {
    this.closeDrawer();
    this.router.navigate(['/user-profile']);
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