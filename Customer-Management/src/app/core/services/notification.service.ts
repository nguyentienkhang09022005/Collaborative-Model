import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  NotificationItem,
  NotificationResponse,
  NotificationMutationResponse
} from "../models/notification.model";

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    constructor(private api: ApiService) {}

    GetNotifications(idStaff: string): Observable<NotificationItem[]> {
        const query = `
            query($idStaff: UUID!) {
                notifications(idStaff: $idStaff) {
                    idNotification
                    title
                    message
                    type
                    isRead
                    isPinned
                    createdAt
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
                }
            }`;

        return this.api.graphql<NotificationResponse>(query, { idStaff }).pipe(
            map(res => (res as any)?.notifications ?? [])
        );
    }

    GetUnreadNotifications(idStaff: string): Observable<NotificationItem[]> {
        const query = `
            query($idStaff: UUID!) {
                unreadNotifications(idStaff: $idStaff) {
                    idNotification
                    title
                    message
                    type
                    isRead
                    isPinned
                    createdAt
                    idStaff
                    relatedEntityType
                    relatedEntityId
                }
            }`;

        return this.api.graphql<NotificationResponse>(query, { idStaff }).pipe(
            map(res => (res as any)?.unreadNotifications ?? [])
        );
    }

    GetPinnedNotifications(idStaff: string): Observable<NotificationItem[]> {
        const query = `
            query($idStaff: UUID!) {
                pinnedNotifications(idStaff: $idStaff) {
                    idNotification
                    title
                    message
                    type
                    isRead
                    isPinned
                    createdAt
                }
            }`;

        return this.api.graphql<NotificationResponse>(query, { idStaff }).pipe(
            map(res => (res as any)?.pinnedNotifications ?? [])
        );
    }

    GetUnreadCount(idStaff: string): Observable<number> {
        const query = `
            query($idStaff: UUID!) {
                unreadCount(idStaff: $idStaff)
            }`;

        return this.api.graphql<{ data: { unreadCount: number } }>(query, { idStaff }).pipe(
            map(res => (res as any)?.unreadCount ?? 0)
        );
    }

    GetNotificationById(idNotification: string): Observable<NotificationItem | null> {
        const query = `
            query($idNotification: UUID!) {
                notificationById(idNotification: $idNotification) {
                    idNotification
                    title
                    message
                    type
                    isRead
                    isPinned
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
                }
            }`;

        return this.api.graphql<NotificationResponse>(query, { idNotification }).pipe(
            map(res => (res as any)?.notificationById?.[0] ?? null)
        );
    }

    markAsRead(idNotification: string): Observable<boolean> {
        const query = `
            mutation MarkAsRead($idNotification: UUID!) {
                markAsRead(idNotification: $idNotification)
            }`;

        return this.api.graphql<{ data: { markAsRead: boolean } }>(query, { idNotification }).pipe(
            map(res => (res as any)?.markAsRead ?? false)
        );
    }

    markAllAsRead(idStaff: string): Observable<boolean> {
        const query = `
            mutation MarkAllAsRead($idStaff: UUID!) {
                markAllAsRead(idStaff: $idStaff)
            }`;

        return this.api.graphql<{ data: { markAllAsRead: boolean } }>(query, { idStaff }).pipe(
            map(res => (res as any)?.markAllAsRead ?? false)
        );
    }

    pinNotification(idNotification: string): Observable<boolean> {
        const query = `
            mutation PinNotification($idNotification: UUID!) {
                pinNotification(idNotification: $idNotification)
            }`;

        return this.api.graphql<{ data: { pinNotification: boolean } }>(query, { idNotification }).pipe(
            map(res => (res as any)?.pinNotification ?? false)
        );
    }

    deleteNotification(idNotification: string): Observable<boolean> {
        const query = `
            mutation DeleteNotification($idNotification: UUID!) {
                deleteNotification(idNotification: $idNotification)
            }`;

        return this.api.graphql<{ data: { deleteNotification: boolean } }>(query, { idNotification }).pipe(
            map(res => (res as any)?.deleteNotification ?? false)
        );
    }
}