import { Component, inject } from '@angular/core';
import { ContactItem } from '../../../../core/models/contact.model';
import { ContactService } from '../../../../core/services/contact.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomDatePipe } from '../../../../shared/pipes/date-pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../core/services/toast.service';
import { PreferenceService } from '../../../../core/services/preference.service';
import {
  CONTACT_STATUS,
  CONTACT_STATUS_LABELS,
  CONTACT_STATUS_COLORS
} from '../../../../core/constants/enums';

@Component({
  selector: 'app-contact-detail',
  imports: [CommonModule, FormsModule, CustomDatePipe],
  templateUrl: './contact-detail.html',
  styleUrls: ['./contact-detail.css'],
})
export class ContactDetailComponent {
  contactForm: ContactItem | null = null;
  isLoading: boolean = false;
  isEditing: boolean = false;
  idContact: string = "";

  // Expose constants to template
  contactStatusList = Object.values(CONTACT_STATUS);

  private preferenceService = inject(PreferenceService);
  readonly themeConfig = this.preferenceService.themeConfig;

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(){
    this.route.queryParams.subscribe(param => {
      this.idContact = param['id']
      if (this.idContact){
        this.onInfContact(this.idContact)
      }
    })
  }

  onInfContact(idContact: string){
    this.isLoading = true;
    this.contactService.GetInfContact(idContact).subscribe({
      next: (data) => {
        this.isLoading = false;
        if (data) {
          this.contactForm = data;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error('Failed to load contact');
      }
    })
  }

  onUpdateContact(status: string){
    this.isLoading = true;
    this.contactService.UpdateContact(status, this.idContact).subscribe({
      next: (data) => {
        this.isLoading = false;
        this.toastService.success('Contact updated successfully');
        this.isEditing = false;
        this.onInfContact(this.idContact);
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(err.message || 'Failed to update contact');
      }
    })
  }

  onEdit() {
    this.isEditing = true;
  }

  onBack() {
    this.router.navigate(['/contacts']);
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return 'bg-slate-500';
    return CONTACT_STATUS_COLORS[status] || 'bg-slate-500';
  }

  getStatusLabel(status: string | undefined): string {
    if (!status) return 'Unknown';
    return CONTACT_STATUS_LABELS[status] || status;
  }
}