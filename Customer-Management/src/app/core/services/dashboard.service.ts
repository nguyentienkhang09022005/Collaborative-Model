import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { ChartDeal, QuantityStatistics } from "../models/dashboard.model";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class DashboardService {
    constructor(private api : ApiService){}

    GetStatistics(): Observable<QuantityStatistics>{
        const query = {
            query: `
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
                }`
            };
        
        return this.api.post<QuantityStatistics>('graphql', query).pipe(
            tap(res => {
                return res;
            })
        );
    }

    GetChartDeal(): Observable<ChartDeal>{
        const query = {
            query: `
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
                }`
            };
        
        return this.api.post<ChartDeal>('graphql', query).pipe(
            tap(res => {
                return res;
            })
        );
    }
}