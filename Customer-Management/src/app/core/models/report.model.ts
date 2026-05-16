import { PersonInfo } from './staff.model';

export interface DashboardSummaryItem {
  totalRevenue: number;
  totalLeads: number;
  totalCustomers: number;
  activeDeals: number;
  conversionRate: number;
  averageDealValue: number;
}

export interface RevenueChartItem {
  date: string;
  wonAmount: number;
  lostAmount: number;
  pipelineValue: number;
}

export interface PipelineFunnelItem {
  openDealsCount: number;
  negotiatingDealsCount: number;
  wonDealsCount: number;
  openDealsValue: number;
  negotiatingDealsValue: number;
  wonDealsValue: number;
}

export interface StaffPerformanceItem {
  idStaff: string;
  staffName: string;
  totalDealsCreated: number;
  wonDeals: number;
  lostDeals: number;
  winRate: number;
  totalRevenue: number;
  averageDealValue: number;
  contactsCreated: number;
  leadsCreated: number;
  tasksCompleted: number;
}

export interface LeadConversionItem {
  totalLeads: number;
  convertedLeads: number;
  conversionRate: number;
}

export interface ReportResponse {
  errors?: { message: string }[];
  data: {
    dashboardSummary: DashboardSummaryItem;
    revenueChart: RevenueChartItem[];
    pipelineFunnel: PipelineFunnelItem[];
    topPerformingStaff: StaffPerformanceItem[];
    staffPerformanceReport: StaffPerformanceItem;
    leadConversionReport: LeadConversionItem;
  };
}

export const REPORT_PERIOD_LABELS: Record<string, string> = {
  'day': 'Today',
  'week': 'This Week',
  'month': 'This Month',
  'quarter': 'This Quarter',
  'year': 'This Year'
};