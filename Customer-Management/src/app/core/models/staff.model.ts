//----------Request Models----------


//----------Response Models----------
export interface StaffResponse
{
    errors?: {
        message: string
    }[];
    data: {
        staffs: StaffItem[];
    }
}

export interface StaffItem {
    idStaff: string
    fullname: string;
    email: string;
    role: string;
    createdAt: Date;
}