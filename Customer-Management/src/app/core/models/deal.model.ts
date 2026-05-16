import { PersonInfo, StaffItem } from './staff.model';

export interface DealRequest {
  title: string;
  content?: string;
  price: number;
  idStaff: string;
  idCustomer: string;
}

export interface DealItem {
  idDeal: string;
  title: string;
  content?: string;
  price?: number;
  status?: string;
  createdAt: string;
  updatedAt?: string;
  customer: CustomerItem;
  staff: StaffItem;
}

export interface CustomerItem {
  id: string;
  createdAt: string;
  person: PersonInfo;
}

export interface DealResponse {
  errors?: { message: string }[];
  data: {
    deals: DealItem[];
  };
}

export interface DealByIdResponse {
  errors?: { message: string }[];
  data: {
    dealById: DealItem[];
  };
}

export interface DealMutationResponse {
  errors?: { message: string }[];
  data: {
    createDeal: DealItem;
    updateDeal: DealItem;
  };
}

export interface DealDeleteResponse {
  errors?: { message: string }[];
  data: {
    deleteDeal: string;
  };
}