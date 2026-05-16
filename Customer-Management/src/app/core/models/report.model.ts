import { PersonInfo } from './staff.model';

export interface DashboardSummaryItem {
  totalRevenue: number;
  totalLeads: number;
  totalCustomers: number;
  activeDeals: number;
  conversionRate: number;
  averageDealValue: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

export interface RevenueChartItem {
  date: string;
  revenue: number;
  dealsCount: number;
}

export interface PipelineFunnelItem {
  stage: string;
  count: number;
  value: number;
}

export interface StaffPerformanceItem {
  idStaff: string;
  staffName: string;
  totalDealsCreated: number;
  wonDeals: number;
  lostDeals: number;
  winRate: number;
  totalRevenue: number;
  avgDealValue: number;
  contactsCreated: number;
  leadsCreated: number;
  tasksCompleted: number;
}

export interface LeadConversionItem {
  totalLeads: number;
  convertedCustomers: number;
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