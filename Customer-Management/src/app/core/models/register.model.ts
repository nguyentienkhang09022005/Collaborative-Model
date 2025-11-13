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
    data: {
        register: string;
    }
}