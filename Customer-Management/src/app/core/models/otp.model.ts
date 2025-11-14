//----------Request Models----------
export interface ConfirmOTPRegister{
    email: string,
    otp: string
} 

export interface sendOTPForgotPassword{
    email: string
}

export interface OTPForgotPassword{
    otp: string
}

export interface confirmOTPForgotPassword{
    email: string,
    otp: string,
    newPassword: string,
    confirmPassword: string
}

//----------Response Models----------
export interface OTPRegisterResponse{
    errors?: {
        message: string
    }[];
    data: {
        confirmOTPRegister: string
    }
}

export interface confirmOTPForgotPasswordResponse{
    errors?: {
        message: string
    }[];
    data: {
        confirmOTPForgotPassword: string
    }
}

export interface OTPForgotPasswordResponse{
    errors?: {
        message: string
    }[];
    data: {
        sendOTPForgotPassword: string
    }
}