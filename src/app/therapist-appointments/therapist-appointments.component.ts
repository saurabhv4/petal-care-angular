import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-therapist-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './therapist-appointments.component.html',
  styleUrl: './therapist-appointments.component.css'
})
export class TherapistAppointmentsComponent implements OnInit {
  // Form state
  availabilityDate = '';
  dayOfWeek = '';
  startTime = '';
  endTime = '';
  numberOfSlots = '';
  appointmentError = '';
  appointmentSuccess = '';
  isAddingAvailability = false;
  availabilities: any[] = [];
  daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  token = '';
  therapistId = '';

  // Modal state for editing
  showEditModal = false;
  editAvailability: any = null;
  isUpdatingAvailability = false;
  updateError = '';
  updateSuccess = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('authToken') || '';
    this.therapistId = localStorage.getItem('therapistId') || '';
    if (this.token && this.therapistId) {
      this.fetchAvailabilities();
    }
  }

  onDateChange(dateStr: string) {
    if (!dateStr) return;
    const date = new Date(dateStr);
    const jsDay = date.getDay(); // 0=Sunday, 1=Monday, ...
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    this.dayOfWeek = days[jsDay];
  }

  addAvailability() {
    this.appointmentError = '';
    this.appointmentSuccess = '';
    if (!this.availabilityDate || !this.dayOfWeek || !this.startTime || !this.endTime || !this.numberOfSlots) {
      this.appointmentError = 'Please fill all fields.';
      return;
    }
    this.isAddingAvailability = true;
    const body = {
      availabilityDate: this.availabilityDate,
      dayOfWeek: this.dayOfWeek,
      startTime: this.startTime,
      endTime: this.endTime,
      numberOfSlots: this.numberOfSlots
    };
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });
    this.http.post(`${environment.api.baseUrl}/api/therapist/availability`, body, { headers }).subscribe({
      next: () => {
        this.appointmentSuccess = 'Availability added successfully!';
        this.isAddingAvailability = false;
        this.fetchAvailabilities();
        // Reset form
        this.availabilityDate = '';
        this.dayOfWeek = '';
        this.startTime = '';
        this.endTime = '';
        this.numberOfSlots = '';
      },
      error: (err) => {
        this.isAddingAvailability = false;
        this.appointmentError = err?.error?.message || 'Failed to add availability.';
      }
    });
  }

  fetchAvailabilities() {
    if (!this.therapistId) return;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    this.http.get<any>(`${environment.api.baseUrl}/api/therapist/availability/${this.therapistId}`, { headers }).subscribe({
      next: (data: any) => {
        let allAvailabilities: any[] = [];
        if (Array.isArray(data)) {
          allAvailabilities = data;
        } else if (data && Array.isArray(data.availabilities)) {
          allAvailabilities = data.availabilities;
        }
        
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        const todayString = `${year}-${month}-${day}`;

        this.availabilities = allAvailabilities.filter(a => a.availabilityDate >= todayString);
      },
      error: (err) => {
        this.availabilities = [];
      }
    });
  }

  openEditModal(availability: any) {
    this.editAvailability = { ...availability };
    this.showEditModal = true;
    this.updateError = '';
    this.updateSuccess = '';
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editAvailability = null;
    this.updateError = '';
    this.updateSuccess = '';
  }

  onEditDateChange(dateStr: string) {
    if (!dateStr) return;
    const date = new Date(dateStr);
    const jsDay = date.getDay();
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    if (this.editAvailability) {
      this.editAvailability.dayOfWeek = days[jsDay];
    }
  }

  updateAvailability() {
    if (!this.editAvailability) return;
    this.isUpdatingAvailability = true;
    this.updateError = '';
    this.updateSuccess = '';
    const id = this.editAvailability.availabilityId;
    const body = {
      availabilityDate: this.editAvailability.availabilityDate,
      dayOfWeek: this.editAvailability.dayOfWeek,
      startTime: this.editAvailability.startTime,
      endTime: this.editAvailability.endTime,
      numberOfSlots: this.editAvailability.numberOfSlots
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });
    this.http.put(`${environment.api.baseUrl}/api/therapist/availability/${id}`, body, { headers }).subscribe({
      next: () => {
        this.updateSuccess = 'Availability updated!';
        this.isUpdatingAvailability = false;
        this.closeEditModal();
        this.fetchAvailabilities();
      },
      error: (err) => {
        this.isUpdatingAvailability = false;
        this.updateError = err?.error?.message || 'Failed to update availability.';
      }
    });
  }
}
