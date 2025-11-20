import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable, tap } from "rxjs";
import { CustomerDeletionResponse, CustomerInfResponse, CustomerRequest, CustomerResponse, CustomerUpdateResponse } from "../models/customer.model";

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

    GetInfCustomer(idCustomer: string): Observable<CustomerInfResponse>{
        const query = {
            query: `
                query{
                    customerById(idCustomer: "${idCustomer}"){
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
    
        return this.api.post<CustomerInfResponse>('graphql', query).pipe(
            tap(res => {
                return res;
            })
        );
    }

    createCustomer(customerRequest: CustomerRequest): Observable<CustomerResponse>{
        const query = {
            query: `
                mutation {
                    createCustomer(
                        customerCreationRequest: {
                            person: {
                                fullname: "${customerRequest.fullname}"
                                email: "${customerRequest.email}"
                                phone: "${customerRequest.phone}"
                                salary: ${customerRequest.salary}
                                location: "${customerRequest.location}"
                            }
                        }) {
                        idCustomer
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
    
        return this.api.post<CustomerResponse>('graphql', query).pipe(
            tap(res => {
                return res;
            })
        );
    }
    
    DeleteCustomer(idCustomer: string): Observable<CustomerDeletionResponse>{
        const query = {
            query: `
                mutation {
                    deleteCustomer(idCustomer: "${idCustomer}")
                }`
        };
    
        return this.api.post<CustomerDeletionResponse>('graphql', query).pipe(
            tap(res => {
                return res;
            })
        );
    }

    UpdateCustomer(customerRequest: CustomerRequest, idCustomer: string): Observable<CustomerUpdateResponse>{
        const query = {
            query: `
                mutation {
                    updateCustomer(
                        idCustomer: "${idCustomer}"
                        customerUpdateRequest: {
                            person: {
                                fullname: "${customerRequest.fullname}",
                                email: "${customerRequest.email}",
                                phone: "${customerRequest.phone}",
                                salary: ${customerRequest.salary},
                                location: "${customerRequest.location}"
                            }  
                        }) {
                        idCustomer
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
    
        return this.api.post<CustomerUpdateResponse>('graphql', query).pipe(
            tap(res => {
                return res;
            })
        );
    }
}