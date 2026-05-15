import { CustomerItem } from "./customer.model";
import { StaffItem } from "./staff.model";
//----------Request Models----------
export interface DealRequest
{
    title: string,
    content: string,
    price: number,
    idStaff: string,
    idCustomer: string
}

//----------Response Models----------
export interface DealResponse
{
    errors?: {
        message: string
    }[];
    data: {
        deals: DealItem[];
    }
}

export interface DealItem {
    idDeal: string,
    title: string,
    content: string,
    price: number,
    status: string,
    createdAt: Date,
    infCustomerResponse: CustomerItem,
    infStaffResponse: StaffItem,
}

export interface DealInfResponse
{
    errors?: {
        message: string
    }[];
    data: {
        dealById: DealItem[];
    }
}

export interface DealDeletionResponse
{
    errors?: {
        message: string
    }[];
    data: {
        deleteDeal: string;
    }
}

export interface DealUpdateResponse
{
    errors?: {
        message: string
    }[];
    data: {
        updateDeal: DealItem[];
    }
}
