import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  DealRequest,
  DealResponse,
  DealByIdResponse,
  DealMutationResponse,
  DealDeleteResponse,
  DealItem
} from "../models/deal.model";

@Injectable({
    providedIn: 'root'
})
export class DealService {
    constructor(private api: ApiService) {}

    GetListDeal(): Observable<DealItem[]> {
        const query = `
            query {
                deals {
                    idDeal
                    title
                    content
                    price
                    status
                    createdAt
                    updatedAt
                    customer {
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
                    staff {
                        id
                        username
                        role
                        createdAt
                        salary
                        person {
                            id
                            fullname
                            email
                            phone
                            location
                        }
                    }
                }
            }`;

        return this.api.graphql<DealResponse>(query).pipe(
            map(res => (res as any)?.deals ?? [])
        );
    }

    // STAFF dùng - lấy deals của mình (OWNER và MEMBER)
    GetMyDeals(): Observable<DealItem[]> {
        const query = `
            query {
                myDeals {
                    idDeal
                    title
                    content
                    price
                    status
                    createdAt
                    updatedAt
                    customer {
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
                    staff {
                        id
                        username
                        role
                        createdAt
                        salary
                        person {
                            id
                            fullname
                            email
                            phone
                            location
                        }
                    }
                }
            }`;

        return this.api.graphql<DealResponse>(query).pipe(
            map(res => (res as any)?.myDeals ?? [])
        );
    }

    GetInfDeal(idDeal: string): Observable<DealItem | null> {
        const query = `
            query($id: UUID!) {
                dealById(idDeal: $id) {
                    idDeal
                    title
                    content
                    price
                    status
                    createdAt
                    updatedAt
                    customer {
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
                    staff {
                        id
                        username
                        role
                        createdAt
                        salary
                        person {
                            id
                            fullname
                            email
                            phone
                            location
                        }
                    }
                }
            }`;

        return this.api.graphql<DealByIdResponse>(query, { id: idDeal }).pipe(
            map(res => (res as any)?.dealById?.[0] ?? null)
        );
    }

    createDeal(dealRequest: DealRequest, idStaff: string, idCustomer: string): Observable<DealItem> {
        const query = `
            mutation CreateDeal($input: DealCreationRequestInput!) {
                createDeal(dealCreationRequest: $input) {
                    idDeal
                    title
                    content
                    price
                    status
                    createdAt
                    customer {
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
                    staff {
                        id
                        username
                        role
                        createdAt
                        salary
                        person {
                            id
                            fullname
                            email
                            phone
                            location
                        }
                    }
                }
            }`;

        const input = {
            title: dealRequest.title,
            content: dealRequest.content,
            price: dealRequest.price,
            idStaff: idStaff,
            idCustomer: idCustomer
        };

        return this.api.graphql<DealMutationResponse>(query, { input }).pipe(
            map((res: any) => res.createDeal)
        );
    }

    UpdateDeal(status: string, idDeal: string): Observable<DealItem> {
        const query = `
            mutation UpdateDeal($id: UUID!, $input: DealUpdateRequestInput!) {
                updateDeal(dealUpdateRequest: $input, idDeal: $id) {
                    idDeal
                    title
                    content
                    price
                    status
                    createdAt
                    updatedAt
                    customer {
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
                    staff {
                        id
                        username
                        role
                        createdAt
                        salary
                        person {
                            id
                            fullname
                            email
                            phone
                            location
                        }
                    }
                }
            }`;

        const input = { status: status };

        return this.api.graphql<DealMutationResponse>(query, { id: idDeal, input }).pipe(
            map((res: any) => res.updateDeal)
        );
    }

    DeleteDeal(idDeal: string): Observable<string> {
        const query = `
            mutation DeleteDeal($id: UUID!) {
                deleteDeal(idDeal: $id)
            }`;

        return this.api.graphql<DealDeleteResponse>(query, { id: idDeal }).pipe(
            map((res: any) => res.deleteDeal)
        );
    }
}