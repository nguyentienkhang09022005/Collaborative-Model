import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../../core/services/task.service';
import { StaffService } from '../../../../core/services/staff.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { TaskItem } from '../../../../core/models/task.model';
import { StaffItem } from '../../../../core/models/staff.model';
import {
  TASK_PRIORITY_LABELS,
  TASK_PRIORITY_COLORS,
  TASK_STATUS_LABELS,
  TASK_STATUS_COLORS
} from '../../../../core/models/task.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-detail.html',
})
export class TaskDetailComponent implements OnInit {
  task: TaskItem | null = null;
  staffList: StaffItem[] = [];
  isLoading = true;
  isEditing = false;

  // Confirm status change
  showConfirmStatusModal = false;
  pendingStatusValue = '';

  currentStaffId = '';
  isAdmin = false;

  taskForm: {
    title: string;
    description: string;
    dueDate: string;
    priority: string;
    status: string;
    idStaffAssigned: string;
    linkedEntityType: string;
    linkedEntityId: string;
  } = this.getEmptyForm();

  priorityLabels = TASK_PRIORITY_LABELS;
  priorityColors = TASK_PRIORITY_COLORS;
  statusLabels = TASK_STATUS_LABELS;
  statusColors = TASK_STATUS_COLORS;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private staffService: StaffService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const staff = this.authService.getCurrentStaff();
    this.currentStaffId = staff?.id || '';
    this.isAdmin = staff?.role === 'ADMIN';

    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      this.loadTask(taskId);
    }

    this.loadStaffList();
  }

  loadTask(idTask: string): void {
    this.isLoading = true;
    this.taskService.GetTaskById(idTask).subscribe({
      next: (res) => {
        this.task = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastService.error('Failed to load task');
        this.isLoading = false;
      }
    });
  }

  loadStaffList(): void {
    this.staffService.GetListStaff().subscribe({
      next: (res) => {
        this.staffList = res;
      },
      error: (err) => {
        console.log('Error loading staff list:', err);
      }
    });
  }

  getEmptyForm() {
    return {
      title: '',
      description: '',
      dueDate: '',
      priority: 'MEDIUM',
      status: 'PENDING',
      idStaffAssigned: '',
      linkedEntityType: '',
      linkedEntityId: ''
    };
  }

  onEdit(): void {
    if (!this.task) return;
    this.taskForm = {
      title: this.task.title,
      description: this.task.description || '',
      dueDate: this.task.dueDate ? this.task.dueDate.split('T')[0] : '',
      priority: this.task.priority,
      status: this.task.status,
      idStaffAssigned: this.task.idStaffAssigned || '',
      linkedEntityType: this.task.linkedEntityType || '',
      linkedEntityId: this.task.linkedEntityId || ''
    };
    this.isEditing = true;
  }

  onCancel(): void {
    this.isEditing = false;
    this.taskForm = this.getEmptyForm();
  }

  onUpdateTask(): void {
    if (!this.task) return;
    if (!this.taskForm.title.trim()) {
      this.toastService.warning('Title is required');
      return;
    }

    const request = {
      title: this.taskForm.title,
      description: this.taskForm.description || undefined,
      dueDate: this.taskForm.dueDate || undefined,
      priority: this.taskForm.priority,
      status: this.taskForm.status,
      idStaffAssigned: this.taskForm.idStaffAssigned || undefined,
      linkedEntityType: this.taskForm.linkedEntityType || undefined,
      linkedEntityId: this.taskForm.linkedEntityId || undefined
    };

    this.taskService.updateTask(this.task.idTask, request).subscribe({
      next: () => {
        this.toastService.success('Task updated successfully');
        this.isEditing = false;
        this.loadTask(this.task!.idTask);
      },
      error: (err) => {
        this.toastService.error(err.message || 'Failed to update task');
      }
    });
  }

  updateTaskStatus(status: string): void {
    if (!this.task) return;
    // Open confirmation modal instead of directly updating
    this.pendingStatusValue = status;
    this.showConfirmStatusModal = true;
  }

  confirmStatusChange(): void {
    if (!this.task) return;
    this.taskService.updateTaskStatus(this.task.idTask, this.pendingStatusValue).subscribe({
      next: () => {
        this.toastService.success('Task status updated');
        this.loadTask(this.task!.idTask);
        this.closeConfirmStatusModal();
      },
      error: (err) => {
        this.toastService.error(err.message || 'Failed to update task status');
        this.closeConfirmStatusModal();
      }
    });
  }

  closeConfirmStatusModal(): void {
    this.showConfirmStatusModal = false;
    this.pendingStatusValue = '';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'PENDING': 'Pending',
      'IN_PROGRESS': 'In Progress',
      'COMPLETED': 'Completed',
      'CANCELED': 'Cancelled'
    };
    return labels[status] || status;
  }

  onBack(): void {
    this.router.navigate(['/tasks']);
  }

  getPriorityClass(priority: string): string {
    return this.priorityColors[priority] || 'bg-slate-100 text-slate-600';
  }

  getStatusClass(status: string): string {
    return this.statusColors[status] || 'bg-slate-100 text-slate-600';
  }

  getStaffName(idStaff?: string): string {
    if (!idStaff) return 'Unassigned';
    const staff = this.staffList.find(s => s.id === idStaff);
    return staff?.person?.fullname || 'Unknown';
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  formatDateTime(dateStr?: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  canEdit(): boolean {
    return this.isAdmin || (this.task?.idStaffAssigned === this.currentStaffId);
  }
}