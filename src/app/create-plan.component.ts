import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ResultService } from './services/result.service';

interface Area {
  name: string;
  totalSubSkills: number;
  totalScore: number;
  percentageScore: number;
  risk: 'High' | 'Medium' | 'Low';
}

@Component({
  selector: 'app-create-plan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-plan.component.html',
  styleUrls: ['./create-plan.component.css']
})
export class CreatePlanComponent implements OnInit {
  groupedAreas = [
    { label: 'High', color: '#ef4444', icon: 'error', areas: [] as Area[] },
    { label: 'Medium', color: '#eab308', icon: 'warning', areas: [] as Area[] },
    { label: 'Low', color: '#14b8a6', icon: 'info', areas: [] as Area[] }
  ];

  constructor(private router: Router, private resultService: ResultService) {}

  ngOnInit(): void {
    const result = this.resultService.getResult();
    if (result && result.assessmentAreas) {
      const areas: Area[] = result.assessmentAreas.map((area: any) => {
        let risk: 'Low' | 'Medium' | 'High' = 'Low';
        if (area.percentageScore >= 67) risk = 'High';
        else if (area.percentageScore >= 34) risk = 'Medium';
        return {
          name: area.areaName,
          totalSubSkills: area.totalSubSkills,
          totalScore: area.totalScore,
          percentageScore: area.percentageScore,
          risk
        };
      });
      this.groupedAreas.forEach(group => {
        group.areas = areas.filter(a => a.risk === group.label);
      });
    }
  }

  goToGoalDetails(area: Area) {
    this.router.navigate(['/goal-details'], { state: { area } });
  }

  createGoals() {
    // Placeholder for create goals action
    alert('Create Goals action!');
  }

  goBack() {
    window.history.back();
  }
}
