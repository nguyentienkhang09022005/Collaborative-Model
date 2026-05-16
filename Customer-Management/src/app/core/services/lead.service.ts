import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  LeadRequest,
  LeadResponse,
  LeadByIdResponse,
  LeadMutationResponse,
  LeadDeleteResponse,
  UploadLeadFileResponse,
  LeadItem
} from "../models/lead.models";
import { HttpHeaders } from "@angular/common/http";

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
        const query = `
            mutation ImportLead($file: Upload!) {
                importLeadExcel(file: $file)
            }`;

        formData.append(
            "operations",
            JSON.stringify({
                query,
                variables: { file: null }
            })
        );

        formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
        formData.append("0", file);

        const headers = new HttpHeaders({
            "GraphQL-Preflight": "1"
        });
        return this.api.Post<{ data: { importLeadExcel: string } }>('graphql', formData, { headers }).pipe(
            map(res => res.data.importLeadExcel)
        );
    }
}