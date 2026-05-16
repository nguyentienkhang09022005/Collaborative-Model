import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DealItem, DealRequest } from '../../../../core/models/deal.model';
import { CustomerItem } from '../../../../core/models/customer.model';
import { StaffItem } from '../../../../core/models/staff.model';
import { DealService } from '../../../../core/services/deal.service';
import { StaffService } from '../../../../core/services/staff.service';
import { CustomerService } from '../../../../core/services/customer.service';
import { CustomDatePipe } from '../../../../shared/pipes/date-pipe';
import { ToastService } from '../../../../core/services/toast.service';
import { PreferenceService } from '../../../../core/services/preference.service';
import {
  DEAL_STATUS,
  DEAL_STATUS_LABELS,
  DEAL_STATUS_COLORS
} from '../../../../core/constants/enums';

@Component({
  selector: 'app-deal-page',
  imports: [CommonModule, RouterModule, FormsModule, CustomDatePipe],
  templateUrl: './deal-list.html',
  styleUrls: ['./deal-list.css'],
})
export class DealListComponent implements OnInit {
  deals: DealItem[] = [];
  dealForm: DealRequest = this.getEmptyForm();
  isLoading: boolean = false;
  showAddPopup: boolean = false;
  selectedStaff: string = '';
  selectedCustomer: string = '';
  customers: CustomerItem[] = [];
  staffs: StaffItem[] = [];

  private preferenceService = inject(PreferenceService);
  readonly themeConfig = this.preferenceService.themeConfig;

  // Expose constants to template
  dealStatusList = Object.values(DEAL_STATUS);

  constructor(
    private dealService: DealService,
    private staffService: StaffService,
    private customerService: CustomerService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDeals();
  }

  loadDeals() {
    this.isLoading = true;
    this.dealService.GetListDeal().subscribe({
      next: (data) => {
        this.isLoading = false;
        this.deals = data;
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error('Failed to load deals');
      }
    });
  }

  onInfDeal(idDeal: string) {
    this.router.navigate(['/deal-detail'], { queryParams: { id: idDeal } });
  }

  submitAddDeal() {
    if (!this.selectedStaff || !this.selectedCustomer) {
      this.toastService.error('Please select staff and customer');
      return;
    }

    this.isLoading = true;
    this.dealService.createDeal(this.dealForm, this.selectedStaff, this.selectedCustomer).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastService.success('Deal created successfully');
        this.dealForm = this.getEmptyForm();
        this.closePopup();
        this.loadDeals();
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(err.message || 'Failed to create deal');
      }
    });
  }

  deleteDeal(idDeal: string, event: MouseEvent) {
    event.stopPropagation();
    if (!confirm('Are you sure you want to delete this deal?')) return;

    this.dealService.DeleteDeal(idDeal).subscribe({
      next: () => {
        this.toastService.success('Deal deleted successfully');
        this.loadDeals();
      },
      error: (err) => {
        this.toastService.error(err.message || 'Failed to delete deal');
      }
    });
  }

  loadCustomers() {
    this.customerService.GetListCustomer().subscribe({
      next: (data) => {
        this.customers = data;
      },
      error: () => {
        this.toastService.error('Failed to load customers');
      }
    });
  }

  loadStaffs() {
    this.staffService.GetListStaff().subscribe({
      next: (data) => {
        this.staffs = data;
      },
      error: () => {
        this.toastService.error('Failed to load staff');
      }
    });
  }

  openAddPopup() {
    this.dealForm = this.getEmptyForm();
    this.selectedStaff = '';
    this.selectedCustomer = '';
    this.showAddPopup = true;
    this.loadCustomers();
    this.loadStaffs();
  }

  closePopup() {
    this.showAddPopup = false;
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
    if (price == null) return '-';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }

  countByStatus(status: string): number {
    return this.deals.filter(d => d.status === status).length;
  }

  private getEmptyForm(): DealRequest {
    return { title: '', content: '', price: 0, idStaff: '', idCustomer: '' };
  }
}