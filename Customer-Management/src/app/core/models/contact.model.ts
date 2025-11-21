import { LeadItem } from "./lead.models";
import { StaffItem } from "./staff.model";
//----------Request Models----------
export interface ContactRequest
{
    type: string,
    title: string,
    content: string,
    idStaff: string,
    idLead: string
}

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
    idContact: string,
    title: string,
    type: string,
    content: string,
    status: string,
    createdAt: Date,
    infLeadResponse: LeadItem,
    infStaffResponse: StaffItem,
}

export interface ContactInfResponse
{
    errors?: {
        message: string
    }[];
    data: {
        contactById: ContactItem[];
    }
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
