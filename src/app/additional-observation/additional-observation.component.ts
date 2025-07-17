import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-additional-observation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './additional-observation.component.html',
  styleUrl: './additional-observation.component.css'
})
export class AdditionalObservationComponent {
  userText: string = '';
  audioFile: File | null = null;
  videoFile: File | null = null;
  isSubmitting = false;
  errorMessage = '';

  constructor(public http: HttpClient, public router: Router) {}

  onAudioChange(event: any) {
    this.audioFile = event.target.files[0] || null;
  }

  onVideoChange(event: any) {
    this.videoFile = event.target.files[0] || null;
  }

  async onSubmit() {
    this.isSubmitting = true;
    this.errorMessage = '';

    // Fetch required data from localStorage/session
    const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
    const token = userSession.token || localStorage.getItem('authToken') || '';
    const patientId = userSession.patientId || userSession.patients?.[0]?.id || userSession.patients?.[0]?.patientId;
    const ageGroup = userSession.ageGroup || userSession.patients?.[0]?.ageGroup || '';
    const language = localStorage.getItem('questionLanguage') || 'en';
    const questions = JSON.parse(localStorage.getItem('asdQuestionaries') || '[]');
    const userResponses = Array.isArray(questions) ? questions.map((q: any) => ({
      questionId: q.id || q.questionId,
      question: q.questionEn || q.question,
      answer: q.selectedOption || q.answer,
      domain: q.domain,
      instruction: q.instructionEn || q.instruction
    })) : [];

    if (!token || !patientId || !ageGroup || userResponses.length === 0) {
      this.errorMessage = 'Missing required data. Please complete the assessment.';
      this.isSubmitting = false;
      return;
    }

    const userRequest = {
      patientId,
      ageGroup,
      language,
      userText: this.userText,
      userResponses
    };

    const formData = new FormData();
    formData.append('userRequest', JSON.stringify(userRequest));
    if (this.audioFile) formData.append('audioFile', this.audioFile);
    if (this.videoFile) formData.append('videoFile', this.videoFile);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.post('/api/v1/asd-questionaries/calculate-scores-multipart', formData, { headers })
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          // Save result to session and navigate to result page
          sessionStorage.setItem('assessmentResult', JSON.stringify(response));
          this.router.navigate(['/result']);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err?.error?.message || 'Failed to submit. Please try again.';
        }
      });
  }
}
