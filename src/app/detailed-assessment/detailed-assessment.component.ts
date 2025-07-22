import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FormsModule } from '@angular/forms';

interface SubSkill {
  id: number;
  name: string;
  score: number | null;
}

interface AssessmentArea {
  id: number;
  name: string;
  subSkills: SubSkill[];
  isOpen?: boolean;
}

@Component({
  selector: 'app-detailed-assessment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './detailed-assessment.component.html',
  styleUrl: './detailed-assessment.component.css'
})
export class DetailedAssessmentComponent implements OnInit {
  assessmentAreas: AssessmentArea[] = [];
  isLoading = true;
  error = '';
  patientId: string | null = null;
  token = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('authToken') || '';
    this.patientId = this.route.snapshot.paramMap.get('patientId');
    if (this.token && this.patientId) {
      this.fetchAssessmentAreas();
    } else {
      this.error = 'Patient ID or auth token is missing.';
      this.isLoading = false;
    }
  }

  fetchAssessmentAreas(): void {
    this.isLoading = true;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    this.http.get<AssessmentArea[]>(`${environment.api.baseUrl}/api/v1/assessment-areas`, { headers }).subscribe({
      next: (data) => {
        this.assessmentAreas = data.map(area => ({ ...area, isOpen: false, subSkills: area.subSkills.map(s => ({...s, score: null})) }));
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to fetch assessment areas.';
        this.isLoading = false;
      }
    });
  }

  toggleAccordion(area: AssessmentArea): void {
    area.isOpen = !area.isOpen;
  }

  calculateScores(): void {
    const scores = this.assessmentAreas
      .flatMap(area => area.subSkills)
      .filter(subSkill => subSkill.score !== null && subSkill.score >= 0 && subSkill.score <= 5)
      .map(subSkill => ({ subSkillId: subSkill.id, score: subSkill.score }));

    if (scores.length === 0) {
      this.error = "Please enter at least one valid score between 0 and 5.";
      return;
    }
    this.error = '';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });
    const body = { scores };
    
    this.http.post(`${environment.api.baseUrl}/api/v1/assessment-areas/calculate-scores?patientId=${this.patientId}`, body, { headers }).subscribe({
      next: (response) => {
        console.log('Scores calculated successfully', response);
        this.router.navigate(['/score-result'], { state: { result: response } });
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to calculate scores.';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/therapist/patients']);
  }
}
