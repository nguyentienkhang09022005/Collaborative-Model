import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../../../core/services/report.service';
import { ToastService } from '../../../../core/services/toast.service';
import { PreferenceService } from '../../../../core/services/preference.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import {
  DashboardSummaryItem,
  RevenueChartItem,
  PipelineFunnelItem,
  StaffPerformanceItem,
  LeadConversionItem
} from '../../../../core/models/report.model';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './report-list.html',
})
export class ReportListComponent implements OnInit {
  dashboardSummary: DashboardSummaryItem | null = null;
  revenueChart: RevenueChartItem[] = [];
  pipelineFunnel: PipelineFunnelItem | null = null;
  topPerformingStaff: StaffPerformanceItem[] = [];
  leadConversion: LeadConversionItem | null = null;

  isLoading = true;
  fromDate = '';
  toDate = '';

  private preferenceService = inject(PreferenceService);
  readonly themeConfig = this.preferenceService.themeConfig;

  // ── Chart configs (built from service data) ──────────────────────────────

  lineChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  barChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  doughnutData: ChartConfiguration<'doughnut'>['data'] = { labels: [], datasets: [] };

  readonly chartCommonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 600 },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: { boxWidth: 10, boxHeight: 10, padding: 16, color: '#475569' },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        titleFont: { family: 'Inter', size: 12, weight: 'bold' as const },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 10,
        cornerRadius: 8,
      },
    },
  };

  lineChartOptions: ChartOptions<'line'> = {
    ...this.chartCommonOptions,
    elements: {
      line: { tension: 0.4, borderWidth: 2.5 },
      point: { radius: 0, hoverRadius: 5 },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(148, 163, 184, 0.15)' },
        ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 }, maxRotation: 0 },
      },
    },
  };

  barChartOptions: ChartOptions<'bar'> = {
    ...this.chartCommonOptions,
    indexAxis: 'y',
    elements: { bar: { borderRadius: 6, borderSkipped: false } },
    plugins: { ...this.chartCommonOptions.plugins, legend: { display: false } },
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: 'rgba(148, 163, 184, 0.15)' },
        ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } },
      },
      y: { grid: { display: false }, ticks: { color: '#475569', font: { family: 'Inter', size: 12, weight: 'bold' as const } } },
    },
  };

  doughnutOptions: ChartOptions<'doughnut'> = {
    ...this.chartCommonOptions,
    cutout: '68%',
    plugins: { ...this.chartCommonOptions.plugins, legend: { display: false } },
  };

  constructor(
    private reportService: ReportService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    this.fromDate = thirtyDaysAgo.toISOString().split('T')[0];
    this.toDate = today.toISOString().split('T')[0];

    this.loadDashboardSummary();
    this.loadRevenueChart();
    this.loadPipelineFunnel();
    this.loadTopPerformingStaff();
    this.loadLeadConversion();
  }

  loadDashboardSummary(): void {
    this.reportService.GetDashboardSummary(
      new Date(this.fromDate).toISOString(),
      new Date(this.toDate + 'T23:59:59').toISOString(),
    ).subscribe({
      next: (res) => {
        this.dashboardSummary = res;
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error('Failed to load dashboard summary');
        this.isLoading = false;
      },
    });
  }

  loadRevenueChart(): void {
    this.reportService.GetRevenueChart(
      new Date(this.fromDate).toISOString(),
      new Date(this.toDate + 'T23:59:59').toISOString(),
      'day',
    ).subscribe({
      next: (res) => {
        this.revenueChart = res || [];
        this.lineChartData = {
          labels: this.revenueChart.map((r) => this.formatDate(r.date)),
          datasets: [
            {
              data: this.revenueChart.map((r) => r.wonAmount || 0),
              label: 'Won',
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              fill: true,
            },
            {
              data: this.revenueChart.map((r) => r.pipelineValue || 0),
              label: 'Pipeline',
              borderColor: '#7c3aed',
              backgroundColor: 'rgba(124, 58, 237, 0.06)',
              fill: true,
            },
          ],
        };
      },
      error: () => console.log('Failed to load revenue chart'),
    });
  }

  loadPipelineFunnel(): void {
    this.reportService.GetPipelineFunnel().subscribe({
      next: (res) => {
        this.pipelineFunnel = res;
        if (res) {
          this.barChartData = {
            labels: ['Open', 'Negotiating', 'Won'],
            datasets: [
              {
                data: [res.openDealsCount || 0, res.negotiatingDealsCount || 0, res.wonDealsCount || 0],
                backgroundColor: ['#3b82f6', '#f59e0b', '#10b981'],
                borderWidth: 0,
                barThickness: 22,
              },
            ],
          };
        }
      },
      error: () => console.log('Failed to load pipeline funnel'),
    });
  }

  loadTopPerformingStaff(): void {
    this.reportService.GetTopPerformingStaff(10).subscribe({
      next: (res) => (this.topPerformingStaff = res || []),
      error: () => console.log('Failed to load top performing staff'),
    });
  }

  loadLeadConversion(): void {
    this.reportService.GetLeadConversionReport(
      new Date(this.fromDate).toISOString(),
      new Date(this.toDate + 'T23:59:59').toISOString(),
    ).subscribe({
      next: (res) => {
        this.leadConversion = res;
        if (res) {
          const converted = res.convertedLeads || 0;
          const total = res.totalLeads || 0;
          const remaining = Math.max(total - converted, 0);
          this.doughnutData = {
            labels: ['Converted', 'Remaining'],
            datasets: [
              {
                data: [converted, remaining],
                backgroundColor: ['#10b981', '#e2e8f0'],
                borderWidth: 0,
                hoverOffset: 4,
              },
            ],
          };
        }
      },
      error: () => console.log('Failed to load lead conversion report'),
    });
  }

  refreshReports(): void {
    this.isLoading = true;
    this.loadDashboardSummary();
    this.loadRevenueChart();
    this.loadPipelineFunnel();
    this.loadTopPerformingStaff();
    this.loadLeadConversion();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0);
  }

  formatPercent(value: number | undefined): string {
    return ((value || 0)).toFixed(1) + '%';
  }

  getWinRate(): string {
    if (!this.dashboardSummary) return '0%';
    const total = this.dashboardSummary.totalLeads || 0;
    if (total === 0) return '0%';
    return ((this.dashboardSummary.totalCustomers / total) * 100).toFixed(1) + '%';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  shortDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  }
}
