import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ContactService } from '../../../../core/services/contact.service';
import { ContactItem, ContactRequest } from '../../../../core/models/contact.model';
import { CustomDatePipe } from '../../../../shared/pipes/date-pipe';
import { LeadItem } from '../../../../core/models/lead.models';
import { StaffItem } from '../../../../core/models/staff.model';
import { StaffService } from '../../../../core/services/staff.service';
import { LeadService } from '../../../../core/services/lead.service';
import { FormsModule } from '@angular/forms';
import { PaginatorComponent, PaginatorChange } from '../../../../shared/components/paginator/paginator.component';
import { ToastService } from '../../../../core/services/toast.service';
import { PreferenceService } from '../../../../core/services/preference.service';
import {
  CONTACT_STATUS,
  CONTACT_STATUS_LABELS,
  CONTACT_STATUS_COLORS
} from '../../../../core/constants/enums';

@Component({
  selector: 'app-contact-page',
  imports: [CommonModule, RouterModule, CustomDatePipe, FormsModule, PaginatorComponent],
  templateUrl: './contact-list.html',
  styleUrls: ['./contact-list.css'],
})
export class ContactListComponent implements OnInit {
  contacts: ContactItem[] = [];
  contactForm: ContactRequest = this.getEmptyForm();
  isLoading: boolean = false;
  showAddPopup: boolean = false;
  selectedStaff: string = '';
  selectedLead: string = '';
  leads: LeadItem[] = [];
  staffs: StaffItem[] = [];

  pageIndex = 0;
  pageSize = 10;
  totalCount = 0;

  private preferenceService = inject(PreferenceService);
  readonly themeConfig = this.preferenceService.themeConfig;

  // Expose constants to template
  contactStatusList = Object.values(CONTACT_STATUS);

  constructor(
    private contactService: ContactService,
    private staffService: StaffService,
    private leadService: LeadService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    this.isLoading = true;
    this.contactService.GetListContactPaged(this.pageIndex + 1, this.pageSize).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.contacts = res.items;
        this.totalCount = res.totalCount;
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error('Failed to load contacts');
      }
    });
  }

  onPageChange(e: PaginatorChange): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.loadContacts();
  }

  onInfContact(idContact: string) {
    this.router.navigate(['/app/contact-detail'], { queryParams: { id: idContact } });
  }

  submitAddContact() {
    if (!this.selectedStaff || !this.selectedLead) {
      this.toastService.error('Please select staff and lead');
      return;
    }

    this.isLoading = true;
    this.contactService.createContact(this.contactForm, this.selectedStaff, this.selectedLead).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastService.success('Contact created successfully');
        this.contactForm = this.getEmptyForm();
        this.closePopup();
        this.loadContacts();
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(err.message || 'Failed to create contact');
      }
    });
  }

  deleteContact(idContact: string, event: MouseEvent) {
    event.stopPropagation();
    if (!confirm('Are you sure you want to delete this contact?')) return;

    this.contactService.DeleteContact(idContact).subscribe({
      next: () => {
        this.toastService.success('Contact deleted successfully');
        this.loadContacts();
      },
      error: (err) => {
        this.toastService.error(err.message || 'Failed to delete contact');
      }
    });
  }

  loadLeads() {
    this.leadService.GetListLead().subscribe({
      next: (data) => {
        this.leads = data;
      },
      error: (err) => {
        this.toastService.error('Failed to load leads');
      }
    });
  }

  loadStaffs() {
    this.staffService.GetListStaff().subscribe({
      next: (data) => {
        this.staffs = data;
      },
      error: (err) => {
        this.toastService.error('Failed to load staff');
      }
    });
  }

  openAddPopup() {
    this.contactForm = this.getEmptyForm();
    this.selectedStaff = '';
    this.selectedLead = '';
    this.showAddPopup = true;
    this.loadLeads();
    this.loadStaffs();
  }

  closePopup() {
    this.showAddPopup = false;
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return 'bg-slate-500';
    return CONTACT_STATUS_COLORS[status] || 'bg-slate-500';
  }

  getStatusLabel(status: string | undefined): string {
    if (!status) return 'Unknown';
    return CONTACT_STATUS_LABELS[status] || status;
  }

  private getEmptyForm(): ContactRequest {
    return { title: '', type: 'Call', content: '', idStaff: '', idLead: '' };
  }
}