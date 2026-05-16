import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomDatePipe } from '../../../../shared/pipes/date-pipe';
import { CustomerItem, CustomerRequest } from '../../../../core/models/customer.model';
import { CustomerService } from '../../../../core/services/customer.service';
import { ToastService } from '../../../../core/services/toast.service';
import { PreferenceService } from '../../../../core/services/preference.service';

@Component({
  selector: 'app-customer-detail',
  imports: [CommonModule, FormsModule, CustomDatePipe],
  templateUrl: './customer-detail.html',
  styleUrls: ['./customer-detail.css'],
})
export class CustomerDetailComponet implements OnInit {
  customerForm: CustomerRequest = this.getEmptyForm();
  customerData: CustomerItem | null = null;
  isLoading: boolean = false;
  isEditing: boolean = false;
  idCustomer: string = "";

  private preferenceService = inject(PreferenceService);
  readonly themeConfig = this.preferenceService.themeConfig;

  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(param => {
      this.idCustomer = param['id'];
      if (this.idCustomer) {
        this.loadCustomer(this.idCustomer);
      }
    });
  }

  loadCustomer(idCustomer: string) {
    this.isLoading = true;
    this.customerService.GetInfCustomer(idCustomer).subscribe({
      next: (data) => {
        this.isLoading = false;
        if (data) {
          this.customerData = data;
          this.customerForm = {
            fullname: data.person.fullname,
            email: data.person.email,
            phone: data.person.phone || '',
            location: data.person.location || ''
          };
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error('Failed to load customer');
      }
    });
  }

  onUpdateCustomer() {
    this.isLoading = true;
    this.customerService.UpdateCustomer(this.customerForm, this.idCustomer).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastService.success('Customer updated successfully');
        this.isEditing = false;
        this.loadCustomer(this.idCustomer);
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(err.message || 'Failed to update customer');
      }
    });
  }

  onEdit() {
    this.isEditing = true;
  }

  onCancel() {
    this.isEditing = false;
    if (this.customerData) {
      this.customerForm = {
        fullname: this.customerData.person.fullname,
        email: this.customerData.person.email,
        phone: this.customerData.person.phone || '',
        location: this.customerData.person.location || ''
      };
    }
  }

  onBack() {
    this.router.navigate(['/customers']);
  }

  private getEmptyForm(): CustomerRequest {
    return { fullname: '', email: '', phone: '', location: '' };
  }
}