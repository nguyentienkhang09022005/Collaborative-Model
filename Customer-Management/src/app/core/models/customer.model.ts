//----------Request Models----------
export interface CustomerRequest
{
    fullname: string;
    email: string;
    phone: string;
    salary: number;
    location: string;
}

//----------Response Models----------
export interface CustomerResponse
{
    errors?: {
        message: string
    }[];
    data: {
        customers: CustomerItem[];
    }
}

export interface CustomerItem {
    createdAt: Date
    personResponse: PersonInfo;
}

export interface PersonInfo {
    idCustomer: string
    fullname: string;
    email: string;
    phone: string;
    salary: number;
    location: string;
}

