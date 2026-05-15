import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { DealDeletionResponse, DealInfResponse, DealRequest, DealResponse, DealUpdateResponse } from "../models/deal.model";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DealService {
    constructor(private api: ApiService) {}

    GetListDeal(): Observable<DealResponse>{
        const query = `
            query {
                deals {
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
            }`;

        return this.api.graphql<DealResponse>(query);
    }

    GetInfDeal(idDeal: string): Observable<DealInfResponse>{
        const query = `
            query($idDeal: String!) {
                dealById(idDeal: $idDeal) {
                    idDeal
                    title
                    content
                    price
                    status
                    createdAt
                    infCustomerResponse {
                        idCustomer
                        createdAt
                        personResponse {
                            fullname
                            email
                            phone
                            location
                            salary
                        }
                    }
                    infStaffResponse {
                        idStaff
                        fullname
                        email
                        role
                    }
                }
            }`;

        return this.api.graphql<DealInfResponse>(query, { idDeal });
    }

    DeleteDeal(idDeal: string): Observable<DealDeletionResponse>{
        const query = `
            mutation DeleteDeal($idDeal: String!) {
                deleteDeal(idDeal: $idDeal)
            }`;

        return this.api.graphql<DealDeletionResponse>(query, { idDeal });
    }

    createDeal(dealRequest: DealRequest, idStaff: string, idCustomer: string): Observable<DealResponse>{
        const query = `
            mutation CreateDeal($input: DealCreationRequest!) {
                createDeal(dealCreationRequest: $input) {
                    idDeal
                    title
                    price
                    createdAt
                    infCustomerResponse {
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
                    infStaffResponse {
                        idStaff
                        fullname
                        email
                        role
                        createdAt
                    }
                }
            }`;

        const input = {
            title: dealRequest.title,
            content: dealRequest.content,
            price: dealRequest.price,
            idStaff,
            idCustomer
        };

        return this.api.graphql<DealResponse>(query, { input });
    }

    UpdateDeal(status: string, idDeal: string): Observable<DealUpdateResponse>{
        const query = `
            mutation UpdateDeal($idDeal: String!, $input: DealUpdateRequest!) {
                updateDeal(idDeal: $idDeal, dealUpdateRequest: $input) {
                    idDeal
                    title
                    status
                    price
                    infCustomerResponse {
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
                    infStaffResponse {
                        idStaff
                        fullname
                        email
                        role
                        createdAt
                    }
                }
            }`;

        const input = { status };

        return this.api.graphql<DealUpdateResponse>(query, { idDeal, input });
    }
}