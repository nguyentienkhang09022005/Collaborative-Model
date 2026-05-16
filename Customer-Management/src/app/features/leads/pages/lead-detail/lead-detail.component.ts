import { Component, OnInit, inject } from '@angular/core';
import { LeadService } from '../../../../core/services/lead.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadItem, LeadRequest } from '../../../../core/models/lead.models';
import { CustomDatePipe } from '../../../../shared/pipes/date-pipe';
import { ToastService } from '../../../../core/services/toast.service';
import { PreferenceService } from '../../../../core/services/preference.service';

@Component({
  selector: 'app-lead-detail',
  imports: [CommonModule, FormsModule, CustomDatePipe],
  templateUrl: './lead-detail.html',
  styleUrls: ['./lead-detail.css'],
})
export class LeadDetailComponet implements OnInit {
  leadForm: LeadRequest = this.getEmptyForm();
  leadData: LeadItem | null = null;
  isLoading: boolean = false;
  isEditing: boolean = false;
  idLead: string = "";

  private preferenceService = inject(PreferenceService);
  readonly themeConfig = this.preferenceService.themeConfig;

  constructor(
    private leadService: LeadService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(param => {
      this.idLead = param['id'];
      if (this.idLead) {
        this.loadLead(this.idLead);
      }
    });
  }

  loadLead(idLead: string) {
    this.isLoading = true;
    this.leadService.GetInfLead(idLead).subscribe({
      next: (data) => {
        this.isLoading = false;
        if (data) {
          this.leadData = data;
          this.leadForm = {
            fullname: data.person.fullname,
            email: data.person.email,
            phone: data.person.phone || '',
            location: data.person.location || '',
            resource: data.resource || ''
          };
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error('Failed to load lead');
      }
    });
  }

  onUpdateLead() {
    this.isLoading = true;
    this.leadService.UpdateLead(this.leadForm, this.idLead).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastService.success('Lead updated successfully');
        this.isEditing = false;
        this.loadLead(this.idLead);
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(err.message || 'Failed to update lead');
      }
    });
  }

  onEdit() {
    this.isEditing = true;
  }

  onCancel() {
    this.isEditing = false;
    if (this.leadData) {
      this.leadForm = {
        fullname: this.leadData.person.fullname,
        email: this.leadData.person.email,
        phone: this.leadData.person.phone || '',
        location: this.leadData.person.location || '',
        resource: this.leadData.resource || ''
      };
    }
  }

  onBack() {
    this.router.navigate(['/leads']);
  }

  private getEmptyForm(): LeadRequest {
    return { fullname: '', email: '', phone: '', location: '', resource: '' };
  }
}