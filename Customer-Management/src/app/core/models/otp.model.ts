export interface ConfirmOTP{
    email: string,
    otp: string
} 

export interface OTPRegisterResponse{
    errors?: {
        message: string
    }[];
    data: {
        confirmOTPRegister: string
    }
}