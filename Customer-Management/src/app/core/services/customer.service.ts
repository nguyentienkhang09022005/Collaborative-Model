import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  CustomerRequest,
  CustomerResponse,
  CustomerByIdResponse,
  CustomerMutationResponse,
  CustomerDeleteResponse,
  UploadCustomerFileResponse,
  CustomerItem
} from "../models/customer.model";
import { HttpHeaders } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    constructor(private api: ApiService) {}

    GetListCustomer(): Observable<CustomerItem[]> {
        const query = `
            query {
                customers {
                    id
                    createdAt
                    person {
                        id
                        fullname
                        email
                        phone
                        location
                    }
                }
            }`;

        return this.api.graphql<CustomerResponse>(query).pipe(
            map(res => (res as any)?.customers ?? [])
        );
    }

    GetInfCustomer(idCustomer: string): Observable<CustomerItem | null> {
        const query = `
            query($id: UUID!) {
                customerById(idCustomer: $id) {
                    id
                    createdAt
                    person {
                        id
                        fullname
                        email
                        phone
                        location
                    }
                }
            }`;

        return this.api.graphql<CustomerByIdResponse>(query, { id: idCustomer }).pipe(
            map(res => (res as any)?.customerById?.[0] ?? null)
        );
    }

    createCustomer(customerRequest: CustomerRequest): Observable<CustomerItem> {
        const query = `
            mutation CreateCustomer($input: CustomerCreationRequestInput!) {
                createCustomer(request: $input) {
                    id
                    createdAt
                    person {
                        id
                        fullname
                        email
                        phone
                        location
                    }
                }
            }`;

        const input = {
            fullname: customerRequest.fullname,
            email: customerRequest.email,
            phone: customerRequest.phone,
            location: customerRequest.location
        };

        return this.api.graphql<CustomerMutationResponse>(query, { input }).pipe(
            map((res: any) => res.createCustomer)
        );
    }

    UpdateCustomer(customerRequest: CustomerRequest, idCustomer: string): Observable<CustomerItem> {
        const query = `
            mutation UpdateCustomer($id: UUID!, $input: CustomerUpdateRequestInput!) {
                updateCustomer(request: $input, idCustomer: $id) {
                    id
                    createdAt
                    person {
                        id
                        fullname
                        email
                        phone
                        location
                    }
                }
            }`;

        const input = {
            fullname: customerRequest.fullname,
            email: customerRequest.email,
            phone: customerRequest.phone,
            location: customerRequest.location
        };

        return this.api.graphql<CustomerMutationResponse>(query, { id: idCustomer, input }).pipe(
            map((res: any) => res.updateCustomer)
        );
    }

    DeleteCustomer(idCustomer: string): Observable<string> {
        const query = `
            mutation DeleteCustomer($id: UUID!) {
                deleteCustomer(idCustomer: $id)
            }`;

        return this.api.graphql<CustomerDeleteResponse>(query, { id: idCustomer }).pipe(
            map((res: any) => res.deleteCustomer)
        );
    }

    RestoreCustomer(idCustomer: string): Observable<CustomerItem> {
        const query = `
            mutation RestoreCustomer($id: UUID!) {
                restoreCustomer(idCustomer: $id) {
                    id
                    createdAt
                    person {
                        id
                        fullname
                        email
                        phone
                        location
                    }
                }
            }`;

        return this.api.graphql<CustomerMutationResponse>(query, { id: idCustomer }).pipe(
            map((res: any) => res.restoreCustomer)
        );
    }

    UploadExcelCustomer(file: File): Observable<string> {
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
        return this.api.Post<{ data: { importCustomerExcel: string } }>('graphql', formData, { headers }).pipe(
            map(res => res.data.importCustomerExcel)
        );
    }
}