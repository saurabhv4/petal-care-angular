import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';

interface Patient {
  id?: number;
  fname: string;
  lname: string;
  gender: string;
  dob: string;
  patientMedicalHistory?: string;
  familyMedicalHistory?: string;
}

interface UserProfile {
  userId: number;
  firstName: string;
  lastName: string;
  emailId: string;
  mobile: string;
  gender: string | null;
  dob: string;
  occupation: string;
  relationToChild: string;
  isActive: boolean;
  patients?: Patient[];
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userProfile: UserProfile | null = null;
  isLoading = true;
  errorMessage = '';
  token = '';
  isEditingPhone = false;
  editedPhone = '';
  isUpdating = false;
  updateMessage = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    // Get token from localStorage
    const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
    this.token = userSession.token || localStorage.getItem('authToken') || '';

    console.log('🔍 Loading user profile...');
    console.log('🔑 Token from localStorage:', this.token);
    console.log('📦 User session:', userSession);

    if (!this.token) {
      this.errorMessage = 'Authentication token not found. Please login again.';
      this.isLoading = false;
      return;
    }

    this.apiService.fetchUserProfile(this.token).subscribe({
      next: (response: UserProfile) => {
        console.log('✅ Profile loaded successfully:', response);
        this.userProfile = response;
        this.editedPhone = response.mobile || '';
        
        // If patients are not included in the main profile, fetch them separately
        if (!response.patients || response.patients.length === 0) {
          this.loadPatientDetails();
        } else {
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('❌ Error fetching user profile:', error);
        this.errorMessage = 'Failed to load profile. Please try again.';
        this.isLoading = false;
      }
    });
  }

  loadPatientDetails(): void {
    if (!this.token) return;

    this.apiService.fetchPatientDetails(this.token).subscribe({
      next: (response: any) => {
        console.log('✅ Patient details loaded successfully:', response);
        if (this.userProfile) {
          this.userProfile.patients = response.patients || response || [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error fetching patient details:', error);
        // Don't show error for patient details, just continue without them
        if (this.userProfile) {
          this.userProfile.patients = [];
        }
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/user-dashboard']);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Not provided';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getGenderDisplay(gender: string | null): string {
    if (!gender) return 'Not specified';
    return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
  }

  calculateAge(dob: string): number {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  getPatientDisplayName(patient: Patient): string {
    return `${patient.fname} ${patient.lname}`;
  }

  startEditPhone(): void {
    this.isEditingPhone = true;
    this.editedPhone = this.userProfile?.mobile || '';
    this.updateMessage = '';
  }

  cancelEditPhone(): void {
    this.isEditingPhone = false;
    this.editedPhone = this.userProfile?.mobile || '';
    this.updateMessage = '';
  }

  savePhoneNumber(): void {
    if (!this.userProfile || !this.token) {
      this.updateMessage = 'Error: Profile or token not available';
      return;
    }

    this.isUpdating = true;
    this.updateMessage = '';

    const updateData = {
      firstName: this.userProfile.firstName,
      lastName: this.userProfile.lastName,
      mobile: this.editedPhone,
      patients: [] // You can add patient data here if needed
    };

    console.log('📝 Updating phone number...');
    console.log('📱 New phone:', this.editedPhone);
    console.log('📦 Update data:', updateData);

    this.apiService.updateUserProfile(this.token, updateData).subscribe({
      next: (response) => {
        console.log('✅ Phone number updated successfully:', response);
        console.log('📱 Updated phone in profile:', this.editedPhone);
        if (this.userProfile) {
          this.userProfile.mobile = this.editedPhone;
          console.log('🔄 Profile updated locally:', this.userProfile.mobile);
        }
        this.isEditingPhone = false;
        this.isUpdating = false;
        this.updateMessage = 'Phone number updated successfully!';
        setTimeout(() => {
          this.updateMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('❌ Error updating phone number:', error);
        console.error('📋 Error details:', {
          status: error.status,
          message: error.message,
          error: error.error
        });
        this.isUpdating = false;
        this.updateMessage = 'Failed to update phone number. Please try again.';
      }
    });
  }
} 