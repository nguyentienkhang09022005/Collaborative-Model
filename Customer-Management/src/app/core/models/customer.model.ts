import { PersonInfo } from './staff.model';

export interface CustomerRequest {
  fullname: string;
  email: string;
  phone?: string;
  location?: string;
}

export interface CustomerItem {
  id: string;
  createdAt: string;
  person: PersonInfo;
}

export interface CustomerResponse {
  errors?: { message: string }[];
  data: {
    customers: CustomerItem[];
  };
}

export interface CustomerByIdResponse {
  errors?: { message: string }[];
  data: {
    customerById: CustomerItem[];
  };
}

export interface CustomerMutationResponse {
  errors?: { message: string }[];
  data: {
    createCustomer: CustomerItem;
    updateCustomer: CustomerItem;
    restoreCustomer: CustomerItem;
  };
}

export interface CustomerDeleteResponse {
  errors?: { message: string }[];
  data: {
    deleteCustomer: string;
  };
}

export interface UploadCustomerFileResponse {
  errors?: { message: string }[];
  data: {
    importCustomerExcel: string;
  };
}