import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.css'],
  imports: [CommonModule]
})
export class BookAppointmentComponent {
  days = [
    { date: 7, label: 'Thu', selected: false },
    { date: 8, label: 'Fri', selected: false },
    { date: 9, label: 'Sat', selected: true },
    { date: 10, label: 'Sun', selected: false },
    { date: 11, label: 'Mon', selected: false }
  ];
  hours = [
    { time: '12:00 PM', selected: true },
    { time: '12:10 PM', selected: false },
    { time: '12:20 PM', selected: false },
    { time: '12:30 PM', selected: false },
    { time: '12:40 PM', selected: false },
    { time: '12:50 PM', selected: false },
    { time: '01:00 PM', selected: false },
    { time: '01:10 PM', selected: false }
  ];
  success = false;

  selectDay(day: any) {
    this.days.forEach(d => d.selected = false);
    day.selected = true;
  }

  selectHour(hour: any) {
    this.hours.forEach(h => h.selected = false);
    hour.selected = true;
  }

  bookAppointment() {
    this.success = true;
    setTimeout(() => this.success = false, 2000);
  }
}