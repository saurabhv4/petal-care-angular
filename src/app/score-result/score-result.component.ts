import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface AreaResult {
  areaId: number;
  areaName: string;
  totalSubSkills: number;
  totalScore: number;
  percentageScore: number;
  risk: 'high' | 'medium' | 'low';
}

@Component({
  selector: 'app-score-result',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './score-result.component.html',
  styleUrl: './score-result.component.css'
})
export class ScoreResultComponent implements OnInit {
  result: any = null;
  overallRisk: 'high' | 'medium' | 'low' = 'low';
  overallRiskLabel = 'LOW';
  chartSegments: { color: string; label: string; percent: number; areaName: string; }[] = [];
  groupedAreas: { risk: 'high' | 'medium' | 'low'; label: string; color: string; areas: AreaResult[]; expanded: boolean; }[] = [];
  areaLabelPositions: { x: number; y: number; name: string }[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    this.result = nav?.extras?.state?.['result'] || null;
    this.processResult();
  }

  processResult() {
    if (!this.result || !this.result.assessmentAreas) return;
    const riskColors = { high: '#ef4444', medium: '#eab308', low: '#14b8a6' };
    const riskLabels = { high: 'High Risk', medium: 'Medium Risk', low: 'Low Risk' };
    const grouped: any = { high: [], medium: [], low: [] };
    let maxRisk: 'high' | 'medium' | 'low' = 'low';
    let totalSum = this.result.totalSum || 0;
    const areas: AreaResult[] = this.result.assessmentAreas.map((area: any) => {
      let risk: 'high' | 'medium' | 'low' = 'low';
      if (area.percentageScore >= 70) risk = 'high';
      else if (area.percentageScore >= 40) risk = 'medium';
      grouped[risk].push({ ...area, risk });
      if (risk === 'high') maxRisk = 'high';
      else if (risk === 'medium' && maxRisk !== 'high') maxRisk = 'medium';
      return { ...area, risk };
    });
    this.overallRisk = maxRisk;
    this.overallRiskLabel = maxRisk.toUpperCase();
    // Chart segments
    const total = areas.reduce((sum, a) => sum + a.percentageScore, 0) || 1;
    this.chartSegments = areas.map((a) => ({
      color: riskColors[a.risk],
      label: a.areaName,
      percent: a.percentageScore,
      areaName: a.areaName
    }));
    // Area label positions (evenly spaced around the circle)
    const n = areas.length;
    this.areaLabelPositions = areas.map((a, i) => {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      const r = 90;
      return {
        x: 60 + r * Math.cos(angle),
        y: 60 + r * Math.sin(angle) - 5,
        name: a.areaName
      };
    });
    // Grouped areas for summary
    this.groupedAreas = [
      { risk: 'high', label: riskLabels.high, color: riskColors.high, areas: grouped.high, expanded: grouped.high.length > 0 },
      { risk: 'medium', label: riskLabels.medium, color: riskColors.medium, areas: grouped.medium, expanded: grouped.high.length === 0 && grouped.medium.length > 0 },
      { risk: 'low', label: riskLabels.low, color: riskColors.low, areas: grouped.low, expanded: grouped.high.length === 0 && grouped.medium.length === 0 }
    ];
  }

  getChartOffset(index: number): number {
    // Each segment starts after the previous one
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset -= (this.chartSegments[i].percent * 3.77) / 100 * 377;
    }
    return offset;
  }

  getRiskColor(risk: string): string {
    if (risk === 'high') return '#ef4444';
    if (risk === 'medium') return '#eab308';
    return '#14b8a6';
  }

  toggleExpand(group: any) {
    group.expanded = !group.expanded;
  }

  createPlan() {
    // Placeholder for create plan action
    alert('Create Plan action!');
  }

  goBack(): void {
    this.router.navigate(['/therapist/patients']);
  }
}
