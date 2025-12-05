import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable, tap } from "rxjs";
import { CustomerDeletionResponse, CustomerInfResponse, CustomerRequest, CustomerResponse, CustomerUpdateResponse, UploadCustomerFileResponse } from "../models/customer.model";
import { HttpHeaders } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})

export class CustomerService {
    constructor(private api : ApiService){}

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

    UploadExcelCustomer(file: File): Observable<UploadCustomerFileResponse>{
        const formData = new FormData();

        formData.append(
        "operations",
        JSON.stringify({
            query: `
                mutation ImportCustomer($file: Upload!) {
                    importCustomerExcel(file: $file)
                }`,
                variables: { file: null }
            })
        );

        formData.append("map", JSON.stringify({ "0": ["variables.file"] }));

        formData.append("0", file);

        const headers = new HttpHeaders({
            "GraphQL-Preflight": "1"
        });
        return this.api.Post<UploadCustomerFileResponse>('graphql', formData, { headers }).pipe(
            tap(res => {
                 return res
            })
        );
    }
}