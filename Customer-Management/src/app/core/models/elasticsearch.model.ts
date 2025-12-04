import { CustomerItem } from "./customer.model";
import { LeadItem } from "./lead.models";

//----------Request Models----------
export interface SearchRequest {
    keyword: string;
}

//----------Response Models----------
export interface SearchLeadResponse
{
    errors?: {
        message: string
    }[];
    data: {
        searchLeads: LeadItem[];
    }
}

export interface SearchCustomerResponse
{
    errors?: {
        message: string
    }[];
    data: {
        searchCustomers: CustomerItem[];
    }
}