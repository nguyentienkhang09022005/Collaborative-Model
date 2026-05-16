import { Component } from '@angular/core';
import { CustomDatePipe } from '../../../../shared/pipes/date-pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DealItem } from '../../../../core/models/deal.model';
import { DealService } from '../../../../core/services/deal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';
import {
  DEAL_STATUS,
  DEAL_STATUS_LABELS,
  DEAL_STATUS_COLORS
} from '../../../../core/constants/enums';

@Component({
  selector: 'app-deal-detail',
  imports: [CommonModule, FormsModule, CustomDatePipe],
  templateUrl: './deal-detail.html',
  styleUrls: ['./deal-detail.css'],
})
export class DealDetailComponent {
  dealForm: DealItem | null = null;
  isLoading: boolean = false;
  isEditing: boolean = false;
  idDeal: string = "";

  // Expose constants to template
  dealStatusList = Object.values(DEAL_STATUS);

  constructor(
    private dealService: DealService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(){
    this.route.queryParams.subscribe(param => {
      this.idDeal = param['id']
      if (this.idDeal){
        this.onInfDeal(this.idDeal)
      }
    })
  }

  onInfDeal(idDeal: string){
    this.isLoading = true;
    this.dealService.GetInfDeal(idDeal).subscribe({
      next: (data) => {
        this.isLoading = false;
        if (data) {
          this.dealForm = data;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error('Failed to load deal');
      }
    })
  }

  onUpdateDeal(status: string){
    this.isLoading = true;
    this.dealService.UpdateDeal(status, this.idDeal).subscribe({
      next: (data) => {
        this.isLoading = false;
        this.toastService.success('Deal updated successfully');
        this.isEditing = false;
        this.onInfDeal(this.idDeal);
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(err.message || 'Failed to update deal');
      }
    })
  }

  onEdit() {
    this.isEditing = true;
  }

  onBack() {
    this.router.navigate(['/deals']);
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return 'bg-slate-500';
    return DEAL_STATUS_COLORS[status] || 'bg-slate-500';
  }

  getStatusLabel(status: string | undefined): string {
    if (!status) return 'Unknown';
    return DEAL_STATUS_LABELS[status] || status;
  }

  formatPrice(price: number | undefined): string {
    if (!price) return '0';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  }
}
