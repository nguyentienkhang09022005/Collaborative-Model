import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomerItem, CustomerRequest } from '../../../../core/models/customer.model';
import { CustomerService } from '../../../../core/services/customer.service';
import { ToastService } from '../../../../core/services/toast.service';
import { CustomDatePipe } from '../../../../shared/pipes/date-pipe';

@Component({
  selector: 'app-customer-page',
  imports: [CommonModule, RouterModule, FormsModule, CustomDatePipe],
  templateUrl: './customer-list.html',
  styleUrls: ['./customer-list.css'],
})
export class CustomerListComponent implements OnInit {
  customers: CustomerItem[] = [];
  customerForm: CustomerRequest = this.getEmptyForm();
  isLoading: boolean = false;
  showAddPopup: boolean = false;
  showUploadPopup: boolean = false;
  selectedFile?: File;

  constructor(
    private customerService: CustomerService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.isLoading = true;
    this.customerService.GetListCustomer().subscribe({
      next: (data) => {
        this.isLoading = false;
        this.customers = data;
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error('Failed to load customers');
      }
    });
  }

  onInfCustomer(idCustomer: string) {
    this.router.navigate(['/customer-detail'], { queryParams: { id: idCustomer } });
  }

  submitAddCustomer() {
    this.isLoading = true;
    this.customerService.createCustomer(this.customerForm).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastService.success('Customer created successfully');
        this.customerForm = this.getEmptyForm();
        this.closePopup();
        this.loadCustomers();
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(err.message || 'Failed to create customer');
      }
    });
  }

  deleteCustomer(idCustomer: string, event: MouseEvent) {
    event.stopPropagation();
    if (!confirm('Are you sure you want to delete this customer?')) return;

    this.customerService.DeleteCustomer(idCustomer).subscribe({
      next: () => {
        this.toastService.success('Customer deleted successfully');
        this.loadCustomers();
      },
      error: (err) => {
        this.toastService.error(err.message || 'Failed to delete customer');
      }
    });
  }

  uploadExcel() {
    if (!this.selectedFile) {
      this.toastService.error('Please select a file to upload');
      return;
    }

    this.isLoading = true;
    this.customerService.UploadExcelCustomer(this.selectedFile).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastService.success('Customers imported successfully');
        this.closeUploadPopup();
        this.loadCustomers();
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(err.message || 'Failed to import customers');
      }
    });
  }

  openAddPopup() {
    this.customerForm = this.getEmptyForm();
    this.showAddPopup = true;
  }

  closePopup() {
    this.showAddPopup = false;
  }

  openUploadPopup() {
    this.showUploadPopup = true;
  }

  closeUploadPopup() {
    this.showUploadPopup = false;
    this.selectedFile = undefined;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  private getEmptyForm(): CustomerRequest {
    return { fullname: '', email: '', phone: '', location: '' };
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.action-menu') && !target.closest('.action-btn')) {
      // Close menus if needed
    }
  }
}