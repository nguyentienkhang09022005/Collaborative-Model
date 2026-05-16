import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface StatisticsResponse {
  errors?: { message: string }[];
  data: {
    statistics: StatisticsItem;
  };
}

export interface ChartDealResponse {
  errors?: { message: string }[];
  data: {
    chartDeal: ChartDealItem;
  };
}

export interface StatisticsItem {
  totalProfit: number;
  quantityDeals: number;
  quantityCustomers: number;
  quantityLeads: number;
  quantityContacts: number;
  quantityStatisticsDetailContactResponse: DetailQuantityContact;
  quantityStatisticsDetailDealResponse: DetailQuantityDeal;
}

export interface DetailQuantityContact {
  quantityContactsPending: number;
  quantityContactsInProgress: number;
  quantityContactsDone: number;
  quantityContactsCancel: number;
  quantityContactsFailed: number;
}

export interface DetailQuantityDeal {
  quantityDealsPending: number;
  quantityDealsWon: number;
  quantityDealsLost: number;
}

export interface ChartDealItem {
  successfullDealValue: number;
  failedDealValue: number;
  listSuccessfullDeal: ListDealItem[];
  listFailedDeal: ListDealItem[];
}

export interface ListDealItem {
  idDeal: string;
  price: number;
  status: string;
  createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    constructor(private api: ApiService) {}

    GetStatistics(): Observable<StatisticsItem> {
        const query = `
            query {
                statistics {
                    totalProfit
                    quantityDeals
                    quantityCustomers
                    quantityLeads
                    quantityContacts
                    quantityStatisticsDetailContactResponse {
                        quantityContactsPending
                        quantityContactsInProgress
                        quantityContactsDone
                        quantityContactsCancel
                        quantityContactsFailed
                    }
                    quantityStatisticsDetailDealResponse {
                        quantityDealsPending
                        quantityDealsWon
                        quantityDealsLost
                    }
                }
            }`;

        return this.api.graphql<StatisticsResponse>(query).pipe(
            map(res => (res as any)?.statistics ?? {} as StatisticsItem)
        );
    }

    GetChartDeal(): Observable<ChartDealItem> {
        const query = `
            query {
                chartDeal {
                    successfullDealValue
                    failedDealValue
                    listSuccessfullDeal {
                        idDeal
                        price
                        status
                        createdAt
                    }
                    listFailedDeal {
                        idDeal
                        price
                        status
                        createdAt
                    }
                }
            }`;

        return this.api.graphql<ChartDealResponse>(query).pipe(
            map(res => (res as any)?.chartDeal ?? {} as ChartDealItem)
        );
    }
}