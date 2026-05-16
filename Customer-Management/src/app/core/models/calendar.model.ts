import { PersonInfo } from './staff.model';

export interface CalendarEventRequest {
  title: string;
  description?: string;
  eventType: string;
  startTime: string;
  endTime: string;
  location?: string;
  isAllDay: boolean;
  reminderMinutes?: number;
  idStaff: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
}

export interface CalendarEventUpdateRequest {
  title?: string;
  description?: string;
  eventType?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  isAllDay?: boolean;
  reminderMinutes?: number;
  status?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
}

export interface EventParticipantRequest {
  idEvent: string;
  idStaff: string;
}

export interface CalendarEventItem {
  idEvent: string;
  title: string;
  description?: string;
  eventType: string;
  startTime: string;
  endTime: string;
  location?: string;
  isAllDay: boolean;
  reminderMinutes?: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
  idStaff: string;
  staff?: CalendarStaffItem;
  relatedEntityType?: string;
  relatedEntityId?: string;
  participants?: EventParticipantItem[];
}

export interface CalendarStaffItem {
  id: string;
  person: PersonInfo;
}

export interface EventParticipantItem {
  id: string;
  idEvent: string;
  idStaff: string;
  staff?: CalendarStaffItem;
  status: string;
  respondedAt?: string;
}

export interface CalendarEventResponse {
  errors?: { message: string }[];
  data: {
    calendarEvents: CalendarEventItem[];
    calendarEventById: CalendarEventItem[];
    myEvents: CalendarEventItem[];
    upcomingEvents: CalendarEventItem[];
    eventParticipants: EventParticipantItem[];
    eventsByEntity: CalendarEventItem[];
  };
}

export interface CalendarEventMutationResponse {
  errors?: { message: string }[];
  data: {
    createCalendarEvent: CalendarEventItem;
    updateCalendarEvent: CalendarEventItem;
    deleteCalendarEvent: string;
    cancelCalendarEvent: CalendarEventItem;
    addParticipant: EventParticipantItem;
    updateParticipantStatus: EventParticipantItem;
    removeParticipant: string;
  };
}

export const CALENDAR_EVENT_TYPE_LABELS: Record<string, string> = {
  'MEETING': 'Meeting',
  'CALL': 'Call',
  'TASK_DEADLINE': 'Task Deadline',
  'FOLLOW_UP': 'Follow Up'
};

export const CALENDAR_EVENT_TYPE_COLORS: Record<string, string> = {
  'MEETING': 'bg-blue-100 text-blue-700',
  'CALL': 'bg-green-100 text-green-700',
  'TASK_DEADLINE': 'bg-red-100 text-red-700',
  'FOLLOW_UP': 'bg-purple-100 text-purple-700'
};

export const CALENDAR_EVENT_STATUS_LABELS: Record<string, string> = {
  'SCHEDULED': 'Scheduled',
  'IN_PROGRESS': 'In Progress',
  'COMPLETED': 'Completed',
  'CANCELLED': 'Cancelled'
};

export const CALENDAR_EVENT_STATUS_COLORS: Record<string, string> = {
  'SCHEDULED': 'bg-blue-100 text-blue-700',
  'IN_PROGRESS': 'bg-amber-100 text-amber-700',
  'COMPLETED': 'bg-green-100 text-green-700',
  'CANCELLED': 'bg-slate-100 text-slate-600'
};

export const PARTICIPANT_STATUS_LABELS: Record<string, string> = {
  'PENDING': 'Pending',
  'ACCEPTED': 'Accepted',
  'DECLINED': 'Declined',
  'TENTATIVE': 'Tentative'
};

export const PARTICIPANT_STATUS_COLORS: Record<string, string> = {
  'PENDING': 'bg-slate-100 text-slate-600',
  'ACCEPTED': 'bg-green-100 text-green-700',
  'DECLINED': 'bg-red-100 text-red-700',
  'TENTATIVE': 'bg-amber-100 text-amber-700'
};