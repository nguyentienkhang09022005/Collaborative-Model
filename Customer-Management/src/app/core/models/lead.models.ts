export interface LeadRequest
{
    resource: string;
    fullname: string;
    email: string;
    phone: string;
    salary: number;
    location: string;
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
    resource: string;
    personResponse: PersonInfo;
}

export interface PersonInfo {
    idLead: string
    fullname: string;
    email: string;
    phone: string;
    salary: number;
    location: string;
}