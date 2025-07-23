import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { ResultService } from '../services/result.service';

@Component({
  selector: 'app-score-result',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './score-result.component.html',
  styleUrls: ['./score-result.component.css']
})
export class ScoreResultComponent implements OnInit {
  overallRisk: 'Low' | 'Medium' | 'High' = 'Low';
  overallRiskLabel = '';
  assessmentAreas: { name: string; totalSubSkills: number; totalScore: number; percentageScore: number; risk: 'Low' | 'Medium' | 'High' }[] = [];
  riskGroups: { label: string; level: 'High' | 'Medium' | 'Low'; color: string; areas: { name: string; totalSubSkills: number; totalScore: number; percentageScore: number; risk: 'Low' | 'Medium' | 'High' }[]; groupPercentage: number; expanded: boolean }[] = [];
  totalSum = 0;

  constructor(private router: Router, private resultService: ResultService) {}

  ngOnInit(): void {
    // Get result from ResultService
    const result = this.resultService.getResult();
    console.log('Result in ScoreResultComponent:', result);
    if (result && result.assessmentAreas) {
      this.totalSum = result.totalSum || 0;
      if (this.totalSum >= 67) this.overallRisk = 'High';
      else if (this.totalSum >= 34) this.overallRisk = 'Medium';
      else this.overallRisk = 'Low';
      this.overallRiskLabel = this.overallRisk.toUpperCase();
      this.assessmentAreas = result.assessmentAreas.map((area: any) => {
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
      const totalAreas = this.assessmentAreas.length;
      const groupData = [
        { label: 'High Risk', level: 'High', color: '#ef4444' },
        { label: 'Medium Risk', level: 'Medium', color: '#eab308' },
        { label: 'Low Risk', level: 'Low', color: '#14b8a6' }
      ];
      this.riskGroups = groupData.map((g, idx) => {
        const areas = this.assessmentAreas.filter(a => a.risk === g.level);
        const groupPercentage = totalAreas ? Math.round((areas.length / totalAreas) * 100) : 0;
        return {
          label: g.label,
          level: g.level as 'High' | 'Medium' | 'Low',
          color: g.color,
          areas,
          groupPercentage,
          expanded: idx === 0
        };
      });
    }
    console.log('totalSum:', this.totalSum);
    console.log('riskGroups:', this.riskGroups);
  }

  toggleDropdown(index: number) {
    this.riskGroups.forEach((group, i) => group.expanded = i === index ? !group.expanded : false);
  }

  getRiskColor(risk: string): string {
    switch (risk.toLowerCase()) {
      case 'low': return '#B0F2B6';
      case 'medium': return '#F9F295';
      case 'high': return '#F7A7A7';
      default: return '#DDD';
    }
  }

  getRiskTextColor(risk: string): string {
    switch (risk.toLowerCase()) {
      case 'low': return '#146c2c';
      case 'medium': return '#967D00';
      case 'high': return '#9A1515';
      default: return '#333';
    }
  }

  getChartOffset(index: number): number {
    // Each segment starts after the previous one
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset -= this.riskGroups[i].groupPercentage * 2.4;
    }
    return offset;
  }

  createPlan() {
    alert('Navigating to create plan...');
  }

  goToCreatePlan() {
    this.router.navigate(['/create-plan']);
  }

  goBack() {
    this.router.navigate(['../']);
  }
}
