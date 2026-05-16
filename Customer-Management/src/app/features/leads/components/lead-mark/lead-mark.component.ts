import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeadService } from '../../../../core/services/lead.service';
import { LeadItem, LeadRequest } from '../../../../core/models/lead.models';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-lead-mark',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lead-mark.html',
  styleUrls: ['./lead-mark.css'],
})
export class LeadMarkComponent {

  isLoading: boolean = false;
  leads: LeadItem[] = [];
  leadForm: LeadRequest = {} as LeadRequest;
  showAddPopup: boolean = false;

  constructor(
    private leadService: LeadService,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  submitAddLead() {
    this.isLoading = true;

    this.leadService.createLead(this.leadForm).subscribe({
      next: (data) => {
        this.isLoading = false;
        this.leadForm = {} as LeadRequest;
        this.toastService.success('Đăng ký tư vấn thành công!');
        this.closePopup();
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error('Failed to register');
      }
    });
  }

  openAddPopup() {
    this.showAddPopup = true;
  }

  closePopup() {
    this.showAddPopup = false;
  }
}