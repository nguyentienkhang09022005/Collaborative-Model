import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable, tap } from "rxjs";
import { SearchCustomerResponse, SearchLeadResponse } from "../models/elasticsearch.model";

@Injectable({
    providedIn: 'root'
})

export class SearchService {
    constructor(private api : ApiService){}

    SearchLead(keyword: string): Observable<SearchLeadResponse>{
        const query = {
            query: `
                query {
                    searchLeads(keyword: "${keyword}") {
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
        
        return this.api.post<SearchLeadResponse>('graphql', query).pipe(
            tap(res => {
                return res;
            })
        );
    }

    SearchCustomer(keyword: string): Observable<SearchCustomerResponse>{
        const query = {
            query: `
                query {
                    searchCustomers(keyword: "${keyword}") {
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
        
        return this.api.post<SearchCustomerResponse>('graphql', query).pipe(
            tap(res => {
                return res;
            })
        );
    }
}