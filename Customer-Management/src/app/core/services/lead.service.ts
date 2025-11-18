import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { LeadResponse } from "../models/lead.models";
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
}