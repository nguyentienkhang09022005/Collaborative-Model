import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { LeadDeletionResponse, LeadInfResponse, LeadRequest, LeadResponse, LeadUpdateResponse, UploadLeadFileResponse } from "../models/lead.models";
import { Observable, tap, filter, map } from "rxjs";
import { HttpHeaders, HttpResponse } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})

export class LeadService {
    constructor(private api : ApiService){}

    // List Lead
    GetListLead(): Observable<LeadResponse>{
        const query = {
            query: `
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
                }`
        };
    
        return this.api.post<LeadResponse>('graphql', query).pipe(
            tap(res => {
                return res;
            })
        );
    }

    GetInfLead(idLead: string): Observable<LeadInfResponse>{
        const query = {
            query: `
                query{
                    leadById(idLead: "${idLead}"){
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
            }`
        };
    
        return this.api.post<LeadInfResponse>('graphql', query).pipe(
            tap(res => {
                return res;
            })
        );
    }

    createLead(leadRequest: LeadRequest): Observable<LeadResponse>{
        const query = {
            query: `
                mutation {
                    createLead(
                        leadCreationRequest: {
                            resource: "${leadRequest.resource}",
                            person: {
                                fullname: "${leadRequest.fullname}"
                                email: "${leadRequest.email}"
                                phone: "${leadRequest.phone}"
                                salary: ${leadRequest.salary}
                                location: "${leadRequest.location}"
                            }
                        }) {
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
                }`
        };
    
        return this.api.post<LeadResponse>('graphql', query).pipe(
            tap(res => {
                return res;
            })
        );
    }
    
    DeleteLead(idLead: string): Observable<LeadDeletionResponse>{
        const query = {
            query: `
                mutation {
                    deleteLead(idLead: "${idLead}")
                }`
        };
    
        return this.api.post<LeadDeletionResponse>('graphql', query).pipe(
            tap(res => {
                return res;
            })
        );
    }

    UpdateLead(leadRequest: LeadRequest, idLead: string): Observable<LeadUpdateResponse>{
        const query = {
            query: `
                mutation {
                    updateLead(
                        idLead: "${idLead}"
                        leadUpdateRequest: {
                            resource: "${leadRequest.resource}",
                            person: {
                                fullname: "${leadRequest.fullname}",
                                email: "${leadRequest.email}",
                                phone: "${leadRequest.phone}",
                                salary: ${leadRequest.salary},
                                location: "${leadRequest.location}"
                            }  
                        }) {
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
                }`
        };
    
        return this.api.post<LeadUpdateResponse>('graphql', query).pipe(
            tap(res => {
                return res;
            })
        );
    }

    UploadExcelLead(file: File): Observable<UploadLeadFileResponse>{
        const formData = new FormData();

        formData.append(
        "operations",
        JSON.stringify({
            query: `
                mutation ImportLead($file: Upload!) {
                    importLeadExcel(file: $file)
                }`,
                variables: { file: null }
            })
        );

        formData.append("map", JSON.stringify({ "0": ["variables.file"] }));

        formData.append("0", file);

        const headers = new HttpHeaders({
            "GraphQL-Preflight": "1"
        });
        return this.api.Post<UploadLeadFileResponse>('graphql', formData, { headers }).pipe(
            tap(res => {
                 return res
            })
        );
    }
}