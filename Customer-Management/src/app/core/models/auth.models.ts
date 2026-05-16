//----------Request Models----------
export interface Login
{
    username: string;
    password: string;
}

//----------Response Models----------
export interface InfStaff
{
    id: string;
    username: string;
    role: string;
    createdAt: string;
    person: PersonInfo;
}

export interface PersonInfo {
    fullname: string;
    email: string;
    phone?: string;
    location?: string;
}

export interface Login
{
    token: string;
    infStaff: InfStaff;
}

export interface LoginResponse
{
    errors?: {
        message: string
    }[];
    data: {
        login: Login;
    }
}

export interface LogoutResponse
{
    errors?: {
        message: string
    }[];
    data: {
        logout: string;
    }
}