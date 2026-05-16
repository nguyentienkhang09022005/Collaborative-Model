import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditLogService } from '../../../../core/services/audit-log.service';
import { ToastService } from '../../../../core/services/toast.service';
import { AuditLogItem } from '../../../../core/models/audit-log.model';
import {
  AUDIT_ACTION_LABELS,
  AUDIT_ACTION_COLORS,
  AUDIT_ENTITY_TYPE_LABELS
} from '../../../../core/models/audit-log.model';
import { AUDIT_ACTION, AUDIT_ENTITY_TYPE } from '../../../../core/constants/enums';

@Component({
  selector: 'app-audit-log-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-log-list.html',
})
export class AuditLogListComponent implements OnInit {
  auditLogs: AuditLogItem[] = [];
  isLoading = true;

  filterEntityType = '';
  filterAction = '';
  fromDate = '';
  toDate = '';

  currentPage = 1;
  pageSize = 20;

  actionLabels = AUDIT_ACTION_LABELS;
  actionColors = AUDIT_ACTION_COLORS;
  entityTypeLabels = AUDIT_ENTITY_TYPE_LABELS;

  auditActions = AUDIT_ACTION;
  auditEntityTypes = AUDIT_ENTITY_TYPE;

  constructor(
    private auditLogService: AuditLogService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadAuditLogs();
  }

  loadAuditLogs(): void {
    this.isLoading = true;
    this.auditLogService.GetAuditLogs(
      this.filterEntityType || undefined,
      undefined,
      this.fromDate ? new Date(this.fromDate).toISOString() : undefined,
      this.toDate ? new Date(this.toDate + 'T23:59:59').toISOString() : undefined,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (res) => {
        this.auditLogs = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastService.error('Failed to load audit logs');
        this.isLoading = false;
      }
    });
  }

  filterLogs(): void {
    this.currentPage = 1;
    this.loadAuditLogs();
  }

  clearFilters(): void {
    this.filterEntityType = '';
    this.filterAction = '';
    this.fromDate = '';
    this.toDate = '';
    this.currentPage = 1;
    this.loadAuditLogs();
  }

  getActionClass(action: string): string {
    return this.actionColors[action] || 'bg-slate-100 text-slate-600';
  }

  formatDateTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getEntityLabel(entityType: string): string {
    return this.entityTypeLabels[entityType] || entityType;
  }

  getActionLabel(action: string): string {
    return this.actionLabels[action] || action;
  }

  viewEntityHistory(entityType: string, entityId: string): void {
    this.auditLogService.GetEntityHistory(entityType, entityId).subscribe({
      next: (logs) => {
        console.log('Entity history:', logs);
        // Could open a modal to show entity history
      },
      error: (err) => {
        this.toastService.error('Failed to load entity history');
      }
    });
  }

  formatOldNewValues(oldValues?: string, newValues?: string): string {
    if (!oldValues && !newValues) return '';
    // Parse JSON and format for display
    try {
      const oldObj = oldValues ? JSON.parse(oldValues) : null;
      const newObj = newValues ? JSON.parse(newValues) : null;

      if (oldObj && newObj) {
        // Find changed fields
        const changes: string[] = [];
        for (const key of Object.keys(newObj)) {
          if (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
            changes.push(`${key}: "${oldObj[key]}" → "${newObj[key]}"`);
          }
        }
        return changes.join(', ');
      }
    } catch (e) {
      // Not JSON, return as is
    }
    return oldValues || newValues || '';
  }
}