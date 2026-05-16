import { PersonInfo } from './staff.model';

export interface ContactRequest {
  type?: string;
  title: string;
  content?: string;
  idStaff: string;
  idLead: string;
}

export interface ContactItem {
  idContact: string;
  type: string;
  title: string;
  content?: string;
  status?: string;
  createdAt: string;
  updatedAt?: string;
  lead: LeadItem;
  staff: StaffItem;
}

export interface LeadItem {
  id: string;
  resource?: string;
  createdAt: string;
  person: PersonInfo;
}

export interface StaffItem {
  id: string;
  username: string;
  role?: string;
  createdAt: string;
  salary?: number;
  phone?: string;
  location?: string;
  person: PersonInfo;
}

export interface ContactResponse {
  errors?: { message: string }[];
  data: {
    contacts: ContactItem[];
  };
}

export interface ContactByIdResponse {
  errors?: { message: string }[];
  data: {
    contactById: ContactItem[];
  };
}

export interface ContactMutationResponse {
  errors?: { message: string }[];
  data: {
    createContact: ContactItem;
    updateContact: ContactItem;
  };
}

export interface ContactDeleteResponse {
  errors?: { message: string }[];
  data: {
    deleteContact: string;
  };
}