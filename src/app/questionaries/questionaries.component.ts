import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-questionaries',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './questionaries.component.html',
  styleUrl: './questionaries.component.css'
})
export class QuestionariesComponent {
  questions: any[] = [];
  progress = '00/00';
  language: 'en' | 'hi' = 'en';

  constructor(private router: Router) {}

  ngOnInit() {
    const data = JSON.parse(localStorage.getItem('asdQuestionaries') || '[]');
    this.questions = Array.isArray(data) ? data : (data.questions || []);
    const answered = this.questions.filter(q => q.selectedOption).length;
    this.progress = `${answered.toString().padStart(2, '0')}/${this.questions.length.toString().padStart(2, '0')}`;
  }

  goToDashboard() {
    // Get user session and patient info
    const session = JSON.parse(localStorage.getItem('userSession') || '{}');
    const data = JSON.parse(localStorage.getItem('asdQuestionaries') || '[]');
    const questions = Array.isArray(data) ? data : (data.questions || []);
    // Try to get patientId from first question if present
    let patientId = null;
    if (questions.length && questions[0].patientId) {
      patientId = questions[0].patientId;
    } else if (session.patients && session.patients[0] && session.patients[0].patientId) {
      patientId = session.patients[0].patientId;
    }
    this.router.navigate(['/user-dashboard'], {
      state: {
        token: session.token,
        firstName: session.firstName,
        lastName: session.lastName,
        dob: session.dob,
        userId: session.userId,
        patientId: patientId
      }
    });
  }

  isAnswered(q: any) {
    return !!q.selectedOption;
  }

  goToQuestion(index: number) {
    this.router.navigate(['/questiondesc', index]);
  }

  setLanguage(lang: 'en' | 'hi') {
    this.language = lang;
  }
} 