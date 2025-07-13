import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-early-detection',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './early-detection.component.html',
  styleUrl: './early-detection.component.css'
})
export class EarlyDetectionComponent {
  agreed = false;
  isLoading = false;
  errorMsg = '';
  constructor(private router: Router, private http: HttpClient) {}

  goToDashboard() {
    this.router.navigate(['/user-dashboard']); // or your actual dashboard route
  }

  startAssessment() {
    if (this.agreed) {
      const session = JSON.parse(localStorage.getItem('userSession') || '{}');
      console.log('Session in Early Detection:', session);
      if (!session.token || !session.dob) {
        this.errorMsg = 'Session expired or missing. Please log in again.';
        return;
      }
      this.isLoading = true;
      // Only send the date part
      const dob = session.dob.split('T')[0];
      this.http.get(
        `${environment.api.baseUrl}/api/v1/asd-questionaries?dob=${dob}`,
        { headers: { Authorization: `Bearer ${session.token}` } }
      ).subscribe({
        next: (data) => {
          localStorage.setItem('asdQuestionaries', JSON.stringify(data));
          this.isLoading = false;
          this.router.navigate(['/questionaries']);
        },
        error: (err) => {
          this.errorMsg = 'Failed to load questionnaires. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }
}
