import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  AuditLogItem,
  AuditLogResponse,
  AuditStatisticsItem,
  AuditStatisticsResponse
} from "../models/audit-log.model";

@Injectable({
    providedIn: 'root'
})
export class AuditLogService {
    constructor(private api: ApiService) {}

    GetAuditLogs(
        entityType?: string,
        entityId?: string,
        fromDate?: string,
        toDate?: string,
        page: number = 1,
        pageSize: number = 20
    ): Observable<AuditLogItem[]> {
        const query = `
            query($entityType: String, $entityId: UUID, $fromDate: DateTime, $toDate: DateTime, $page: Int, $pageSize: Int) {
                auditLogs(entityType: $entityType, entityId: $entityId, fromDate: $fromDate, toDate: $toDate, page: $page, pageSize: $pageSize) {
                    idLog
                    action
                    entityType
                    entityId
                    oldValues
                    newValues
                    idStaff
                    staffName
                    ipAddress
                    userAgent
                    timestamp
                    description
                }
            }`;

        return this.api.graphql<AuditLogResponse>(query, { entityType, entityId, fromDate, toDate, page, pageSize }).pipe(
            map(res => (res as any)?.auditLogs ?? [])
        );
    }

    GetAuditLogsByStaff(
        idStaff: string,
        fromDate?: string,
        toDate?: string,
        page: number = 1,
        pageSize: number = 20
    ): Observable<AuditLogItem[]> {
        const query = `
            query($idStaff: UUID!, $fromDate: DateTime, $toDate: DateTime, $page: Int, $pageSize: Int) {
                auditLogsByStaff(idStaff: $idStaff, fromDate: $fromDate, toDate: $toDate, page: $page, pageSize: $pageSize) {
                    idLog
                    action
                    entityType
                    entityId
                    timestamp
                    description
                    staffName
                }
            }`;

        return this.api.graphql<AuditLogResponse>(query, { idStaff, fromDate, toDate, page, pageSize }).pipe(
            map(res => (res as any)?.auditLogsByStaff ?? [])
        );
    }

    GetAuditLogsByAction(
        action: string,
        fromDate?: string,
        toDate?: string,
        page: number = 1,
        pageSize: number = 20
    ): Observable<AuditLogItem[]> {
        const query = `
            query($action: String!, $fromDate: DateTime, $toDate: DateTime, $page: Int, $pageSize: Int) {
                auditLogsByAction(action: $action, fromDate: $fromDate, toDate: $toDate, page: $page, pageSize: $pageSize) {
                    idLog
                    action
                    entityType
                    entityId
                    timestamp
                    description
                    staffName
                }
            }`;

        return this.api.graphql<AuditLogResponse>(query, { action, fromDate, toDate, page, pageSize }).pipe(
            map(res => (res as any)?.auditLogsByAction ?? [])
        );
    }

    GetEntityHistory(entityType: string, entityId: string): Observable<AuditLogItem[]> {
        const query = `
            query($entityType: String!, $entityId: UUID!) {
                entityHistory(entityType: $entityType, entityId: $entityId) {
                    idLog
                    action
                    entityType
                    entityId
                    oldValues
                    newValues
                    idStaff
                    staffName
                    timestamp
                    description
                }
            }`;

        return this.api.graphql<AuditLogResponse>(query, { entityType, entityId }).pipe(
            map(res => (res as any)?.entityHistory ?? [])
        );
    }

    GetAuditStatistics(fromDate?: string, toDate?: string): Observable<AuditStatisticsItem | null> {
        const query = `
            query($fromDate: DateTime, $toDate: DateTime) {
                auditStatistics(fromDate: $fromDate, toDate: $toDate) {
                    totalLogs
                    createCount
                    updateCount
                    deleteCount
                    restoreCount
                    entityTypeCounts
                    actionCounts
                    topActions {
                        action
                        count
                    }
                    topEntities {
                        entityType
                        count
                    }
                }
            }`;

        return this.api.graphql<AuditStatisticsResponse>(query, { fromDate, toDate }).pipe(
            map(res => (res as any)?.auditStatistics ?? null)
        );
    }
}