import { PersonInfo } from './staff.model';

export interface LeadRequest {
  id?: string;
  fullname: string;
  email: string;
  phone?: string;
  location?: string;
  resource?: string;
}

export interface LeadItem {
  id: string;
  createdAt: string;
  resource?: string;
  person: PersonInfo;
}

export interface LeadResponse {
  errors?: { message: string }[];
  data: {
    leads: LeadItem[];
  };
}

export interface LeadByIdResponse {
  errors?: { message: string }[];
  data: {
    leadById: LeadItem[];
  };
}

export interface LeadMutationResponse {
  errors?: { message: string }[];
  data: {
    createLead: LeadItem;
    updateLead: LeadItem;
    restoreLead: LeadItem;
  };
}

export interface LeadDeleteResponse {
  errors?: { message: string }[];
  data: {
    deleteLead: string;
  };
}

export interface UploadLeadFileResponse {
  errors?: { message: string }[];
  data: {
    importLeadExcel: string;
  };
}