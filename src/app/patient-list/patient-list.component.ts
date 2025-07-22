import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.css'
})
export class PatientListComponent implements OnInit {
  patients: any[] = [];
  isLoading = true;
  error = '';
  token = '';
  searchTerm = '';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('authToken') || '';
    if (this.token) {
      this.fetchPatients();
    } else {
      this.error = 'Authentication token not found. Please log in again.';
      this.isLoading = false;
    }
  }

  fetchPatients(): void {
    this.isLoading = true;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    this.http.get<any[]>(`${environment.api.baseUrl}/api/appointments/patients`, { headers }).subscribe({
      next: (data) => {
        console.log('API response:', data);
        this.patients = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to fetch patients.';
        this.isLoading = false;
      }
    });
  }

  get filteredPatients() {
    if (!this.searchTerm.trim()) return this.patients;
    const term = this.searchTerm.trim().toLowerCase();
    return this.patients.filter(patient =>
      (patient.firstName && patient.firstName.toLowerCase().includes(term)) ||
      (patient.lastName && patient.lastName.toLowerCase().includes(term))
    );
  }

  goToAssessment(patientId: number) {
    this.router.navigate(['/detailed-assessment', patientId]);
  }
}
