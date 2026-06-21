import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { PaginatorComponent, PaginatorChange } from '../../../../shared/components/paginator/paginator.component';
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
  TASK_PRIORITY_BORDER_COLORS,
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
  imports: [CommonModule, FormsModule, DragDropModule, PaginatorComponent],
  templateUrl: './task-list.html',
})
export class TaskListComponent implements OnInit {
  tasks: TaskItem[] = [];
  staffList: StaffItem[] = [];
  isLoading = true;

  pageIndex = 0;
  pageSize = 10;
  totalCount = 0;

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
  priorityBorderColors = TASK_PRIORITY_BORDER_COLORS;
  statusLabels = TASK_STATUS_LABELS;
  statusColors = TASK_STATUS_COLORS;
  linkedEntityLabels = TASK_LINKED_ENTITY_LABELS;

  // Kanban columns for STAFF
  pendingTasks: TaskItem[] = [];
  inProgressTasks: TaskItem[] = [];
  completedTasks: TaskItem[] = [];
  canceledTasks: TaskItem[] = [];

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
      this.taskService.GetTasksPaged(this.pageIndex + 1, this.pageSize).subscribe({
        next: (res) => {
          this.tasks = res.items;
          this.totalCount = res.totalCount;
          this.groupTasksByStatus();
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
          this.groupTasksByStatus();
          this.isLoading = false;
        },
        error: (err) => {
          this.toastService.error('Failed to load tasks');
          this.isLoading = false;
        }
      });
    }
  }

  onPageChange(e: PaginatorChange): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.loadTasks();
  }

  groupTasksByStatus(): void {
    const sortByDueDate = (tasks: TaskItem[]) =>
      tasks.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });

    this.pendingTasks = sortByDueDate(this.tasks.filter(t => t.status === 'PENDING'));
    this.inProgressTasks = sortByDueDate(this.tasks.filter(t => t.status === 'IN_PROGRESS'));
    this.completedTasks = sortByDueDate(this.tasks.filter(t => t.status === 'COMPLETED'));
    this.canceledTasks = sortByDueDate(this.tasks.filter(t => t.status === 'CANCELED' || t.status === 'CANCELLED'));
  }

  onTaskDrop(event: CdkDragDrop<TaskItem[]>, newStatus: string): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

      // Direct API update without confirmation
      this.taskService.updateTaskStatus(task.idTask, newStatus).subscribe({
        next: (updatedTask) => {
          this.toastService.success('Task status updated');
          // Update only status field locally, keep all other task data intact
          const index = this.tasks.findIndex(t => t.idTask === task.idTask);
          if (index !== -1) {
            this.tasks[index] = { ...this.tasks[index], status: updatedTask.status };
            this.groupTasksByStatus();
          }
        },
        error: (err) => {
          this.toastService.error(err.message || 'Failed to update task status');
          // Reload to revert UI on error
          this.loadTasks();
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
    this.router.navigate(['/app/tasks', task.idTask]);
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

  getPriorityBorderClass(priority: string): string {
    return this.priorityBorderColors[priority] || 'border-l-slate-500';
  }

  getPriorityIcon(priority: string): string {
    const icons: Record<string, string> = {
      'LOW': 'M5 13l4 4L19 7',
      'MEDIUM': 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      'HIGH': 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      'URGENT': 'M17 8l4 4m0 0l-4 4m4-4H3m13 6a9 9 0 11-18 0 9 9 0 0118 0z'
    };
    return icons[priority] || icons['MEDIUM'];
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

  getStaffInitials(idStaff?: string): string {
    if (!idStaff) return '?';
    const staff = this.staffList.find(s => s.id === idStaff);
    const name = staff?.person?.fullname || '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  isOverdue(dateStr: string): boolean {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateStr);
    return dueDate < today;
  }

  isTaskCreator(task: TaskItem): boolean {
    return task.idStaffAssigned === this.currentStaffId;
  }

  canEditTask(task: TaskItem): boolean {
    return this.isAdmin || task.idStaffAssigned === this.currentStaffId;
  }

  getFilteredColumnTasks(tasks: TaskItem[]): TaskItem[] {
    return tasks.filter(task => {
      if (this.searchQuery && !task.title.toLowerCase().includes(this.searchQuery.toLowerCase())) {
        return false;
      }
      if (this.filterPriority !== -1 && task.priority !== Object.keys(TASK_PRIORITY)[this.filterPriority]) {
        return false;
      }
      return true;
    });
  }
}