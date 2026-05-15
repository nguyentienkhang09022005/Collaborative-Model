import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable, tap } from "rxjs";
import { CustomerDeletionResponse, CustomerInfResponse, CustomerRequest, CustomerResponse, CustomerUpdateResponse, UploadCustomerFileResponse } from "../models/customer.model";
import { HttpHeaders } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    constructor(private api: ApiService) {}

    GetListCustomer(): Observable<CustomerResponse>{
        const query = `
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
            }`;

        return this.api.graphql<CustomerResponse>(query);
    }

    GetInfCustomer(idCustomer: string): Observable<CustomerInfResponse>{
        const query = `
            query($idCustomer: String!) {
                customerById(idCustomer: $idCustomer) {
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
            }`;

        return this.api.graphql<CustomerInfResponse>(query, { idCustomer });
    }

    createCustomer(customerRequest: CustomerRequest): Observable<CustomerResponse>{
        const query = `
            mutation CreateCustomer($input: CustomerCreationRequest!) {
                createCustomer(customerCreationRequest: $input) {
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
            }`;

        const input = {
            person: {
                fullname: customerRequest.fullname,
                email: customerRequest.email,
                phone: customerRequest.phone,
                salary: customerRequest.salary,
                location: customerRequest.location
            }
        };

        return this.api.graphql<CustomerResponse>(query, { input });
    }

    DeleteCustomer(idCustomer: string): Observable<CustomerDeletionResponse>{
        const query = `
            mutation DeleteCustomer($idCustomer: String!) {
                deleteCustomer(idCustomer: $idCustomer)
            }`;

        return this.api.graphql<CustomerDeletionResponse>(query, { idCustomer });
    }

    UpdateCustomer(customerRequest: CustomerRequest, idCustomer: string): Observable<CustomerUpdateResponse>{
        const query = `
            mutation UpdateCustomer($idCustomer: String!, $input: CustomerUpdateRequest!) {
                updateCustomer(idCustomer: $idCustomer, customerUpdateRequest: $input) {
                    idCustomer
                    personResponse {
                        fullname
                        email
                        phone
                        salary
                        location
                    }
                }
            }`;

        const input = {
            person: {
                fullname: customerRequest.fullname,
                email: customerRequest.email,
                phone: customerRequest.phone,
                salary: customerRequest.salary,
                location: customerRequest.location
            }
        };

        return this.api.graphql<CustomerUpdateResponse>(query, { idCustomer, input });
    }

    UploadExcelCustomer(file: File): Observable<UploadCustomerFileResponse>{
        const formData = new FormData();
        const query = `
            mutation ImportCustomer($file: Upload!) {
                importCustomerExcel(file: $file)
            }`;

        formData.append(
            "operations",
            JSON.stringify({
                query,
                variables: { file: null }
            })
        );

        formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
        formData.append("0", file);

        const headers = new HttpHeaders({
            "GraphQL-Preflight": "1"
        });
        return this.api.Post<UploadCustomerFileResponse>('graphql', formData, { headers });
    }
}
