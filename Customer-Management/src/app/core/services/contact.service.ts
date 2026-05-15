import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { ContactDeletionResponse, ContactInfResponse, ContactRequest, ContactResponse, ContactUpdateResponse } from "../models/contact.model";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    constructor(private api: ApiService) {}

    GetListContact(): Observable<ContactResponse>{
        const query = `
            query {
                contacts {
                    idContact
                    title
                    type
                    status
                    createdAt
                }
            }`;

        return this.api.graphql<ContactResponse>(query);
    }

    GetInfContact(idContact: string): Observable<ContactInfResponse>{
        const query = `
            query($idContact: String!) {
                contactById(idContact: $idContact) {
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
            }`;

        return this.api.graphql<ContactInfResponse>(query, { idContact });
    }

    DeleteContact(idContact: string): Observable<ContactDeletionResponse>{
        const query = `
            mutation DeleteContact($idContact: String!) {
                deleteContact(idContact: $idContact)
            }`;

        return this.api.graphql<ContactDeletionResponse>(query, { idContact });
    }

    createContact(contactRequest: ContactRequest, idStaff: string, idLead: string): Observable<ContactResponse>{
        const query = `
            mutation CreateContact($input: ContactCreationRequest!) {
                createContact(contactCreationRequest: $input) {
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
            }`;

        const input = {
            type: contactRequest.type,
            title: contactRequest.title,
            content: contactRequest.content,
            idStaff,
            idLead
        };

        return this.api.graphql<ContactResponse>(query, { input });
    }

    UpdateContact(status: string, idContact: string): Observable<ContactUpdateResponse>{
        const query = `
            mutation UpdateContact($idContact: String!, $status: String!) {
                updateContact(contactUpdateRequest: { status: $status }, idContact: $idContact) {
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
            }`;

        return this.api.graphql<ContactUpdateResponse>(query, { idContact, status });
    }
}