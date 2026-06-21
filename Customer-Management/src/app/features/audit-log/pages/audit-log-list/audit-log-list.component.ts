import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditLogService } from '../../../../core/services/audit-log.service';
import { ToastService } from '../../../../core/services/toast.service';
import { PreferenceService } from '../../../../core/services/preference.service';
import { AuditLogItem } from '../../../../core/models/audit-log.model';
import {
  AUDIT_ACTION_LABELS,
  AUDIT_ACTION_COLORS,
  AUDIT_ENTITY_TYPE_LABELS
} from '../../../../core/models/audit-log.model';
import { AUDIT_ACTION, AUDIT_ENTITY_TYPE } from '../../../../core/constants/enums';

interface ChangeLine {
  key: string;
  oldVal?: string;
  newVal?: string;
  state: 'changed' | 'added' | 'removed';
}

const NOISE_KEYS = new Set([
  'id', 'idStaff', 'idDeal', 'idLead', 'idCustomer', 'idContact', 'idTask', 'idNote',
  'createdAt', 'updatedAt', 'createdBy', 'updatedBy',
]);

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

  private preferenceService = inject(PreferenceService);
  readonly themeConfig = this.preferenceService.themeConfig;

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

  formatChanges(oldValues?: string, newValues?: string): ChangeLine[] {
    const safeParse = (raw?: string): Record<string, unknown> | null => {
      if (!raw || raw.trim() === '') return null;
      try {
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
      } catch {
        return null;
      }
    };

    const oldObj = safeParse(oldValues);
    const newObj = safeParse(newValues);

    const formatVal = (v: unknown): string => {
      if (v === null || v === undefined) return '∅';
      if (typeof v === 'object') return JSON.stringify(v);
      return String(v);
    };

    const lines: ChangeLine[] = [];
    const seen = new Set<string>();

    if (oldObj && newObj) {
      // Diff: walk new keys, then old-only keys
      for (const key of Object.keys(newObj)) {
        if (NOISE_KEYS.has(key)) continue;
        seen.add(key);
        const o = oldObj[key];
        const n = newObj[key];
        if (JSON.stringify(o) !== JSON.stringify(n)) {
          lines.push({ key, oldVal: formatVal(o), newVal: formatVal(n), state: 'changed' });
        }
      }
      for (const key of Object.keys(oldObj)) {
        if (NOISE_KEYS.has(key) || seen.has(key)) continue;
        lines.push({ key, oldVal: formatVal(oldObj[key]), state: 'removed' });
      }
    } else if (newObj) {
      // Create: every field is "added"
      for (const key of Object.keys(newObj)) {
        if (NOISE_KEYS.has(key)) continue;
        lines.push({ key, newVal: formatVal(newObj[key]), state: 'added' });
      }
    } else if (oldObj) {
      // Delete: every field is "removed"
      for (const key of Object.keys(oldObj)) {
        if (NOISE_KEYS.has(key)) continue;
        lines.push({ key, oldVal: formatVal(oldObj[key]), state: 'removed' });
      }
    } else if (oldValues || newValues) {
      // Unparseable raw string — show as-is
      lines.push({ key: (oldValues || newValues || '').slice(0, 80), state: 'changed' });
    }

    return lines;
  }
}