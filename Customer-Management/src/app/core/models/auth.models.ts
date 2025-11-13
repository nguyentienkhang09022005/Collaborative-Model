//----------Request Models----------
export interface Authen
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
    data: {
        login: Login;
    }
}

export interface LogoutResponse
{
    data: {
        logout: string;
    }
}
