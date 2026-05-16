import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  DashboardSummaryItem,
  RevenueChartItem,
  PipelineFunnelItem,
  StaffPerformanceItem,
  LeadConversionItem
} from "../models/report.model";

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    constructor(private api: ApiService) {}

    GetDashboardSummary(fromDate: string, toDate: string): Observable<DashboardSummaryItem | null> {
        const query = `
            query($fromDate: DateTime!, $toDate: DateTime!) {
                dashboardSummary(fromDate: $fromDate, toDate: $toDate) {
                    totalRevenue
                    totalLeads
                    totalCustomers
                    activeDeals
                    conversionRate
                    averageDealValue
                }
            }`;

        return this.api.graphql<{ data: { dashboardSummary: DashboardSummaryItem } }>(query, { fromDate, toDate }).pipe(
            map(res => (res as any)?.dashboardSummary ?? null)
        );
    }

    GetRevenueChart(fromDate: string, toDate: string, groupBy: string = 'day'): Observable<RevenueChartItem[]> {
        const query = `
            query($fromDate: DateTime!, $toDate: DateTime!, $groupBy: String) {
                revenueChart(fromDate: $fromDate, toDate: $toDate, groupBy: $groupBy) {
                    dataPoints {
                        date
                        wonAmount
                        lostAmount
                        pipelineValue
                    }
                }
            }`;

        return this.api.graphql<{ data: { revenueChart: { dataPoints: RevenueChartItem[] } } }>(query, { fromDate, toDate, groupBy }).pipe(
            map(res => (res as any)?.revenueChart?.dataPoints ?? [])
        );
    }

    GetPipelineFunnel(): Observable<PipelineFunnelItem | null> {
        const query = `
            query {
                pipelineFunnel {
                    openDealsCount
                    negotiatingDealsCount
                    wonDealsCount
                    openDealsValue
                    negotiatingDealsValue
                    wonDealsValue
                }
            }`;

        return this.api.graphql<{ data: { pipelineFunnel: PipelineFunnelItem } }>(query).pipe(
            map(res => (res as any)?.pipelineFunnel ?? null)
        );
    }

    GetTopPerformingStaff(limit: number = 10): Observable<StaffPerformanceItem[]> {
        const query = `
            query($limit: Int!) {
                topPerformingStaff(limit: $limit) {
                    staffPerformances {
                        idStaff
                        staffName
                        totalDealsCreated
                        wonDeals
                        lostDeals
                        winRate
                        totalRevenue
                        averageDealValue
                        contactsCreated
                        leadsCreated
                        tasksCompleted
                    }
                }
            }`;

        return this.api.graphql<{ data: { topPerformingStaff: { staffPerformances: StaffPerformanceItem[] } } }>(query, { limit }).pipe(
            map(res => (res as any)?.topPerformingStaff?.staffPerformances ?? [])
        );
    }

    GetStaffPerformanceReport(idStaff: string, fromDate: string, toDate: string): Observable<StaffPerformanceItem | null> {
        const query = `
            query($idStaff: UUID!, $fromDate: DateTime!, $toDate: DateTime!) {
                staffPerformanceReport(idStaff: $idStaff, fromDate: $fromDate, toDate: $toDate) {
                    idStaff
                    staffName
                    totalDealsCreated
                    wonDeals
                    lostDeals
                    winRate
                    totalRevenue
                    averageDealValue
                    contactsCreated
                    leadsCreated
                    tasksCompleted
                }
            }`;

        return this.api.graphql<{ data: { staffPerformanceReport: StaffPerformanceItem } }>(query, { idStaff, fromDate, toDate }).pipe(
            map(res => (res as any)?.staffPerformanceReport ?? null)
        );
    }

    GetLeadConversionReport(fromDate: string, toDate: string): Observable<LeadConversionItem | null> {
        const query = `
            query($fromDate: DateTime!, $toDate: DateTime!) {
                leadConversionReport(fromDate: $fromDate, toDate: $toDate) {
                    totalLeads
                    convertedLeads
                    conversionRate
                }
            }`;

        return this.api.graphql<{ data: { leadConversionReport: LeadConversionItem } }>(query, { fromDate, toDate }).pipe(
            map(res => (res as any)?.leadConversionReport ?? null)
        );
    }

    ExportDealsReport(fromDate: string, toDate: string): Observable<string> {
        const query = `
            mutation ExportDealsReport($fromDate: DateTime!, $toDate: DateTime!) {
                exportDealsReport(fromDate: $fromDate, toDate: $toDate)
            }`;

        return this.api.graphql<{ data: { exportDealsReport: string } }>(query, { fromDate, toDate }).pipe(
            map(res => (res as any)?.exportDealsReport ?? '')
        );
    }

    ExportLeadsReport(fromDate: string, toDate: string): Observable<string> {
        const query = `
            mutation ExportLeadsReport($fromDate: DateTime!, $toDate: DateTime!) {
                exportLeadsReport(fromDate: $fromDate, toDate: $toDate)
            }`;

        return this.api.graphql<{ data: { exportLeadsReport: string } }>(query, { fromDate, toDate }).pipe(
            map(res => (res as any)?.exportLeadsReport ?? '')
        );
    }

    ExportCustomersReport(fromDate: string, toDate: string): Observable<string> {
        const query = `
            mutation ExportCustomersReport($fromDate: DateTime!, $toDate: DateTime!) {
                exportCustomersReport(fromDate: $fromDate, toDate: $toDate)
            }`;

        return this.api.graphql<{ data: { exportCustomersReport: string } }>(query, { fromDate, toDate }).pipe(
            map(res => (res as any)?.exportCustomersReport ?? '')
        );
    }
}