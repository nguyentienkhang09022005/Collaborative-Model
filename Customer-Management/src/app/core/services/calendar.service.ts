import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  CalendarEventRequest,
  CalendarEventUpdateRequest,
  EventParticipantRequest,
  CalendarEventItem,
  EventParticipantItem,
  CalendarEventResponse,
  CalendarEventMutationResponse
} from "../models/calendar.model";

@Injectable({
    providedIn: 'root'
})
export class CalendarService {
    constructor(private api: ApiService) {}

    GetCalendarEvents(fromDate: string, toDate: string, idStaff?: string): Observable<CalendarEventItem[]> {
        const query = `
            query($fromDate: DateTime!, $toDate: DateTime!, $idStaff: UUID) {
                calendarEvents(fromDate: $fromDate, toDate: $toDate, idStaff: $idStaff) {
                    idEvent
                    title
                    description
                    eventType
                    startTime
                    endTime
                    location
                    isAllDay
                    reminderMinutes
                    status
                    createdAt
                    updatedAt
                    idStaff
                    staff {
                        id
                        person {
                            id
                            fullname
                            email
                        }
                    }
                    relatedEntityType
                    relatedEntityId
                    participants {
                        id
                        idEvent
                        idStaff
                        staff {
                            id
                            person {
                                fullname
                            }
                        }
                        status
                        respondedAt
                    }
                }
            }`;

        return this.api.graphql<CalendarEventResponse>(query, { fromDate, toDate, idStaff }).pipe(
            map(res => (res as any)?.calendarEvents ?? [])
        );
    }

    GetCalendarEventById(idEvent: string): Observable<CalendarEventItem | null> {
        const query = `
            query($idEvent: UUID!) {
                calendarEventById(idEvent: $idEvent) {
                    idEvent
                    title
                    description
                    eventType
                    startTime
                    endTime
                    location
                    isAllDay
                    reminderMinutes
                    status
                    createdAt
                    idStaff
                    staff {
                        id
                        person {
                            fullname
                        }
                    }
                    relatedEntityType
                    relatedEntityId
                    participants {
                        id
                        idEvent
                        idStaff
                        staff {
                            id
                            person {
                                fullname
                            }
                        }
                        status
                        respondedAt
                    }
                }
            }`;

        return this.api.graphql<CalendarEventResponse>(query, { idEvent }).pipe(
            map(res => (res as any)?.calendarEventById ?? null)
        );
    }

    GetMyEvents(idStaff: string, fromDate: string, toDate: string): Observable<CalendarEventItem[]> {
        const query = `
            query($idStaff: UUID!, $fromDate: DateTime!, $toDate: DateTime!) {
                myEvents(idStaff: $idStaff, fromDate: $fromDate, toDate: $toDate) {
                    idEvent
                    title
                    description
                    eventType
                    startTime
                    endTime
                    location
                    isAllDay
                    reminderMinutes
                    status
                    createdAt
                    participants {
                        id
                        idEvent
                        idStaff
                        staff {
                            id
                            person {
                                fullname
                            }
                        }
                        status
                    }
                }
            }`;

        return this.api.graphql<CalendarEventResponse>(query, { idStaff, fromDate, toDate }).pipe(
            map(res => (res as any)?.myEvents ?? [])
        );
    }

    GetUpcomingEvents(idStaff: string, days: number): Observable<CalendarEventItem[]> {
        const query = `
            query($idStaff: UUID!, $days: Int!) {
                upcomingEvents(idStaff: $idStaff, days: $days) {
                    idEvent
                    title
                    eventType
                    startTime
                    endTime
                    location
                    status
                }
            }`;

        return this.api.graphql<CalendarEventResponse>(query, { idStaff, days }).pipe(
            map(res => (res as any)?.upcomingEvents ?? [])
        );
    }

    GetEventParticipants(idEvent: string): Observable<EventParticipantItem[]> {
        const query = `
            query($idEvent: UUID!) {
                eventParticipants(idEvent: $idEvent) {
                    id
                    idEvent
                    idStaff
                    staff {
                        id
                        person {
                            fullname
                            email
                        }
                    }
                    status
                    respondedAt
                }
            }`;

        return this.api.graphql<CalendarEventResponse>(query, { idEvent }).pipe(
            map(res => (res as any)?.eventParticipants ?? [])
        );
    }

    GetEventsByEntity(entityType: string, entityId: string): Observable<CalendarEventItem[]> {
        const query = `
            query($entityType: String!, $entityId: UUID!) {
                eventsByEntity(entityType: $entityType, entityId: $entityId) {
                    idEvent
                    title
                    description
                    eventType
                    startTime
                    endTime
                    location
                    status
                    staff {
                        id
                        person {
                            fullname
                        }
                    }
                }
            }`;

        return this.api.graphql<CalendarEventResponse>(query, { entityType, entityId }).pipe(
            map(res => (res as any)?.eventsByEntity ?? [])
        );
    }

