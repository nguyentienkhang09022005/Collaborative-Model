import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { ContactDeletionResponse, ContactInfResponse, ContactRequest, ContactResponse, ContactUpdateResponse } from "../models/contact.model";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    constructor(private api: ApiService) {}

    // List Contact
    GetListContact(): Observable<ContactResponse>{
        const query = {
            query: `
                query {
                    contacts {
                        idContact
                        title
                        type
                        status
                        createdAt
                    }
                }`
        };
        
        return this.api.post<ContactResponse>('graphql', query).pipe(
            tap(res => {
                return res;
            })
        );
    }

    GetInfContact(idContact: string): Observable<ContactInfResponse>{
        const query = {
            query: `
                query{
                    contactById(idContact: "${idContact}"){
                        title
                        type
                        content
                        status
                        createdAt
                        infLeadResponse {
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
                        infStaffResponse {
                            idStaff
                            fullname
                            email
                            role
                        }
                    }
                }`
        };
        
        return this.api.post<ContactInfResponse>('graphql', query).pipe(
            tap(res => {
                return res;
            })
        );
    }
    
    DeleteContact(idContact: string): Observable<ContactDeletionResponse>{
        const query = {
            query: `
                mutation DeleteContact {
                    deleteContact(idContact: "${idContact}")
                }`
        };
        
        return this.api.post<ContactDeletionResponse>('graphql', query).pipe(
            tap(res => {
                return res;
            })
        );
    }

    createContact(contactRequest: ContactRequest, idStaff: string, idLead: string): Observable<ContactResponse>{
        const query = {
            query: `
                mutation CreateContact {
                    createContact(contactCreationRequest: {
                        type: "${contactRequest.type}"
                        title: "${contactRequest.title}"
                        content: "${contactRequest.content}"
                        idStaff: "${idStaff}"
                        idLead: "${idLead}"
                    }) {
                        idContact
                        type
                        title
                        content
                        status
                        createdAt
                        infLeadResponse {
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
                        infStaffResponse {
                            idStaff
                            fullname
                            email
                            role
                            createdAt
                        }
                    }
                }`
            };
        
        return this.api.post<ContactResponse>('graphql', query).pipe(
            tap(res => {
                return res;
            })
        );
    }

    UpdateContact(status: string, idContact: string): Observable<ContactUpdateResponse>{
        const query = {
            query: `
                mutation UpdateContact {
                    updateContact(
                        contactUpdateRequest: {
                        status: "${status}"
                    },
                    idContact: "${idContact}"
                    ){
                        idContact
                        type
                        title
                        content
                        status
                        createdAt
                        infLeadResponse {
                            idLead
                            resource
                            createdAt
                            personResponse {
                                fullname
                                email
                            }
                        }
                        infStaffResponse {
                            fullname
                            email
                            role
                        }
                    }
                }`
            };

        return this.api.post<ContactUpdateResponse>('graphql', query).pipe(
            tap(res => {
                return res;
            })
        );
    }
}