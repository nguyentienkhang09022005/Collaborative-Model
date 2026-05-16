import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable, map } from "rxjs";
import { SearchCustomerResponse, SearchLeadResponse } from "../models/elasticsearch.model";

@Injectable({
    providedIn: 'root'
})

export class SearchService {
    constructor(private api : ApiService){}

    SearchLead(keyword: string): Observable<any>{
        const query = `
            query SearchLeads($keyword: String!) {
                searchLeads(keyword: $keyword) {
                    resource
                    createdAt
                    person {
                        fullname
                        email
                        phone
                        location
                    }
                }
            }`;

        return this.api.graphql<SearchLeadResponse>(query, { keyword }).pipe(
            map(res => (res as any)?.searchLeads ?? [])
        );
    }

    SearchCustomer(keyword: string): Observable<any>{
        const query = `
            query SearchCustomers($keyword: String!) {
                searchCustomers(keyword: $keyword) {
                    person {
                        fullname
                        email
                        phone
                        location
                    }
                }
            }`;

        return this.api.graphql<SearchCustomerResponse>(query, { keyword }).pipe(
            map(res => (res as any)?.searchCustomers ?? [])
        );
    }
}