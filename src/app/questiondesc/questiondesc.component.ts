import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-questiondesc',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './questiondesc.component.html',
  styleUrl: './questiondesc.component.css'
})
export class QuestionDescComponent implements OnInit {
  question: any;
  index: number = 0;
  questions: any[] = [];
  options = [
    { label: 'Never' },
    { label: 'Rarely' },
    { label: 'Sometimes' },
    { label: 'Always' }
  ];
  selectedOption: string | null = null;
  language: 'en' | 'hi' = 'en';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.index = +params['index'];
      this.loadQuestions();
      this.loadQuestion();
    });
  }

  get progress(): string {
    return `${(this.index + 1).toString().padStart(2, '0')}/${this.questions.length.toString().padStart(2, '0')}`;
  }

  get questionText(): string {
    if (!this.question) return '';
    return this.language === 'hi' ? this.question.questionHi : this.question.questionEn;
  }

  get instructionText(): string {
    if (!this.question) return '';
    return this.language === 'hi' ? this.question.instructionHi : this.question.instructionEn;
  }

  loadQuestions() {
    const data = JSON.parse(localStorage.getItem('asdQuestionaries') || '[]');
    this.questions = Array.isArray(data) ? data : (data.questions || []);
  }

  loadQuestion() {
    if (this.questions[this.index]) {
      this.question = this.questions[this.index];
      this.selectedOption = this.question.selectedOption || null;
    }
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.question.selectedOption = option;
    this.saveAnswer();
  }

  saveAnswer() {
    this.questions[this.index] = this.question;
    localStorage.setItem('asdQuestionaries', JSON.stringify(this.questions));
  }

  goToList() {
    this.router.navigate(['/questionaries']);
  }

  goToPrevious() {
    if (this.index > 0) {
      this.router.navigate(['/questiondesc', this.index - 1]);
    }
  }

  goToNext() {
    if (this.index < this.questions.length - 1) {
      this.router.navigate(['/questiondesc', this.index + 1]);
    } else {
      // After last question, go to additional observation page
      this.router.navigate(['/additional-observation']);
    }
  }

  isOptionSelected(option: string): boolean {
    return this.selectedOption === option;
  }

  setLanguage(lang: 'en' | 'hi') {
    this.language = lang;
  }
}
