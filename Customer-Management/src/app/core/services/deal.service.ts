import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { DealResponse } from "../models/dead.model";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class DealService {
    constructor(private api: ApiService) {}

    // List Contact
    GetListContact(): Observable<DealResponse>{
        const query = {
            query: `
                query {
                    deals{
                        idDeal
                        title
                        content
                        price
                        createdAt
                        status
                        infCustomerResponse {
                            idCustomer
                            createdAt
                            personResponse {
                                fullname
                                email
                                phone
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
            
        return this.api.post<DealResponse>('graphql', query).pipe(
            tap(res => {
                return res;
            })
        );
    }
}