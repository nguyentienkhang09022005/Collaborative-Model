import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../../../core/services/report.service';
import { ToastService } from '../../../../core/services/toast.service';
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
  imports: [CommonModule, FormsModule],
  templateUrl: './report-list.html',
})
export class ReportListComponent implements OnInit {
  // Dashboard Summary
  dashboardSummary: DashboardSummaryItem | null = null;

  // Charts
  revenueChart: RevenueChartItem[] = [];
  pipelineFunnel: PipelineFunnelItem[] = [];

  // Staff Performance
  topPerformingStaff: StaffPerformanceItem[] = [];
  leadConversion: LeadConversionItem | null = null;

  isLoading = true;
  fromDate = '';
  toDate = '';

  constructor(
    private reportService: ReportService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Default date range: last 30 days
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
      new Date(this.toDate + 'T23:59:59').toISOString()
    ).subscribe({
      next: (res) => {
        this.dashboardSummary = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastService.error('Failed to load dashboard summary');
        this.isLoading = false;
      }
    });
  }

  loadRevenueChart(): void {
    this.reportService.GetRevenueChart(
      new Date(this.fromDate).toISOString(),
      new Date(this.toDate + 'T23:59:59').toISOString(),
      'day'
    ).subscribe({
      next: (res) => {
        this.revenueChart = res;
      },
      error: (err) => {
        console.log('Failed to load revenue chart');
      }
    });
  }

  loadPipelineFunnel(): void {
    this.reportService.GetPipelineFunnel().subscribe({
      next: (res) => {
        this.pipelineFunnel = res;
      },
      error: (err) => {
        console.log('Failed to load pipeline funnel');
      }
    });
  }

  loadTopPerformingStaff(): void {
    this.reportService.GetTopPerformingStaff(10).subscribe({
      next: (res) => {
        this.topPerformingStaff = res;
      },
      error: (err) => {
        console.log('Failed to load top performing staff');
      }
    });
  }

  loadLeadConversion(): void {
    this.reportService.GetLeadConversionReport(
      new Date(this.fromDate).toISOString(),
      new Date(this.toDate + 'T23:59:59').toISOString()
    ).subscribe({
      next: (res) => {
        this.leadConversion = res;
      },
      error: (err) => {
        console.log('Failed to load lead conversion report');
      }
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
      maximumFractionDigits: 0
    }).format(value);
  }

  formatPercent(value: number | undefined): string {
    return (value || 0).toFixed(1) + '%';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}