export interface StatisticsItem {
  totalProfit: number;
  quantityDeals: number;
  quantityContacts: number;
  quantityCustomers: number;
  quantityLeads: number;
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