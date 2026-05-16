// Constants matching backend enums

export const DEAL_STATUS = {
  OPEN: 'OPEN',
  NEGOTIATING: 'NEGOTIATING',
  WON: 'WON',
  LOST: 'LOST'
} as const;

export const CONTACT_STATUS = {
  NEW: 'NEW',
  IN_PROGRESS: 'IN_PROGRESS',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  CLOSED: 'CLOSED',
  CANCELED: 'CANCELED'
} as const;

export const STAFF_ROLE = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF'
} as const;

export const STAFF_STATUS = {
  OFFLINE: 0,
  ONLINE: 1,
  BUSY: 2,
  AWAY: 3
} as const;

export const TASK_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
} as const;

export const TASK_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED'
} as const;

// Label mappings for UI display
export const DEAL_STATUS_LABELS: Record<string, string> = {
  [DEAL_STATUS.OPEN]: 'Open',
  [DEAL_STATUS.NEGOTIATING]: 'Negotiating',
  [DEAL_STATUS.WON]: 'Won',
  [DEAL_STATUS.LOST]: 'Lost'
};

export const CONTACT_STATUS_LABELS: Record<string, string> = {
  [CONTACT_STATUS.NEW]: 'New',
  [CONTACT_STATUS.IN_PROGRESS]: 'In Progress',
  [CONTACT_STATUS.SUCCESS]: 'Success',
  [CONTACT_STATUS.FAILED]: 'Failed',
  [CONTACT_STATUS.CLOSED]: 'Closed',
  [CONTACT_STATUS.CANCELED]: 'Canceled'
};

export const STAFF_ROLE_LABELS: Record<string, string> = {
  [STAFF_ROLE.ADMIN]: 'Admin',
  [STAFF_ROLE.STAFF]: 'Staff'
};

export const STAFF_ROLE_COLORS: Record<string, string> = {
  [STAFF_ROLE.ADMIN]: 'bg-purple-100 text-purple-700',
  [STAFF_ROLE.STAFF]: 'bg-blue-100 text-blue-700'
};

export const STAFF_STATUS_LABELS: Record<number, string> = {
  [STAFF_STATUS.OFFLINE]: 'Offline',
  [STAFF_STATUS.ONLINE]: 'Online',
  [STAFF_STATUS.BUSY]: 'Busy',
  [STAFF_STATUS.AWAY]: 'Away'
};

// Color mappings for status badges
export const DEAL_STATUS_COLORS: Record<string, string> = {
  [DEAL_STATUS.OPEN]: 'bg-emerald-500',
  [DEAL_STATUS.NEGOTIATING]: 'bg-amber-500',
  [DEAL_STATUS.WON]: 'bg-green-500',
  [DEAL_STATUS.LOST]: 'bg-red-500'
};

export const CONTACT_STATUS_COLORS: Record<string, string> = {
  [CONTACT_STATUS.NEW]: 'bg-blue-500',
  [CONTACT_STATUS.IN_PROGRESS]: 'bg-amber-500',
  [CONTACT_STATUS.SUCCESS]: 'bg-green-500',
  [CONTACT_STATUS.FAILED]: 'bg-red-500',
  [CONTACT_STATUS.CLOSED]: 'bg-purple-500',
  [CONTACT_STATUS.CANCELED]: 'bg-slate-500'
};

export const TASK_LINKED_ENTITY = {
  LEAD: 'Lead',
  CUSTOMER: 'Customer',
  DEAL: 'Deal'
} as const;

export const NOTE_TYPE = {
  COMMENT: 'COMMENT',
  UPDATE: 'UPDATE',
  SYSTEM: 'SYSTEM'
} as const;

export const NOTIFICATION_TYPE = {
  TASK_ASSIGNED: 'TASK_ASSIGNED',
  TASK_COMPLETED: 'TASK_COMPLETED',
  DEAL_UPDATED: 'DEAL_UPDATED',
  CONTACT_STATUS_CHANGED: 'CONTACT_STATUS_CHANGED',
  MENTION: 'MENTION',
  SYSTEM: 'SYSTEM',
  REMINDER: 'NotificationReminder'
} as const;

export const CALENDAR_EVENT_TYPE = {
  MEETING: 0,
  CALL: 1,
  TASK_DEADLINE: 2,
  FOLLOW_UP: 3
} as const;

export const CALENDAR_EVENT_STATUS = {
  SCHEDULED: 0,
  IN_PROGRESS: 1,
  COMPLETED: 2,
  CANCELLED: 3
} as const;

export const PARTICIPANT_STATUS = {
  PENDING: 0,
  ACCEPTED: 1,
  DECLINED: 2,
  TENTATIVE: 3
} as const;

export const TEAM_ROLE = {
  OWNER: 0,
  MEMBER: 1,
  VIEWER: 2
} as const;

export const TEAM_ENTITY_TYPE = {
  LEAD: 'Lead',
  DEAL: 'Deal'
} as const;

export const AUDIT_ACTION = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  RESTORE: 'RESTORE',
  ASSIGN: 'ASSIGN',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT'
} as const;

export const AUDIT_ENTITY_TYPE = {
  STAFF: 'Staff',
  LEAD: 'Lead',
  CUSTOMER: 'Customer',
  CONTACT: 'Contact',
  DEAL: 'Deal',
  TASK: 'Task',
  NOTE: 'Note',
  NOTIFICATION: 'Notification',
  TEAM_MEMBER: 'TeamMember',
  CALENDAR_EVENT: 'CalendarEvent'
} as const;

export const STAFF_STATUS_COLORS: Record<number, string> = {
  [STAFF_STATUS.OFFLINE]: 'bg-slate-400',
  [STAFF_STATUS.ONLINE]: 'bg-green-500',
  [STAFF_STATUS.BUSY]: 'bg-red-500',
  [STAFF_STATUS.AWAY]: 'bg-amber-500'
};