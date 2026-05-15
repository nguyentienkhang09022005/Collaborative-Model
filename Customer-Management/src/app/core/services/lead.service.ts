import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { LeadDeletionResponse, LeadInfResponse, LeadRequest, LeadResponse, LeadUpdateResponse, UploadLeadFileResponse } from "../models/lead.models";
import { Observable, tap } from "rxjs";
import { HttpHeaders } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class LeadService {
    constructor(private api: ApiService) {}

    GetListLead(): Observable<LeadResponse>{
        const query = `
            query {
                leads {
                    resource
                    idLead
                    createdAt
                    personResponse{
                        fullname
                        email
                        phone
                        salary
                        location
                    }
                }
            }`;

        return this.api.graphql<LeadResponse>(query);
    }

    GetInfLead(idLead: string): Observable<LeadInfResponse>{
        const query = `
            query($idLead: String!) {
                leadById(idLead: $idLead) {
                    idLead
                    resource
                    createdAt
                    personResponse{
                        fullname
                        email
                        phone
                        salary
                        location
                    }
                }
            }`;

        return this.api.graphql<LeadInfResponse>(query, { idLead });
    }

    createLead(leadRequest: LeadRequest): Observable<LeadResponse>{
        const query = `
            mutation CreateLead($input: LeadCreationRequest!) {
                createLead(leadCreationRequest: $input) {
                    idLead
                    resource
                    createdAt
                    personResponse {
                        fullname
                        email
                        phone
                        salary
                        location
                    }
                }
            }`;

        const input = {
            resource: leadRequest.resource,
            person: {
                fullname: leadRequest.fullname,
                email: leadRequest.email,
                phone: leadRequest.phone,
                salary: leadRequest.salary,
                location: leadRequest.location
            }
        };

        return this.api.graphql<LeadResponse>(query, { input });
    }

    DeleteLead(idLead: string): Observable<LeadDeletionResponse>{
        const query = `
            mutation DeleteLead($idLead: String!) {
                deleteLead(idLead: $idLead)
            }`;

        return this.api.graphql<LeadDeletionResponse>(query, { idLead });
    }

    UpdateLead(leadRequest: LeadRequest, idLead: string): Observable<LeadUpdateResponse>{
        const query = `
            mutation UpdateLead($idLead: String!, $input: LeadUpdateRequest!) {
                updateLead(idLead: $idLead, leadUpdateRequest: $input) {
                    idLead
                    resource
                    personResponse {
                        fullname
                        email
                        phone
                        salary
                        location
                    }
                }
            }`;

        const input = {
            resource: leadRequest.resource,
            person: {
                fullname: leadRequest.fullname,
                email: leadRequest.email,
                phone: leadRequest.phone,
                salary: leadRequest.salary,
                location: leadRequest.location
            }
        };

        return this.api.graphql<LeadUpdateResponse>(query, { idLead, input });
    }

    UploadExcelLead(file: File): Observable<UploadLeadFileResponse>{
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
        return this.api.Post<UploadLeadFileResponse>('graphql', formData, { headers });
    }
}