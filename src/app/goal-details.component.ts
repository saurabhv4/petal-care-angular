import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-goal-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './goal-details.component.html',
  styleUrls: ['./goal-details.component.css']
})
export class GoalDetailsComponent {
  area: any;
  goalName = '';
  goalDescription = '';
  frequency: 'Daily' | 'Weekly' | 'Custom' = 'Daily';
  message: string | null = null;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.area = nav?.extras?.state?.['area'] || { name: 'Area' };
  }

  setFrequency(freq: 'Daily' | 'Weekly' | 'Custom') {
    this.frequency = freq;
  }

  cancel() {
    this.router.navigate(['/create-plan']);
  }

  add() {
    // Placeholder for add action
    alert('Goal added!');
  }

  showMessage(msg: string) {
    this.message = msg;
  }
  dismissMessage() {
    this.message = null;
  }

  save() {
    // Placeholder for POST request
    // You would use HttpClient here and send the correct body and token
    this.showMessage('POST to api/v1/treatment-plans with goal info!');
    // this.router.navigate(['/create-plan']); // Only navigate after success
  }

  goBack() {
    window.history.back();
  }
}
