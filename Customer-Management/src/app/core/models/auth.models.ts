//----------Request Models----------
export interface Login
{
    username: string;
    password: string;
}

//----------Response Models----------
export interface InfStaff 
{
    idStaff: string;
    email: string;
    role: string;
    createdAt: string;
    fullname: string;
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
