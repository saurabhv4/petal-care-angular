import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent implements OnInit {
  result: any = null;

  constructor(private router: Router) {}

  ngOnInit() {
    const data = sessionStorage.getItem('assessmentResult');
    this.result = data ? JSON.parse(data) : null;
  }

  goToDashboard() {
    this.router.navigate(['/user-dashboard']);
  }
}
