import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { LeadDeletionResponse, LeadInfResponse, LeadRequest, LeadResponse, LeadUpdateResponse } from "../models/lead.models";
import { Observable, tap } from "rxjs";

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

    createLead(LeadRequest: LeadRequest): Observable<LeadResponse>{
        const query = {
            query: `
                mutation {
                    createLead(
                        leadCreationRequest: {
                            resource: "${LeadRequest.resource}",
                            person: {
                                fullname: "${LeadRequest.fullname}"
                                email: "${LeadRequest.email}"
                                phone: "${LeadRequest.phone}"
                                salary: ${LeadRequest.salary}
                                location: "${LeadRequest.location}"
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

    UpdateLead(LeadRequest: LeadRequest, idLead: string): Observable<LeadUpdateResponse>{
        const query = {
            query: `
                mutation {
                    updateLead(
                        idLead: "${idLead}"
                        leadUpdateRequest: {
                            resource: "${LeadRequest.resource}",
                            person: {
                                fullname: "${LeadRequest.fullname}",
                                email: "${LeadRequest.email}",
                                phone: "${LeadRequest.phone}",
                                salary: ${LeadRequest.salary},
                                location: "${LeadRequest.location}"
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
}