import { PersonInfo } from './staff.model';

export interface AuditLogItem {
  idLog: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValues?: string;
  newValues?: string;
  idStaff?: string;
  staffName?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  description: string;
}

export interface AuditLogResponse {
  errors?: { message: string }[];
  data: {
    auditLogs: AuditLogItem[];
    auditLogsByStaff: AuditLogItem[];
    auditLogsByAction: AuditLogItem[];
    entityHistory: AuditLogItem[];
  };
}

export interface AuditStatisticsItem {
  totalLogs: number;
  createCount: number;
  updateCount: number;
  deleteCount: number;
  restoreCount: number;
  entityTypeCounts: Record<string, number>;
  actionCounts: Record<string, number>;
  topActions: { action: string; count: number }[];
  topEntities: { entityType: string; count: number }[];
}

export interface AuditStatisticsResponse {
  errors?: { message: string }[];
  data: {
    auditStatistics: AuditStatisticsItem;
  };
}

export const AUDIT_ACTION_LABELS: Record<string, string> = {
  'CREATE': 'Create',
  'UPDATE': 'Update',
  'DELETE': 'Delete',
  'RESTORE': 'Restore',
  'ASSIGN': 'Assign',
  'LOGIN': 'Login',
  'LOGOUT': 'Logout'
};

export const AUDIT_ACTION_COLORS: Record<string, string> = {
  'CREATE': 'bg-green-100 text-green-700',
  'UPDATE': 'bg-blue-100 text-blue-700',
  'DELETE': 'bg-red-100 text-red-700',
  'RESTORE': 'bg-purple-100 text-purple-700',
  'ASSIGN': 'bg-amber-100 text-amber-700',
  'LOGIN': 'bg-slate-100 text-slate-600',
  'LOGOUT': 'bg-slate-100 text-slate-600'
};

export const AUDIT_ENTITY_TYPE_LABELS: Record<string, string> = {
  'Staff': 'Staff',
  'Lead': 'Lead',
  'Customer': 'Customer',
  'Contact': 'Contact',
  'Deal': 'Deal',
  'Task': 'Task',
  'Note': 'Note',
  'Notification': 'Notification',
  'TeamMember': 'Team Member',
  'CalendarEvent': 'Calendar Event'
};