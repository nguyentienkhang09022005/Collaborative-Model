import { Component } from '@angular/core';
import { ChartDealItem, StatisticsItem } from '../../core/models/dashboard.model';
import { DashboardService } from '../../core/services/dashboard.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartDataset, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-dash-board',
  imports: [CommonModule, RouterModule, FormsModule, BaseChartDirective],
  templateUrl: './dash-board.html',
  styleUrls: ['./dash-board.css'],
})
export class DashboardComponent {

  statisticsItems: StatisticsItem = {} as StatisticsItem;
  chartDealItems: ChartDealItem = {} as ChartDealItem;

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };  

  public lineChartLabels: string[] = [];
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      y: { 
        beginAtZero: true,
        title: { display: true, text: 'Price ($)' } 
      },
      x: { 
        beginAtZero: true,
      },
    },
  };
  
  constructor(private dashboardService: DashboardService ){}

  ngOnInit(){
    this.onQuantityStatistics();
    this.onChartDeal();
  }

  onQuantityStatistics(){
    this.dashboardService.GetStatistics().subscribe({
      next: (res) => {
        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          return;
        }
        
        this.statisticsItems = res.data?.statistics;

        console.log(res);
      },
      error: (err) => {
        console.log("Lỗi: ", err);
      }
    })
  }

  onChartDeal(){
    this.dashboardService.GetChartDeal().subscribe({
      next: (res) => {
        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          return;
        }
        
        this.chartDealItems = res.data?.chartDeal;

        const successDeals = this.chartDealItems.listSuccessfullDeal || [];
        const failedDeals = this.chartDealItems.listFailedDeal || [];
        const allLabelsSet = new Set([
            ...successDeals.map(d => d.createdAt), 
            ...failedDeals.map(d => d.createdAt)
        ]);
        const sortedLabels = Array.from(allLabelsSet).sort();

        const successData = sortedLabels.map(label => {
            const deal = successDeals.find(d => d.createdAt === label);
            return deal ? deal.price : null;
        });

        const failedData = sortedLabels.map(label => {
            const deal = failedDeals.find(d => d.createdAt === label);
            return deal ? deal.price : null;
        });

        const finalLabels = ['Start', ...sortedLabels]; 
        
        // Thêm giá trị 0 vào đầu mảng dữ liệu
        const finalSuccessData = [0, ...successData];
        const finalFailedData = [0, ...failedData];
        
        this.lineChartData = {
          labels: finalLabels,
          datasets: [
            {
              data: finalSuccessData as number[],
              label: 'Won (Success)',
              borderColor: '#22c55e',
              backgroundColor: 'rgba(34, 197, 94, 0.2)',
              pointBackgroundColor: '#22c55e',
              pointBorderColor: '#fff',
              fill: true,
              tension: 0.4,
              spanGaps: true
            },
            {
              data: finalFailedData as number[],
              label: 'Lost (Failed)',
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              pointBackgroundColor: '#ef4444',
              pointBorderColor: '#fff',
              fill: true,
              tension: 0.4,
              spanGaps: true
            }
          ]
        };
        console.log(res);
      },
      error: (err) => {
        console.log("Lỗi: ", err);
      }
    })
  }
}
