import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  TaskRequest,
  TaskItem,
  TaskResponse,
  TaskByIdResponse,
  TaskMutationResponse
} from "../models/task.model";

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    constructor(private api: ApiService) {}

    GetTasks(): Observable<TaskItem[]> {
        const query = `
            query {
                tasks {
                    idTask
                    title
                    description
                    dueDate
                    priority
                    status
                    createdAt
                    updatedAt
                    isDeleted
                    idStaffAssigned
                    staffAssigned {
                        id
                        person {
                            id
                            fullname
                            email
                            phone
                            location
                        }
                    }
                    linkedEntityType
                    linkedEntityId
                }
            }`;

        return this.api.graphql<TaskResponse>(query).pipe(
            map(res => (res as any)?.tasks ?? [])
        );
    }

    GetTasksByStaff(idStaff: string): Observable<TaskItem[]> {
        const query = `
            query($idStaff: UUID!) {
                tasksByStaff(idStaff: $idStaff) {
                    idTask
                    title
                    description
                    dueDate
                    priority
                    status
                    createdAt
                    updatedAt
                    isDeleted
                    idStaffAssigned
                    staffAssigned {
                        id
                        person {
                            id
                            fullname
                            email
                            phone
                            location
                        }
                    }
                    linkedEntityType
                    linkedEntityId
                }
            }`;

        return this.api.graphql<TaskResponse>(query, { idStaff }).pipe(
            map(res => (res as any)?.tasksByStaff ?? [])
        );
    }

    GetTasksByStatus(status: number): Observable<TaskItem[]> {
        const query = `
            query($status: Int!) {
                tasksByStatus(status: $status) {
                    idTask
                    title
                    description
                    dueDate
                    priority
                    status
                    createdAt
                    updatedAt
                    isDeleted
                    idStaffAssigned
                    staffAssigned {
                        id
                        person {
                            id
                            fullname
                            email
                            phone
                            location
                        }
                    }
                    linkedEntityType
                    linkedEntityId
                }
            }`;

        return this.api.graphql<TaskResponse>(query, { status }).pipe(
            map(res => (res as any)?.tasksByStatus ?? [])
        );
    }

    GetTaskById(idTask: string): Observable<TaskItem | null> {
        const query = `
            query($idTask: UUID!) {
                taskById(idTask: $idTask) {
                    idTask
                    title
                    description
                    dueDate
                    priority
                    status
                    createdAt
                    updatedAt
                    isDeleted
                    idStaffAssigned
                    staffAssigned {
                        id
                        person {
                            id
                            fullname
                            email
                            phone
                            location
                        }
                    }
                    linkedEntityType
                    linkedEntityId
                }
            }`;

        return this.api.graphql<TaskByIdResponse>(query, { idTask }).pipe(
            map(res => (res as any)?.taskById ?? null)
        );
    }

    createTask(request: TaskRequest): Observable<TaskItem> {
        const query = `
            mutation CreateTask($input: TaskInput!) {
                createTask(input: $input) {
                    idTask
                    title
                    description
                    dueDate
                    priority
                    status
                    createdAt
                    idStaffAssigned
                    linkedEntityType
                    linkedEntityId
                }
            }`;

        const input: Record<string, unknown> = {
            title: request.title,
            description: request.description || null,
            dueDate: request.dueDate || null,
            priority: request.priority,
            status: request.status,
            idStaffAssigned: request.idStaffAssigned || null,
            linkedEntityType: request.linkedEntityType || null,
            linkedEntityId: request.linkedEntityId || null
        };

        return this.api.graphql<TaskMutationResponse>(query, { input }).pipe(
            map((res: any) => res.createTask)
        );
    }

    updateTask(idTask: string, request: Partial<TaskRequest>): Observable<TaskItem> {
        const query = `
            mutation UpdateTask($idTask: UUID!, $input: TaskUpdateInput!) {
                updateTask(idTask: $idTask, input: $input) {
                    idTask
                    title
                    description
                    dueDate
                    priority
                    status
                    updatedAt
                    idStaffAssigned
                    linkedEntityType
                    linkedEntityId
                }
            }`;

        const input: Record<string, unknown> = {};
        if (request['title'] !== undefined) input['title'] = request['title'];
        if (request['description'] !== undefined) input['description'] = request['description'];
        if (request['dueDate'] !== undefined) input['dueDate'] = request['dueDate'];
        if (request['priority'] !== undefined) input['priority'] = request['priority'];
        if (request['status'] !== undefined) input['status'] = request['status'];
        if (request['idStaffAssigned'] !== undefined) input['idStaffAssigned'] = request['idStaffAssigned'];
        if (request['linkedEntityType'] !== undefined) input['linkedEntityType'] = request['linkedEntityType'];
        if (request['linkedEntityId'] !== undefined) input['linkedEntityId'] = request['linkedEntityId'];

        return this.api.graphql<TaskMutationResponse>(query, { idTask, input }).pipe(
            map((res: any) => res.updateTask)
        );
    }

    deleteTask(idTask: string): Observable<string> {
        const query = `
            mutation DeleteTask($idTask: UUID!) {
                deleteTask(idTask: $idTask)
            }`;

        return this.api.graphql<TaskMutationResponse>(query, { idTask }).pipe(
            map((res: any) => res.deleteTask)
        );
    }

    restoreTask(idTask: string): Observable<TaskItem> {
        const query = `
            mutation RestoreTask($idTask: UUID!) {
                restoreTask(idTask: $idTask) {
                    idTask
                    title
                    description
                    dueDate
                    priority
                    status
                    createdAt
                    updatedAt
                    isDeleted
                }
            }`;

        return this.api.graphql<TaskMutationResponse>(query, { idTask }).pipe(
            map((res: any) => res.restoreTask)
        );
    }

    assignTask(idTask: string, idStaff: string): Observable<TaskItem> {
        const query = `
            mutation AssignTask($idTask: UUID!, $idStaff: UUID!) {
                assignTask(idTask: $idTask, idStaff: $idStaff) {
                    idTask
                    title
                    idStaffAssigned
                    staffAssigned {
                        id
                        person {
                            fullname
                        }
                    }
                }
            }`;

        return this.api.graphql<TaskMutationResponse>(query, { idTask, idStaff }).pipe(
            map((res: any) => res.assignTask)
        );
    }

    updateTaskStatus(idTask: string, status: string): Observable<TaskItem> {
        const query = `
            mutation UpdateTaskStatus($idTask: UUID!, $status: Int!) {
                updateTaskStatus(idTask: $idTask, status: $status) {
                    idTask
                    title
                    status
                    updatedAt
                }
            }`;

        // Map string status to int for backend
        const statusMap: Record<string, number> = {
            'PENDING': 0,
            'IN_PROGRESS': 1,
            'COMPLETED': 2,
            'CANCELED': 3
        };
        const statusInt = statusMap[status] ?? 0;

        return this.api.graphql<TaskMutationResponse>(query, { idTask, status: statusInt }).pipe(
            map((res: any) => res.updateTaskStatus)
        );
    }
}