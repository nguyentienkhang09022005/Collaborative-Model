import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeadService } from '../../../../core/services/lead.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-lead-mark',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lead-mark.html',
  styleUrls: ['./lead-mark.css'],
})
export class LeadMarkComponent implements OnInit {
  leadForm!: FormGroup;
  isLoading = false;
  isSubmitted = false;

  backgroundImage = 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&auto=format&fit=crop';
  backgroundFallback = 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)';

  resources = [
    { value: '', label: '-- Chọn nguồn --' },
    { value: 'Facebook', label: 'Facebook' },
    { value: 'Google', label: 'Google' },
    { value: 'Website', label: 'Website' },
    { value: 'Bạn bè giới thiệu', label: 'Bạn bè giới thiệu' },
    { value: 'Tờ rơi', label: 'Tờ rơi' },
    { value: 'Khác', label: 'Khác' },
  ];

  constructor(
    private fb: FormBuilder,
    private leadService: LeadService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.leadForm = this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      phone: ['', [Validators.pattern(/^[0-9+\-\s()]{8,20}$/)]],
      location: ['', [Validators.maxLength(150)]],
      resource: [''],
    });
  }

  get f() {
    return this.leadForm.controls;
  }

  hasError(field: string, error: string): boolean {
    const ctrl = this.leadForm.get(field);
    if (!ctrl) return false;
    return ctrl.hasError(error) && (ctrl.touched || this.isSubmitted);
  }

  isInvalid(field: string): boolean {
    const ctrl = this.leadForm.get(field);
    if (!ctrl) return false;
    return ctrl.invalid && (ctrl.touched || this.isSubmitted);
  }

  submitAddLead(): void {
    this.isSubmitted = true;

    if (this.leadForm.invalid) {
      this.leadForm.markAllAsTouched();
      this.toastService.error('Vui lòng kiểm tra lại các trường được đánh dấu đỏ.');
      return;
    }

    this.isLoading = true;
    const payload = this.buildPayload();

    this.leadService.createLead(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.leadForm.reset();
        this.isSubmitted = false;
        this.toastService.success('Đăng ký tư vấn thành công! Chúng tôi sẽ liên hệ bạn sớm.');
      },
      error: (err: Error) => {
        this.isLoading = false;
        console.error('[lead-mark] createLead failed:', err);
        this.toastService.error(err?.message || 'Đăng ký thất bại. Vui lòng thử lại sau.');
      },
    });
  }

  private buildPayload() {
    const v = this.leadForm.value;
    return {
      fullname: v.fullname?.trim(),
      email: v.email?.trim().toLowerCase(),
      phone: v.phone?.trim() || undefined,
      location: v.location?.trim() || undefined,
      resource: v.resource || undefined,
    };
  }

  onBackgroundError(event: Event): void {
    const el = event.target as HTMLDivElement;
    if (el) el.style.backgroundImage = this.backgroundFallback;
  }
}