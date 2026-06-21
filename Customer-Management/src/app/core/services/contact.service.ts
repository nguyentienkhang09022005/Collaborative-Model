import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  ContactRequest,
  ContactResponse,
  ContactByIdResponse,
  ContactMutationResponse,
  ContactDeleteResponse,
  ContactItem
} from "../models/contact.model";

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    constructor(private api: ApiService) {}

    GetListContact(): Observable<ContactItem[]> {
        const query = `
            query {
                contacts {
                    idContact
                    title
                    type
                    content
                    status
                    createdAt
                    updatedAt
                    lead {
                        id
                        resource
                        createdAt
                        person {
                            id
                            fullname
                            email
                            phone
                            location
                        }
                    }
                    staff {
                        id
                        username
                        role
                        createdAt
                        salary
                        person {
                            id
                            fullname
                            email
                            phone
                            location
                        }
                    }
                }
            }`;

        return this.api.graphql<ContactResponse>(query).pipe(
            map(res => (res as any)?.contacts ?? [])
        );
    }

    GetListContactPaged(page: number, pageSize: number): Observable<{ items: ContactItem[]; totalCount: number }> {
        const query = `
            query GetContactsPaged($page: Int!, $pageSize: Int!) {
                contactsPaged(page: $page, pageSize: $pageSize) {
                    items {
                        idContact
                        title
                        type
                        content
                        status
                        createdAt
                        updatedAt
                        lead {
                            id
                            resource
                            createdAt
                            person {
                                id
                                fullname
                                email
                                phone
                                location
                            }
                        }
                        staff {
                            id
                            username
                            role
                            createdAt
                            salary
                            person {
                                id
                                fullname
                                email
                                phone
                                location
                            }
                        }
                    }
                    totalCount
                }
            }`;

        return this.api.graphql<{ contactsPaged: { items: ContactItem[]; totalCount: number } }>(query, { page, pageSize }).pipe(
            map(res => res?.contactsPaged ?? { items: [], totalCount: 0 })
        );
    }

    GetInfContact(idContact: string): Observable<ContactItem | null> {
        const query = `
            query($id: UUID!) {
                contactById(idContact: $id) {
                    idContact
                    title
                    type
                    content
                    status
                    createdAt
                    updatedAt
                    lead {
                        id
                        resource
                        createdAt
                        person {
                            id
                            fullname
                            email
                            phone
                            location
                        }
                    }
                    staff {
                        id
                        username
                        role
                        createdAt
                        salary
                        person {
                            id
                            fullname
                            email
                            phone
                            location
                        }
                    }
                }
            }`;

        return this.api.graphql<ContactByIdResponse>(query, { id: idContact }).pipe(
            map(res => (res as any)?.contactById?.[0] ?? null)
        );
    }

    createContact(contactRequest: ContactRequest, idStaff: string, idLead: string): Observable<ContactItem> {
        const query = `
            mutation CreateContact($input: ContactCreationRequestInput!) {
                createContact(contactCreationRequest: $input) {
                    idContact
                    title
                    type
                    content
                    status
                    createdAt
                    lead {
                        id
                        resource
                        createdAt
                        person {
                            id
                            fullname
                            email
                            phone
                            location
                        }
                    }
                    staff {
                        id
                        username
                        role
                        createdAt
                        salary
                        person {
                            id
                            fullname
                            email
                            phone
                            location
                        }
                    }
                }
            }`;

        const input = {
            title: contactRequest.title,
            type: contactRequest.type,
            content: contactRequest.content,
            idStaff: idStaff,
            idLead: idLead
        };

        return this.api.graphql<ContactMutationResponse>(query, { input }).pipe(
            map((res: any) => res.createContact)
        );
    }

    UpdateContact(status: string, idContact: string): Observable<ContactItem> {
        const query = `
            mutation UpdateContact($id: UUID!, $input: ContactUpdateRequestInput!) {
                updateContact(contactUpdateRequest: $input, idContact: $id) {
                    idContact
                    title
                    type
                    content
                    status
                    createdAt
                    updatedAt
                    lead {
                        id
                        resource
                        createdAt
                        person {
                            id
                            fullname
                            email
                            phone
                            location
                        }
                    }
                    staff {
                        id
                        username
                        role
                        createdAt
                        salary
                        person {
                            id
                            fullname
                            email
                            phone
                            location
                        }
                    }
                }
            }`;

        const input = { status: status };

        return this.api.graphql<ContactMutationResponse>(query, { id: idContact, input }).pipe(
            map((res: any) => res.updateContact)
        );
    }

    DeleteContact(idContact: string): Observable<string> {
        const query = `
            mutation DeleteContact($id: UUID!) {
                deleteContact(idContact: $id)
            }`;

        return this.api.graphql<ContactDeleteResponse>(query, { id: idContact }).pipe(
            map((res: any) => res.deleteContact)
        );
    }
}