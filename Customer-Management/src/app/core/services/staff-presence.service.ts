import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  StaffStatusItem,
  StaffStatusResponse,
  StaffActivityLogItem,
  StaffActivityLogResponse
} from "../models/staff-presence.model";

@Injectable({
    providedIn: 'root'
})
export class StaffPresenceService {
    constructor(private api: ApiService) {}

    GetStaffStatuses(): Observable<StaffStatusItem[]> {
        const query = `
            query {
                staffStatuses {
                    idStaff
                    fullname
                    email
                    status
                    statusName
                    lastActiveAt
                }
            }`;

        return this.api.graphql<StaffStatusResponse>(query).pipe(
            map(res => (res as any)?.staffStatuses ?? [])
        );
    }

    GetOnlineStaffs(): Observable<StaffStatusItem[]> {
        const query = `
            query {
                onlineStaffs {
                    idStaff
                    fullname
                    email
                    status
                    statusName
                    lastActiveAt
                }
            }`;

        return this.api.graphql<StaffStatusResponse>(query).pipe(
            map(res => (res as any)?.onlineStaffs ?? [])
        );
    }

    GetStaffActivityLogs(
        idStaff: string,
        fromDate?: string,
        toDate?: string
    ): Observable<StaffActivityLogItem[]> {
        const query = `
            query($idStaff: UUID!, $fromDate: DateTime, $toDate: DateTime) {
                staffActivityLogs(idStaff: $idStaff, fromDate: $fromDate, toDate: $toDate) {
                    idLog
                    idStaff
                    staffName
                    action
                    entityType
                    entityId
                    timestamp
                    ipAddress
                    userAgent
                }
            }`;

        return this.api.graphql<StaffActivityLogResponse>(query, { idStaff, fromDate, toDate }).pipe(
            map(res => (res as any)?.staffActivityLogs ?? [])
        );
    }

    UpdateMyStatus(status: number): Observable<StaffStatusItem> {
        const query = `
            mutation UpdateMyStatus($status: Int!) {
                updateMyStatus(status: $status) {
                    idStaff
                    status
                    statusName
                    lastActiveAt
                }
            }`;

        return this.api.graphql<{ data: { updateMyStatus: StaffStatusItem } }>(query, { status }).pipe(
            map(res => (res as any)?.updateMyStatus)
        );
    }

    RefreshLastActive(): Observable<StaffStatusItem> {
        const query = `
            mutation RefreshLastActive {
                refreshLastActive {
                    idStaff
                    status
                    lastActiveAt
                }
            }`;

        return this.api.graphql<{ data: { refreshLastActive: StaffStatusItem } }>(query).pipe(
            map(res => (res as any)?.refreshLastActive)
        );
    }
}