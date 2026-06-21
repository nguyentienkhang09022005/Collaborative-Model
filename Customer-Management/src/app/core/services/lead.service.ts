import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import {
  LeadRequest,
  LeadResponse,
  LeadByIdResponse,
  LeadMutationResponse,
  LeadDeleteResponse,
  ImportExcelResponse,
  LeadItem
} from "../models/lead.models";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class LeadService {
    constructor(private api: ApiService) {}

    GetListLead(): Observable<LeadItem[]> {
        const query = `
            query {
                leads {
                    id
                    createdAt
                    resource
                    person {
                        id
                        fullname
                        email
                        phone
                        location
                    }
                }
            }`;

        return this.api.graphql<LeadResponse>(query).pipe(
            map(res => (res as any)?.leads ?? [])
        );
    }

    GetListLeadPaged(page: number, pageSize: number): Observable<{ items: LeadItem[]; totalCount: number }> {
        const query = `
            query GetLeadsPaged($page: Int!, $pageSize: Int!) {
                leadsPaged(page: $page, pageSize: $pageSize) {
                    items {
                        id
                        createdAt
                        resource
                        person {
                            id
                            fullname
                            email
                            phone
                            location
                        }
                    }
                    totalCount
                }
            }`;

        return this.api.graphql<{ leadsPaged: { items: LeadItem[]; totalCount: number } }>(query, { page, pageSize }).pipe(
            map(res => res?.leadsPaged ?? { items: [], totalCount: 0 })
        );
    }

    GetInfLead(idLead: string): Observable<LeadItem | null> {
        const query = `
            query($id: UUID!) {
                leadById(idLead: $id) {
                    id
                    createdAt
                    resource
                    person {
                        id
                        fullname
                        email
                        phone
                        location
                    }
                }
            }`;

        return this.api.graphql<LeadByIdResponse>(query, { id: idLead }).pipe(
            map(res => (res as any)?.leadById?.[0] ?? null)
        );
    }

    createLead(leadRequest: LeadRequest): Observable<LeadItem> {
        const query = `
            mutation CreateLead($input: LeadCreationRequestInput!) {
                createLead(leadCreationRequest: $input) {
                    id
                    createdAt
                    resource
                    person {
                        id
                        fullname
                        email
                        phone
                        location
                    }
                }
            }`;

        const input = {
            fullname: leadRequest.fullname,
            email: leadRequest.email,
            phone: leadRequest.phone,
            location: leadRequest.location,
            resource: leadRequest.resource
        };

        return this.api.graphql<LeadMutationResponse>(query, { input }).pipe(
            map((res: any) => res.createLead)
        );
    }

    UpdateLead(leadRequest: LeadRequest, idLead: string): Observable<LeadItem> {
        const query = `
            mutation UpdateLead($id: UUID!, $input: LeadUpdateRequestInput!) {
                updateLead(leadUpdateRequest: $input, idLead: $id) {
                    id
                    createdAt
                    resource
                    person {
                        id
                        fullname
                        email
                        phone
                        location
                    }
                }
            }`;

        const input = {
            fullname: leadRequest.fullname,
            email: leadRequest.email,
            phone: leadRequest.phone,
            location: leadRequest.location,
            resource: leadRequest.resource
        };

        return this.api.graphql<LeadMutationResponse>(query, { id: idLead, input }).pipe(
            map((res: any) => res.updateLead)
        );
    }

    DeleteLead(idLead: string): Observable<string> {
        const query = `
            mutation DeleteLead($id: UUID!) {
                deleteLead(idLead: $id)
            }`;

        return this.api.graphql<LeadDeleteResponse>(query, { id: idLead }).pipe(
            map((res: any) => res.deleteLead)
        );
    }

    RestoreLead(idLead: string): Observable<LeadItem> {
        const query = `
            mutation RestoreLead($id: UUID!) {
                restoreLead(idLead: $id) {
                    id
                    createdAt
                    resource
                    person {
                        id
                        fullname
                        email
                        phone
                        location
                    }
                }
            }`;

        return this.api.graphql<LeadMutationResponse>(query, { id: idLead }).pipe(
            map((res: any) => res.restoreLead)
        );
    }

    UploadExcelLead(file: File): Observable<string> {
        const formData = new FormData();
        formData.append("file", file);

        return this.api.Post<ImportExcelResponse>('api/FileUpload/lead', formData).pipe(
            map(res => res.message),
            catchError((err: HttpErrorResponse) => {
                const message = err.error?.message || err.message || 'Failed to import leads';
                return throwError(() => new Error(message));
            })
        );
    }
}