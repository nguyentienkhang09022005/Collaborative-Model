//----------Request Models----------
export interface Register
{
    fullName: string;
    email: string;
    userName: string
    password: string
    confirmPassword: string    
}

//----------Response Models----------
export interface RegisterResponse
{
    errors?: { 
        message: string 
    }[];
    data: {
        register: string;
    }
}