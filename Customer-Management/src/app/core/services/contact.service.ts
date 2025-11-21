import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { ContactDeletionResponse, ContactResponse } from "../models/contact.model";
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
}