    createCalendarEvent(request: CalendarEventRequest): Observable<CalendarEventItem> {
        const query = `
            mutation CreateCalendarEvent($input: CalendarEventInput!) {
                createCalendarEvent(input: $input) {
                    idEvent
                    title
                    description
                    eventType
                    startTime
                    endTime
                    location
                    isAllDay
                    reminderMinutes
                    status
                    createdAt
                    idStaff
                    relatedEntityType
                    relatedEntityId
                }
            }`;

        const input = {
            title: request.title,
            description: request.description,
            eventType: request.eventType,
            startTime: request.startTime,
            endTime: request.endTime,
            location: request.location,
            isAllDay: request.isAllDay,
            reminderMinutes: request.reminderMinutes,
            idStaff: request.idStaff,
            relatedEntityType: request.relatedEntityType,
            relatedEntityId: request.relatedEntityId
        };

        return this.api.graphql<CalendarEventMutationResponse>(query, { input }).pipe(
            map((res: any) => res.createCalendarEvent)
        );
    }

    updateCalendarEvent(idEvent: string, request: Partial<CalendarEventUpdateRequest>): Observable<CalendarEventItem> {
        const query = `
            mutation UpdateCalendarEvent($idEvent: UUID!, $input: CalendarEventUpdateInput!) {
                updateCalendarEvent(idEvent: $idEvent, input: $input) {
                    idEvent
                    title
                    description
                    eventType
                    startTime
                    endTime
                    location
                    isAllDay
                    reminderMinutes
                    status
                    updatedAt
                    relatedEntityType
                    relatedEntityId
                }
            }`;

        const input: Record<string, unknown> = {};
        if (request['title'] !== undefined) input['title'] = request['title'];
        if (request['description'] !== undefined) input['description'] = request['description'];
        if (request['eventType'] !== undefined) input['eventType'] = request['eventType'];
        if (request['startTime'] !== undefined) input['startTime'] = request['startTime'];
        if (request['endTime'] !== undefined) input['endTime'] = request['endTime'];
        if (request['location'] !== undefined) input['location'] = request['location'];
        if (request['isAllDay'] !== undefined) input['isAllDay'] = request['isAllDay'];
        if (request['reminderMinutes'] !== undefined) input['reminderMinutes'] = request['reminderMinutes'];
        if (request['status'] !== undefined) input['status'] = request['status'];
        if (request['relatedEntityType'] !== undefined) input['relatedEntityType'] = request['relatedEntityType'];
        if (request['relatedEntityId'] !== undefined) input['relatedEntityId'] = request['relatedEntityId'];

        return this.api.graphql<CalendarEventMutationResponse>(query, { idEvent, input }).pipe(
            map((res: any) => res.updateCalendarEvent)
        );
    }

    deleteCalendarEvent(idEvent: string): Observable<string> {
        const query = `
            mutation DeleteCalendarEvent($idEvent: UUID!) {
                deleteCalendarEvent(idEvent: $idEvent)
            }`;

        return this.api.graphql<CalendarEventMutationResponse>(query, { idEvent }).pipe(
            map((res: any) => res.deleteCalendarEvent)
        );
    }

    cancelCalendarEvent(idEvent: string): Observable<boolean> {
        const query = `
            mutation CancelCalendarEvent($idEvent: UUID!) {
                cancelCalendarEvent(idEvent: $idEvent)
            }`;

        return this.api.graphql<CalendarEventMutationResponse>(query, { idEvent }).pipe(
            map((res: any) => res.cancelCalendarEvent)
        );
    }

    addParticipant(request: EventParticipantRequest): Observable<EventParticipantItem> {
        const query = `
            mutation AddParticipant($input: EventParticipantInput!) {
                addParticipant(eventParticipantInput: $input) {
                    id
                    idEvent
                    idStaff
                    staff {
                        id
                        person {
                            fullname
                        }
                    }
                    status
                }
            }`;

        return this.api.graphql<CalendarEventMutationResponse>(query, { input: request }).pipe(
            map((res: any) => res.addParticipant)
        );
    }

    updateParticipantStatus(idParticipant: string, status: number): Observable<EventParticipantItem> {
        const query = `
            mutation UpdateParticipantStatus($idParticipant: UUID!, $status: Int!) {
                updateParticipantStatus(idParticipant: $idParticipant, status: $status) {
                    id
                    status
                    respondedAt
                }
            }`;

        return this.api.graphql<CalendarEventMutationResponse>(query, { idParticipant, status }).pipe(
            map((res: any) => res.updateParticipantStatus)
        );
    }

    removeParticipant(idParticipant: string): Observable<string> {
        const query = `
            mutation RemoveParticipant($idParticipant: UUID!) {
                removeParticipant(idParticipant: $idParticipant)
            }`;

        return this.api.graphql<CalendarEventMutationResponse>(query, { idParticipant }).pipe(
            map((res: any) => res.removeParticipant)
        );
    }
}