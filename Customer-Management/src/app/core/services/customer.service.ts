import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable, tap } from "rxjs";
import { CustomerResponse } from "../models/customer.model";

@Injectable({
    providedIn: 'root'
})

export class CustomerService {
    constructor(private api : ApiService){}

    // List Customer
    GetListCustomer(): Observable<CustomerResponse>{
        const query = {
            query: `
                query {
                    customers {
                        idCustomer
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
    
        return this.api.post<CustomerResponse>('graphql', query).pipe(
            tap(res => {
                return res;
            })
        );
    }

    GetInfCustomer(idCustomer: string): Observable<CustomerResponse>{
        const query = {
            query: `
                query{
                    customerById(idCustomer: "${idCustomer}"){
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
    
        return this.api.post<CustomerResponse>('graphql', query).pipe(
            tap(res => {
                return res;
            })
        );
    }
}