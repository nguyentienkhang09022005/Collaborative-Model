export interface StaffStatusItem {
  idStaff: string;
  fullname: string;
  email: string;
  status: number;
  statusName: string;
  lastActiveAt?: string;
}

export interface StaffStatusResponse {
  errors?: { message: string }[];
  data: {
    staffStatuses: StaffStatusItem[];
    onlineStaffs: StaffStatusItem[];
  };
}

export interface StaffActivityLogItem {
  idLog: string;
  idStaff: string;
  staffName: string;
  action: string;
  entityType?: string;
  entityId?: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface StaffActivityLogResponse {
  errors?: { message: string }[];
  data: {
    staffActivityLogs: StaffActivityLogItem[];
  };
}

export const STAFF_STATUS_LABELS: Record<number, string> = {
  0: 'Offline',
  1: 'Online',
  2: 'Busy',
  3: 'Away'
};

export const STAFF_STATUS_COLORS: Record<number, string> = {
  0: 'bg-slate-100 text-slate-600',
  1: 'bg-green-100 text-green-700',
  2: 'bg-red-100 text-red-700',
  3: 'bg-amber-100 text-amber-700'
};