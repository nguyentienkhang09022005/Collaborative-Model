export interface PersonInfo {
  id: string;
  fullname: string;
  email: string;
  phone?: string;
  location?: string;
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

export interface StaffResponse {
  errors?: { message: string }[];
  data: {
    staffs: StaffItem[];
  };
}

export interface StaffByIdResponse {
  errors?: { message: string }[];
  data: {
    staffById: StaffItem;
  };
}