import { PersonInfo } from './staff.model';

export interface TaskRequest {
  title: string;
  description?: string;
  dueDate?: string;
  priority: string;
  status: string;
  idStaffAssigned?: string;
  linkedEntityType?: string;
  linkedEntityId?: string;
}

export interface TaskItem {
  idTask: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  isDeleted: boolean;
  idStaffAssigned?: string;
  staffAssigned?: StaffTaskItem;
  linkedEntityType?: string;
  linkedEntityId?: string;
}

export interface StaffTaskItem {
  id: string;
  person: PersonInfo;
}

export interface TaskResponse {
  errors?: { message: string }[];
  data: {
    tasks: TaskItem[];
  };
}

export interface TaskByIdResponse {
  errors?: { message: string }[];
  data: {
    taskById: TaskItem[];
  };
}

export interface TaskMutationResponse {
  errors?: { message: string }[];
  data: {
    createTask: TaskItem;
    updateTask: TaskItem;
    deleteTask: string;
    restoreTask: TaskItem;
    assignTask: TaskItem;
    updateTaskStatus: TaskItem;
  };
}

export const TASK_PRIORITY_LABELS: Record<string, string> = {
  'LOW': 'Low',
  'MEDIUM': 'Medium',
  'HIGH': 'High',
  'URGENT': 'Urgent'
};

export const TASK_PRIORITY_COLORS: Record<string, string> = {
  'LOW': 'bg-slate-100 text-slate-600',
  'MEDIUM': 'bg-blue-100 text-blue-700',
  'HIGH': 'bg-amber-100 text-amber-700',
  'URGENT': 'bg-red-100 text-red-700'
};

export const TASK_STATUS_LABELS: Record<string, string> = {
  'PENDING': 'Pending',
  'IN_PROGRESS': 'In Progress',
  'COMPLETED': 'Completed',
  'CANCELED': 'Cancelled'
};

export const TASK_STATUS_COLORS: Record<string, string> = {
  'PENDING': 'bg-slate-100 text-slate-600',
  'IN_PROGRESS': 'bg-blue-100 text-blue-700',
  'COMPLETED': 'bg-green-100 text-green-700',
  'CANCELED': 'bg-red-100 text-red-700'
};

export const TASK_LINKED_ENTITY_LABELS: Record<string, string> = {
  'Lead': 'Lead',
  'Customer': 'Customer',
  'Deal': 'Deal'
};