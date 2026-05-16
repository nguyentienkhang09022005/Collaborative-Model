import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarService } from '../../../../core/services/calendar.service';
import { StaffService } from '../../../../core/services/staff.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { PreferenceService } from '../../../../core/services/preference.service';
import { CalendarEventItem, EventParticipantItem } from '../../../../core/models/calendar.model';
import { StaffItem } from '../../../../core/models/staff.model';
import {
  CALENDAR_EVENT_TYPE_LABELS,
  CALENDAR_EVENT_TYPE_COLORS,
  CALENDAR_EVENT_STATUS_LABELS,
  CALENDAR_EVENT_STATUS_COLORS,
  PARTICIPANT_STATUS_LABELS
} from '../../../../core/models/calendar.model';
import { CALENDAR_EVENT_TYPE, CALENDAR_EVENT_STATUS } from '../../../../core/constants/enums';

@Component({
  selector: 'app-calendar-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar-list.html',
})
export class CalendarListComponent implements OnInit {
  events: CalendarEventItem[] = [];
  staffList: StaffItem[] = [];
  isLoading = true;

  private preferenceService = inject(PreferenceService);
  readonly themeConfig = this.preferenceService.themeConfig;

  showCreateModal = false;
  showDetailModal = false;
  selectedEvent: CalendarEventItem | null = null;

  currentStaffId = '';
  isAdmin = false;

  // Date range for filtering
  fromDate: string = '';
  toDate: string = '';

  eventForm: {
    title: string;
    description: string;
    eventType: string;
    startTime: string;
    endTime: string;
    location: string;
    isAllDay: boolean;
    reminderMinutes: number;
  } = this.getEmptyForm();

  typeLabels = CALENDAR_EVENT_TYPE_LABELS;
  typeColors = CALENDAR_EVENT_TYPE_COLORS;
  statusLabels = CALENDAR_EVENT_STATUS_LABELS;
  statusColors = CALENDAR_EVENT_STATUS_COLORS;
  participantStatusLabels = PARTICIPANT_STATUS_LABELS;

  eventTypes = CALENDAR_EVENT_TYPE;
  eventStatuses = CALENDAR_EVENT_STATUS;

  constructor(
    private calendarService: CalendarService,
    private staffService: StaffService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const staff = this.authService.getCurrentStaff();
    this.currentStaffId = staff?.id || '';
    this.isAdmin = staff?.role === 'ADMIN';

    // Set default date range (today + 30 days)
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);

    this.fromDate = today.toISOString().split('T')[0];
    this.toDate = thirtyDaysLater.toISOString().split('T')[0];

    this.loadEvents();
    this.loadStaffList();
  }

  loadEvents(): void {
    this.isLoading = true;

    // Format dates for GraphQL
    const fromDateTime = new Date(this.fromDate).toISOString();
    const toDateTime = new Date(this.toDate + 'T23:59:59').toISOString();

    if (this.isAdmin) {
      this.calendarService.GetCalendarEvents(fromDateTime, toDateTime).subscribe({
        next: (res) => {
          this.events = res;
          this.isLoading = false;
        },
        error: (err) => {
          this.toastService.error('Failed to load events');
          this.isLoading = false;
        }
      });
    } else {
      this.calendarService.GetMyEvents(this.currentStaffId, fromDateTime, toDateTime).subscribe({
        next: (res) => {
          this.events = res;
          this.isLoading = false;
        },
        error: (err) => {
          this.toastService.error('Failed to load events');
          this.isLoading = false;
        }
      });
    }
  }

  loadStaffList(): void {
    this.staffService.GetListStaff().subscribe({
      next: (res) => {
        this.staffList = res;
      },
      error: (err) => {
        console.log('Error loading staff list:', err);
      }
    });
  }

  getEmptyForm() {
    return {
      title: '',
      description: '',
      eventType: 'MEETING',
      startTime: '',
      endTime: '',
      location: '',
      isAllDay: false,
      reminderMinutes: 30
    };
  }

  openCreateModal(): void {
    this.eventForm = this.getEmptyForm();
    this.eventForm.startTime = this.fromDate + 'T09:00';
    this.eventForm.endTime = this.fromDate + 'T10:00';
    this.showCreateModal = true;
  }

  openDetailModal(event: CalendarEventItem): void {
    this.selectedEvent = event;
    this.showDetailModal = true;
  }

  closeModals(): void {
    this.showCreateModal = false;
    this.showDetailModal = false;
    this.selectedEvent = null;
    this.eventForm = this.getEmptyForm();
  }

  createEvent(): void {
    if (!this.eventForm.title.trim()) {
      this.toastService.warning('Title is required');
      return;
    }

    if (!this.eventForm.startTime || !this.eventForm.endTime) {
      this.toastService.warning('Start time and end time are required');
      return;
    }

    const request = {
      title: this.eventForm.title,
      description: this.eventForm.description || undefined,
      eventType: this.eventForm.eventType,
      startTime: new Date(this.eventForm.startTime).toISOString(),
      endTime: new Date(this.eventForm.endTime).toISOString(),
      location: this.eventForm.location || undefined,
      isAllDay: this.eventForm.isAllDay,
      reminderMinutes: this.eventForm.reminderMinutes,
      idStaff: this.currentStaffId
    };

    this.calendarService.createCalendarEvent(request).subscribe({
      next: () => {
        this.toastService.success('Event created successfully');
        this.closeModals();
        this.loadEvents();
      },
      error: (err) => {
        this.toastService.error(err.message || 'Failed to create event');
      }
    });
  }

  updateEventStatus(idEvent: string, status: string): void {
    this.calendarService.updateCalendarEvent(idEvent, { status }).subscribe({
      next: () => {
        this.toastService.success('Event status updated');
        this.loadEvents();
        if (this.selectedEvent) {
          this.selectedEvent.status = status;
        }
      },
      error: (err) => {
        this.toastService.error(err.message || 'Failed to update event');
      }
    });
  }

  cancelEvent(idEvent: string): void {
    this.calendarService.cancelCalendarEvent(idEvent).subscribe({
      next: () => {
        this.toastService.success('Event cancelled');
        this.closeModals();
        this.loadEvents();
      },
      error: (err) => {
        this.toastService.error(err.message || 'Failed to cancel event');
      }
    });
  }

  deleteEvent(idEvent: string): void {
    this.calendarService.deleteCalendarEvent(idEvent).subscribe({
      next: () => {
        this.toastService.success('Event deleted');
        this.closeModals();
        this.loadEvents();
      },
      error: (err) => {
        this.toastService.error(err.message || 'Failed to delete event');
      }
    });
  }

  getTypeClass(eventType: string): string {
    return this.typeColors[eventType] || 'bg-slate-100 text-slate-600';
  }

  getStatusClass(status: string): string {
    return this.statusColors[status] || 'bg-slate-100 text-slate-600';
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

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  }

  formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }

  getStaffName(idStaff: string): string {
    const staff = this.staffList.find(s => s.id === idStaff);
    return staff?.person?.fullname || 'Unknown';
  }

  canManageEvent(event: CalendarEventItem): boolean {
    return this.isAdmin || event.idStaff === this.currentStaffId;
  }

  getUpcomingEvents(): CalendarEventItem[] {
    return this.events
      .filter(e => e.status === 'SCHEDULED' || e.status === 'IN_PROGRESS')
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }

  getPastEvents(): CalendarEventItem[] {
    return this.events
      .filter(e => e.status === 'COMPLETED' || e.status === 'CANCELLED')
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  }
}