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
import { TeamService } from '../../../../core/services/team.service';
import { AuthService } from '../../../../core/services/auth.service';
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
  currentStaff: any = null;

  // Map deal ID -> permission info (canDelete, canEdit, role)
  dealPermissions: Map<string, { canDelete: boolean; canEdit: boolean; role: string }> = new Map();

  private preferenceService = inject(PreferenceService);
  readonly themeConfig = this.preferenceService.themeConfig;

  // Expose constants to template
  dealStatusList = Object.values(DEAL_STATUS);

  constructor(
    private dealService: DealService,
    private staffService: StaffService,
    private customerService: CustomerService,
    private teamService: TeamService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentStaff = this.authService.getCurrentStaff();
    this.loadDeals();
  }

  loadDeals() {
    this.isLoading = true;

    // ADMIN dùng getDeals (toàn bộ system), STAFF dùng getMyDeals (chỉ deals của mình)
    const isAdmin = this.authService.getCurrentUserRole() === 'ADMIN';
    const dealObservable = isAdmin
      ? this.dealService.GetListDeal()
      : this.dealService.GetMyDeals();

    dealObservable.subscribe({
      next: (data) => {
        this.isLoading = false;
        this.deals = data;
        this.loadDealPermissions();
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error('Failed to load deals');
      }
    });
  }

  loadDealPermissions() {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    // Query team members for each deal to get current user's permissions
    const dealIds = this.deals.map(d => d.idDeal);
    let loadedCount = 0;

    dealIds.forEach(dealId => {
      this.teamService.GetTeamMembers('Deal', dealId).subscribe({
        next: (members) => {
          // Find current user's membership for this deal using JWT userId
          const myMembership = members.find(m => m.idStaff === userId);

          if (myMembership) {
            this.dealPermissions.set(dealId, {
              canDelete: myMembership.canDelete,
              canEdit: myMembership.canEdit,
              role: myMembership.role
            });
          } else if (this.deals.find(d => d.idDeal === dealId)?.staff?.id === userId) {
            // User is the creator - has full permissions
            this.dealPermissions.set(dealId, {
              canDelete: true,
              canEdit: true,
              role: 'OWNER'
            });
          } else {
            // User is not a member - no permissions
            this.dealPermissions.set(dealId, {
              canDelete: false,
              canEdit: false,
              role: ''
            });
          }

          loadedCount++;
          if (loadedCount === dealIds.length) {
            // All loaded, trigger change detection by reassigning
            this.dealPermissions = new Map(this.dealPermissions);
          }
        },
        error: () => {
          // On error, assume no permissions
          this.dealPermissions.set(dealId, {
            canDelete: false,
            canEdit: false,
            role: ''
          });
          loadedCount++;
        }
      });
    });
  }

  canDeleteDeal(dealId: string): boolean {
    return this.dealPermissions.get(dealId)?.canDelete ?? false;
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

  // ADMIN check - use JWT role claim directly for accuracy
  isAdmin(): boolean {
    return this.authService.getCurrentUserRole() === 'ADMIN';
  }

  // Also expose currentStaff id for use in templates
  get currentUserId(): string | null {
    return this.authService.getCurrentUserId();
  }

  openAddPopup() {
    this.dealForm = this.getEmptyForm();
    // STAFF: staff is automatically set to themselves, no dropdown
    this.selectedStaff = this.isAdmin() ? '' : this.currentStaff?.id || '';
    this.selectedCustomer = '';
    this.showAddPopup = true;
    this.loadCustomers();
    // STAFF doesn't need staff list - it's auto-assigned
    if (this.isAdmin()) {
      this.loadStaffs();
    }
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