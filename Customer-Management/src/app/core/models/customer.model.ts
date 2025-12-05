export interface CustomerRequest
{
    idCustomer: string,
    fullname: string;
    email: string;
    phone: number;
    salary: number;
    location: string;
    createdAt: Date
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
    idCustomer: string
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

export interface CustomerDeletionResponse
{
    errors?: {
        message: string
    }[];
    data: {
        deleteCustomer: string;
    }
}

export interface CustomerInfResponse
{
    errors?: {
        message: string
    }[];
    data: {
        customerById: CustomerItem[];
    }
}

export interface CustomerUpdateResponse
{
    errors?: {
        message: string
    }[];
    data: {
        updateCustomer: CustomerItem[];
    }
}

export interface UploadCustomerFileResponse
{
    errors?: {
        message: string
    }[];
    data: {
        importCustomerExcel: string;
    }
}