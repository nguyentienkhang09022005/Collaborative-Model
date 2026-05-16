import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StaffService } from '../../../../core/services/staff.service';
import { RouterModule } from '@angular/router';
import { StaffItem } from '../../../../core/models/staff.model';
import { CustomDatePipe } from '../../../../shared/pipes/date-pipe';
import { ToastService } from '../../../../core/services/toast.service';
import {
  STAFF_ROLE,
  STAFF_ROLE_LABELS,
  STAFF_ROLE_COLORS
} from '../../../../core/constants/enums';

@Component({
  selector: 'app-staff-list',
  imports: [CommonModule, FormsModule, RouterModule, CustomDatePipe],
  templateUrl: './staff-list.html',
  styleUrl: './staff-list.css',
})
export class StaffListComponent implements OnInit {
  staffs: StaffItem[] = [];
  isLoading: boolean = false;

  // Expose constants to template
  staffRoleList = Object.values(STAFF_ROLE);

  constructor(
    private staffService: StaffService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadStaffs();
  }

  loadStaffs() {
    this.isLoading = true;
    this.staffService.GetListStaff().subscribe({
      next: (data) => {
        this.isLoading = false;
        this.staffs = data;
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error('Failed to load staff');
      }
    });
  }

  getRoleBadgeClass(role: string | undefined): string {
    if (!role) return 'bg-slate-100 text-slate-700';
    return STAFF_ROLE_COLORS[role] || 'bg-slate-100 text-slate-700';
  }

  getRoleLabel(role: string | undefined): string {
    if (!role) return 'Unknown';
    return STAFF_ROLE_LABELS[role] || role;
  }

  countByRole(role: string): number {
    return this.staffs.filter(s => s.role === role).length;
  }
}