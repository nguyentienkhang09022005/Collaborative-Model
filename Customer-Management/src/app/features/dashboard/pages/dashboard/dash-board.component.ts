import { Component, inject, computed } from '@angular/core';
import { ChartDealItem, StatisticsItem } from '../../../../core/models/dashboard.model';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { LeadService } from '../../../../core/services/lead.service';
import { LeadItem } from '../../../../core/models/lead.models';
import { ContactService } from '../../../../core/services/contact.service';
import { ContactItem } from '../../../../core/models/contact.model';
import { ToastService } from '../../../../core/services/toast.service';
import { PreferenceService } from '../../../../core/services/preference.service';

@Component({
  selector: 'app-dash-board',
  imports: [CommonModule, RouterModule, FormsModule, BaseChartDirective],
  templateUrl: './dash-board.html',
  styleUrls: ['./dash-board.css'],
})
export class DashboardComponent {
  today = new Date();
  statisticsItems: StatisticsItem | null = null;
  chartDealItems: ChartDealItem | null = null;
  leads: LeadItem[] = [];
  contacts: ContactItem[] = [];
  showModal: boolean = false;
  popupType = '';
  popupTitle = '';

  private preferenceService = inject(PreferenceService);
  readonly themeConfig = this.preferenceService.themeConfig;

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    elements: { bar: { borderRadius: 6, borderSkipped: false } },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: { family: 'Inter', size: 13, weight: 'bold' },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 12,
        cornerRadius: 8,
        callbacks: { label: (context) => ` ${context.parsed.y} leads` }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Leads', color: '#64748b' },
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: '#94a3b8', stepSize: 1, precision: 0 }
      },
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
    },
    animation: { duration: 1200, easing: 'easeOutQuart' }
  };

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };

  public lineChartLabels: string[] = [];
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: { tension: 0.4, borderWidth: 3 },
      point: { radius: 0, hoverRadius: 6 }
    },
    plugins: {
      legend: { position: 'top', labels: { usePointStyle: true, padding: 20 } },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: { family: 'Inter', size: 13, weight: 'bold' },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 12,
        cornerRadius: 8,
        callbacks: { label: (context) => ` $${(context.parsed.y ?? 0).toLocaleString()}` }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Revenue ($)', color: '#64748b' },
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: '#94a3b8', callback: (value) => `$${Number(value).toLocaleString()}` }
      },
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
    },
    animation: { duration: 1500, easing: 'easeOutQuart' }
  };

  public pieChartLabels: string[] = [];
  public pieChartData: number[] = [];
  public pieChart = {
    labels: this.pieChartLabels,
    datasets: [{
      data: this.pieChartData,
      backgroundColor: ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6']
    }]
  };

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 16,
          font: { family: 'Inter', size: 11 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: { family: 'Inter', size: 13, weight: 'bold' },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 12,
        cornerRadius: 8,
        callbacks: { label: (context) => ` ${context.parsed} contacts` }
      }
    },
    animation: { animateRotate: true, animateScale: true, duration: 1500 }
  };

  // Chart colors based on theme
  get axisLabelColor(): string {
    return this.themeConfig().id === 'dark' ? '#cbd5e1' : '#64748b';
  }

  get gridColor(): string {
    return this.themeConfig().id === 'dark' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.1)';
  }

  get tooltipBackground(): string {
    return this.themeConfig().id === 'dark' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(15, 23, 42, 0.9)';
  }

  // Dynamic chart options
  get barChartOptionsAdaptive(): ChartOptions<'bar'> {
    return {
      responsive: true,
      maintainAspectRatio: false,
      elements: { bar: { borderRadius: 6, borderSkipped: false } },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: this.tooltipBackground,
          titleFont: { family: 'Inter', size: 13, weight: 'bold' },
          bodyFont: { family: 'Inter', size: 12 },
          padding: 12,
          cornerRadius: 8,
          callbacks: { label: (context) => ` ${context.parsed.y} leads` }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Leads', color: this.axisLabelColor },
          grid: { color: this.gridColor },
          ticks: { color: this.axisLabelColor, stepSize: 1, precision: 0 }
        },
        x: { grid: { display: false }, ticks: { color: this.axisLabelColor } }
      },
      animation: { duration: 1200, easing: 'easeOutQuart' }
    };
  }

  get lineChartOptionsAdaptive(): ChartOptions<'line'> {
    return {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        line: { tension: 0.4, borderWidth: 3 },
        point: { radius: 0, hoverRadius: 6 }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20,
            color: this.axisLabelColor
          }
        },
        tooltip: {
          backgroundColor: this.tooltipBackground,
          titleFont: { family: 'Inter', size: 13, weight: 'bold' },
          bodyFont: { family: 'Inter', size: 12 },
          padding: 12,
          cornerRadius: 8,
          callbacks: { label: (context) => ` $${(context.parsed.y ?? 0).toLocaleString()}` }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Revenue ($)', color: this.axisLabelColor },
          grid: { color: this.gridColor },
          ticks: { color: this.axisLabelColor, callback: (value) => `$${Number(value).toLocaleString()}` }
        },
        x: { grid: { display: false }, ticks: { color: this.axisLabelColor } }
      },
      animation: { duration: 1500, easing: 'easeOutQuart' }
    };
  }

  get pieChartOptionsAdaptive(): ChartOptions<'pie'> {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 16,
            font: { family: 'Inter', size: 11 },
            color: this.axisLabelColor
          }
        },
        tooltip: {
          backgroundColor: this.tooltipBackground,
          titleFont: { family: 'Inter', size: 13, weight: 'bold' },
          bodyFont: { family: 'Inter', size: 12 },
          padding: 12,
          cornerRadius: 8,
          callbacks: { label: (context) => ` ${context.parsed} contacts` }
        }
      },
      animation: { animateRotate: true, animateScale: true, duration: 1500 }
    };
  }

  constructor(
    private dashboardService: DashboardService,
    private leadService: LeadService,
    private contactService: ContactService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.onQuantityStatistics();
    this.onChartDeal();
    this.onChartLead();
    this.onChartContact();
  }

  onQuantityStatistics() {
    this.dashboardService.GetStatistics().subscribe({
      next: (data) => {
        this.statisticsItems = data;
      },
      error: (err) => {
        this.toastService.error('Failed to load statistics');
      }
    });
  }

  onChartDeal() {
    this.dashboardService.GetChartDeal().subscribe({
      next: (data) => {
        this.chartDealItems = data;

        const successDeals = data.listSuccessfullDeal || [];
        const failedDeals = data.listFailedDeal || [];

        const currentYear = new Date().getFullYear();
        const defaultLabels = Array.from({ length: 12 }, (_, i) => `${i + 1}-${currentYear}`);

        const groupByMonth = (items: ListDealItem[]) => {
          const result: Record<string, number> = {};
          items.forEach(item => {
            const date = new Date(item.createdAt);
            const label = `${date.getMonth() + 1}-${date.getFullYear()}`;
            if (!result[label]) result[label] = 0;
            result[label] += item.price;
          });
          return result;
        };

        const successByMonth = groupByMonth(successDeals);
        const failedByMonth = groupByMonth(failedDeals);

        const successData = defaultLabels.map(lb => successByMonth[lb] || 0);
        const failedData = defaultLabels.map(lb => failedByMonth[lb] || 0);

        this.lineChartData = {
          labels: defaultLabels,
          datasets: [
            {
              data: successData,
              label: 'Won (Success)',
              borderColor: '#22c55e',
              backgroundColor: 'rgba(34,197,94,0.2)',
              fill: true,
              tension: 0.4,
            },
            {
              data: failedData,
              label: 'Lost (Failed)',
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239,68,68,0.2)',
              fill: true,
              tension: 0.4,
            }
          ]
        };
      },
      error: (err) => this.toastService.error('Failed to load deal chart')
    });
  }

  onChartLead() {
    this.leadService.GetListLead().subscribe({
      next: (data) => {
        this.leads = data;

        const currentYear = new Date().getFullYear();
        const labels = Array.from({ length: 12 }, (_, i) => `${i + 1}-${currentYear}`);

        const leadCount: Record<string, number> = {};
        this.leads.forEach(lead => {
          const d = new Date(lead.createdAt);
          const label = `${d.getMonth() + 1}-${d.getFullYear()}`;
          if (!leadCount[label]) leadCount[label] = 0;
          leadCount[label] += 1;
        });

        const dataByMonth = labels.map(lb => leadCount[lb] || 0);

        this.barChartData = {
          labels: labels,
          datasets: [{
            data: dataByMonth,
            label: "Leads Per Month",
            backgroundColor: "#3b82f6",
            borderColor: "#1d4ed8"
          }]
        };
      },
      error: (err) => this.toastService.error('Failed to load leads')
    });
  }

  onChartContact() {
    this.contactService.GetListContact().subscribe({
      next: (data) => {
        this.contacts = data;

        const typeCount: Record<string, number> = {};
        this.contacts.forEach(contact => {
          const type = contact.type || 'Unknown';
          if (!typeCount[type]) typeCount[type] = 0;
          typeCount[type] += 1;
        });

        this.pieChartLabels = Object.keys(typeCount);
        this.pieChartData = Object.values(typeCount);

        this.pieChart = {
          labels: this.pieChartLabels,
          datasets: [{
            data: this.pieChartData,
            backgroundColor: ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6']
          }]
        };
      },
      error: (err) => this.toastService.error('Failed to load contacts')
    });
  }

  openDetail(type: string) {
    this.popupType = type;
    this.popupTitle = type === 'deal' ? 'Detail of Deals' : 'Detail of Contacts';
    this.showModal = true;
  }

  closeDetail() {
    this.showModal = false;
  }
}

interface ListDealItem {
  idDeal: string;
  price: number;
  status: string;
  createdAt: string;
}