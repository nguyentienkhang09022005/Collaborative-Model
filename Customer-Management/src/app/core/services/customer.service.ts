import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import {
  CustomerRequest,
  CustomerResponse,
  CustomerByIdResponse,
  CustomerMutationResponse,
  CustomerDeleteResponse,
  ImportExcelResponse,
  CustomerItem
} from "../models/customer.model";
import { HttpErrorResponse } from "@angular/common/http";

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

    GetListCustomerPaged(page: number, pageSize: number): Observable<{ items: CustomerItem[]; totalCount: number }> {
        const query = `
            query GetCustomersPaged($page: Int!, $pageSize: Int!) {
                customersPaged(page: $page, pageSize: $pageSize) {
                    items {
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
                    totalCount
                }
            }`;

        return this.api.graphql<{ customersPaged: { items: CustomerItem[]; totalCount: number } }>(query, { page, pageSize }).pipe(
            map(res => res?.customersPaged ?? { items: [], totalCount: 0 })
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
        formData.append("file", file);

        return this.api.Post<ImportExcelResponse>('api/FileUpload/customer', formData).pipe(
            map(res => res.message),
            catchError((err: HttpErrorResponse) => {
                const message = err.error?.message || err.message || 'Failed to import customers';
                return throwError(() => new Error(message));
            })
        );
    }
}