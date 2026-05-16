import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../../../core/services/task.service';
import { StaffService } from '../../../../core/services/staff.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { PreferenceService } from '../../../../core/services/preference.service';
import { TaskItem } from '../../../../core/models/task.model';
import { StaffItem } from '../../../../core/models/staff.model';
import {
  TASK_PRIORITY_LABELS,
  TASK_PRIORITY_COLORS,
  TASK_STATUS_LABELS,
  TASK_STATUS_COLORS,
  TASK_LINKED_ENTITY_LABELS
} from '../../../../core/models/task.model';
import {
  TASK_PRIORITY,
  TASK_STATUS,
  TASK_LINKED_ENTITY
} from '../../../../core/constants/enums';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.html',
})
export class TaskListComponent implements OnInit {
  tasks: TaskItem[] = [];
  staffList: StaffItem[] = [];
  isLoading = true;

  private preferenceService = inject(PreferenceService);
  readonly themeConfig = this.preferenceService.themeConfig;

  showCreateModal = false;
  showEditModal = false;
  isEditing = false;
  editingTaskId = '';

  // Confirm status change
  showConfirmStatusModal = false;
  pendingStatusTaskId = '';
  pendingStatusValue = '';

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

  searchQuery = '';
  filterStatus = -1; // -1 = all
  filterPriority = -1; // -1 = all

  currentStaffId = '';
  isAdmin = false;

  taskPriorities = TASK_PRIORITY;
  taskStatuses = TASK_STATUS;
  linkedEntities = TASK_LINKED_ENTITY;
  priorityLabels = TASK_PRIORITY_LABELS;
  priorityColors = TASK_PRIORITY_COLORS;
  statusLabels = TASK_STATUS_LABELS;
  statusColors = TASK_STATUS_COLORS;
  linkedEntityLabels = TASK_LINKED_ENTITY_LABELS;

  constructor(
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

    this.loadTasks();
    this.loadStaffList();
  }

  loadTasks(): void {
    this.isLoading = true;
    if (this.isAdmin) {
      this.taskService.GetTasks().subscribe({
        next: (res) => {
          this.tasks = res;
          this.isLoading = false;
        },
        error: (err) => {
          this.toastService.error('Failed to load tasks');
          this.isLoading = false;
        }
      });
    } else {
      this.taskService.GetTasksByStaff(this.currentStaffId).subscribe({
        next: (res) => {
          this.tasks = res;
          this.isLoading = false;
        },
        error: (err) => {
          this.toastService.error('Failed to load tasks');
          this.isLoading = false;
        }
      });
    }
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

  openCreateModal(): void {
    this.taskForm = this.getEmptyForm();
    this.showCreateModal = true;
    this.isEditing = false;
  }

  openEditModal(task: TaskItem): void {
    this.editingTaskId = task.idTask;
    this.taskForm = {
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      priority: task.priority,
      status: task.status,
      idStaffAssigned: task.idStaffAssigned || '',
      linkedEntityType: task.linkedEntityType || '',
      linkedEntityId: task.linkedEntityId || ''
    };
    this.showEditModal = true;
    this.isEditing = true;
  }

  closeModals(): void {
    this.showCreateModal = false;
    this.showEditModal = false;
    this.taskForm = this.getEmptyForm();
  }

  createTask(): void {
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

    this.taskService.createTask(request).subscribe({
      next: () => {
        this.toastService.success('Task created successfully');
        this.closeModals();
        this.loadTasks();
      },
      error: (err) => {
        this.toastService.error(err.message || 'Failed to create task');
      }
    });
  }

  updateTask(): void {
    if (!this.taskForm.title.trim()) {
      this.toastService.warning('Title is required');
      return;
    }
    if (!this.editingTaskId) return;

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

    this.taskService.updateTask(this.editingTaskId, request).subscribe({
      next: () => {
        this.toastService.success('Task updated successfully');
        this.closeModals();
        this.loadTasks();
      },
      error: (err) => {
        this.toastService.error(err.message || 'Failed to update task');
      }
    });
  }

  updateTaskStatus(idTask: string, status: string): void {
    // Open confirmation modal instead of directly updating
    this.pendingStatusTaskId = idTask;
    this.pendingStatusValue = status;
    this.showConfirmStatusModal = true;
  }

  confirmStatusChange(): void {
    if (!this.pendingStatusTaskId) return;

    this.taskService.updateTaskStatus(this.pendingStatusTaskId, this.pendingStatusValue).subscribe({
      next: () => {
        this.toastService.success('Task status updated');
        this.loadTasks();
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
    this.pendingStatusTaskId = '';
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

  deleteTask(idTask: string): void {
    this.taskService.deleteTask(idTask).subscribe({
      next: () => {
        this.toastService.success('Task deleted successfully');
        this.loadTasks();
      },
      error: (err) => {
        this.toastService.error(err.message || 'Failed to delete task');
      }
    });
  }

  restoreTask(idTask: string): void {
    this.taskService.restoreTask(idTask).subscribe({
      next: () => {
        this.toastService.success('Task restored successfully');
        this.loadTasks();
      },
      error: (err) => {
        this.toastService.error(err.message || 'Failed to restore task');
      }
    });
  }

  viewTaskDetail(task: TaskItem): void {
    this.router.navigate(['/tasks', task.idTask]);
  }

  getFilteredTasks(): TaskItem[] {
    return this.tasks.filter(task => {
      if (this.searchQuery && !task.title.toLowerCase().includes(this.searchQuery.toLowerCase())) {
        return false;
      }
      if (this.filterStatus !== -1 && task.status !== Object.keys(TASK_STATUS)[this.filterStatus]) {
        return false;
      }
      if (this.filterPriority !== -1 && task.priority !== Object.keys(TASK_PRIORITY)[this.filterPriority]) {
        return false;
      }
      return true;
    });
  }

  getPriorityClass(priority: string): string {
    return this.priorityColors[priority] || 'bg-slate-100 text-slate-600';
  }

  getStatusClass(status: string): string {
    if (this.themeConfig().id === 'dark') {
      const darkColors: Record<string, string> = {
        'PENDING': 'bg-slate-700 text-slate-200',
        'IN_PROGRESS': 'bg-blue-900 text-blue-200',
        'COMPLETED': 'bg-green-900 text-green-200',
        'CANCELED': 'bg-red-900 text-red-200'
      };
      return darkColors[status] || 'bg-slate-700 text-slate-200';
    }
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
    return date.toLocaleDateString('vi-VN');
  }

  isTaskCreator(task: TaskItem): boolean {
    return task.idStaffAssigned === this.currentStaffId;
  }

  canEditTask(task: TaskItem): boolean {
    return this.isAdmin || task.idStaffAssigned === this.currentStaffId;
  }
}