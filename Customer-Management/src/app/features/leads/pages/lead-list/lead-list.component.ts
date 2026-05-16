import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { LeadService } from '../../../../core/services/lead.service';
import { LeadItem, LeadRequest } from '../../../../core/models/lead.models';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../core/services/toast.service';
import { CustomDatePipe } from '../../../../shared/pipes/date-pipe';
import { PreferenceService } from '../../../../core/services/preference.service';

@Component({
  selector: 'app-lead-page',
  imports: [CommonModule, RouterModule, FormsModule, CustomDatePipe],
  templateUrl: './lead-list.html',
  styleUrls: ['./lead-list.css'],
})
export class LeadListComponent implements OnInit {
  leads: LeadItem[] = [];
  leadForm: LeadRequest = this.getEmptyForm();
  isLoading: boolean = false;
  showAddPopup: boolean = false;
  showUploadPopup: boolean = false;
  selectedFile?: File;

  private preferenceService = inject(PreferenceService);
  readonly themeConfig = this.preferenceService.themeConfig;

  constructor(
    private leadService: LeadService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadLeads();
  }

  loadLeads() {
    this.isLoading = true;
    this.leadService.GetListLead().subscribe({
      next: (data) => {
        this.isLoading = false;
        this.leads = data;
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error('Failed to load leads');
      }
    });
  }

  onInfLead(idLead: string) {
    this.router.navigate(['/lead-detail'], { queryParams: { id: idLead } });
  }

  submitAddLead() {
    this.isLoading = true;
    this.leadService.createLead(this.leadForm).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastService.success('Lead created successfully');
        this.leadForm = this.getEmptyForm();
        this.closePopup();
        this.loadLeads();
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(err.message || 'Failed to create lead');
      }
    });
  }

  deleteLead(idLead: string, event: MouseEvent) {
    event.stopPropagation();
    if (!confirm('Are you sure you want to delete this lead?')) return;

    this.leadService.DeleteLead(idLead).subscribe({
      next: () => {
        this.toastService.success('Lead deleted successfully');
        this.loadLeads();
      },
      error: (err) => {
        this.toastService.error(err.message || 'Failed to delete lead');
      }
    });
  }

  uploadExcel() {
    if (!this.selectedFile) {
      this.toastService.error('Please select a file to upload');
      return;
    }

    this.isLoading = true;
    this.leadService.UploadExcelLead(this.selectedFile).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastService.success('Leads imported successfully');
        this.closeUploadPopup();
        this.loadLeads();
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(err.message || 'Failed to import leads');
      }
    });
  }

  openAddPopup() {
    this.leadForm = this.getEmptyForm();
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

  private getEmptyForm(): LeadRequest {
    return { fullname: '', email: '', phone: '', location: '', resource: '' };
  }
}