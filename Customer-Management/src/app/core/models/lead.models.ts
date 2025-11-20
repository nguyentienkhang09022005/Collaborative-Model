export interface LeadRequest
{
    idLead: string,
    resource: string;
    fullname: string;
    email: string;
    phone: number;
    salary: number;
    location: string;
    createdAt: Date
}

//----------Response Models----------
export interface LeadResponse
{
    errors?: {
        message: string
    }[];
    data: {
        leads: LeadItem[];
    }
}

export interface LeadItem {
    idLead: string
    resource: string;
    createdAt: Date
    personResponse: PersonInfo;
}

export interface PersonInfo {
    fullname: string;   
    email: string;
    phone: string;
    salary: number;
    location: string;
}

export interface LeadDeletionResponse
{
    errors?: {
        message: string
    }[];
    data: {
        deleteLead: string;
    }
}

export interface LeadInfResponse
{
    errors?: {
        message: string
    }[];
    data: {
        leadById: LeadItem[];
    }
}

export interface LeadUpdateResponse
{
    errors?: {
        message: string
    }[];
    data: {
        updateLead: LeadItem[];
    }
}