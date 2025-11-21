import { InfStaff } from "./auth.models";
import { LeadItem } from "./lead.models";
//----------Request Models----------


//----------Response Models----------
export interface ContactResponse
{
    errors?: {
        message: string
    }[];
    data: {
        contacts: ContactItem[];
    }
}

export interface ContactItem {
    idContact: string
    title: string
    type: string;
    content: string,
    status: string,
    createdAt: Date,
    infLeadResponse: LeadItem,
    infStaffResponse: InfStaff,
}

export interface ContactDeletionResponse
{
    errors?: {
        message: string
    }[];
    data: {
        deleteContact: string;
    }
}
