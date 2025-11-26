import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { DealDeletionResponse, DealInfResponse, DealRequest, DealResponse, DealUpdateResponse } from "../models/dead.model";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class DealService {
    constructor(private api: ApiService) {}

    // List Deal
    GetListDeal(): Observable<DealResponse>{
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

    GetInfDeal(idDeal: string): Observable<DealInfResponse>{
        const query = {
            query: `
                query {
                    dealById(idDeal: "${idDeal}"){
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
                }`
            };
            
        return this.api.post<DealInfResponse>('graphql', query).pipe(
            tap(res => {
                return res;
            })
        );
    }
        
    DeleteDeal(idDeal: string): Observable<DealDeletionResponse>{
        const query = {
            query: `
                mutation {
                    deleteDeal(idDeal: "${idDeal}")
                }`
            };
            
        return this.api.post<DealDeletionResponse>('graphql', query).pipe(
            tap(res => {
                return res;
            })
        );
    }

    createDeal(dealRequest: DealRequest, idStaff: string, idCustomer: string): Observable<DealResponse>{
        const query = {
            query: `
                mutation {
                    createDeal(
                        dealCreationRequest: {
                            title: "${dealRequest.title}"
                            content: "${dealRequest.content}"
                            price: ${dealRequest.price}
                            idStaff: "${idStaff}"
                            idCustomer: "${idCustomer}"
                        }) {
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
                }`
            };
            
        return this.api.post<DealResponse>('graphql', query).pipe(
            tap(res => {
                return res;
            })
        );
    }
    
    UpdateDeal(status: string, idDeal: string): Observable<DealUpdateResponse>{
        const query = {
            query: `
                mutation {
                    updateDeal(
                        idDeal: "${idDeal}",
                        dealUpdateRequest: {
                            status: "${status}"
                        }) {
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
                }`
            };
        return this.api.post<DealUpdateResponse>('graphql', query).pipe(
            tap(res => {
                return res;
            })
        );
    }
}