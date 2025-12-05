export interface QuantityStatistics
{
    errors?: {
        message: string
    }[];
    data: {
        statistics: StatisticsItem;
    }
}

export interface ChartDeal
{
    errors?: {
        message: string
    }[];
    data: {
        chartDeal: ChartDealItem;
    }
}

export interface StatisticsItem {
    totalProfit: number,
    quantityDeals: number,
    quantityContacts: number
    quantityCustomers: number
    quantityLeads: number
    quantityStatisticsDetailContactResponse: DetailQuantityContact;
    quantityStatisticsDetailDealResponse: DetailQuantityDeal;
}

export interface DetailQuantityContact {
    quantityContactsPending: number,
    quantityContactsInProgress: number,
    quantityContactsDone: number,
    quantityContactsCancel: number,
    quantityContactsFailed: number
}

export interface DetailQuantityDeal {
    quantityDealsPending: number,
    quantityDealsWon: number,
    quantityDealsLost: number
}

export interface ChartDealItem {
    successfullDealValues: number;
    failedDealValues: number;
    listSuccessfullDeal: ListSuccessfullDeal[];
    listFailedDeal: ListFailedDeal[];
}

export interface ListSuccessfullDeal {
    idDeal: string;
    price: number;
    status: string;
    createdAt: Date;
}

export interface ListFailedDeal {
    idDeal: string;
    price: number;
    status: string;
    createdAt: Date;
}