import { Injectable } from "@angular/core";
import { map, Observable, tap } from "rxjs";
import { Login, InfStaff, LoginResponse, LogoutResponse } from "../models/auth.models";
import { ApiService } from "./api.service";
import { Register, RegisterResponse } from "../models/register.model";
import { OTPRegisterResponse, ConfirmOTPRegister, OTPForgotPasswordResponse, confirmOTPForgotPassword, confirmOTPForgotPasswordResponse, sendOTPForgotPassword } from "../models/otp.model";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private api: ApiService) {}

    // Login
    authen(login: Login): Observable<LoginResponse>{
        const query = {
            query: `
                mutation {
                    login(authenticationRequest: { username: "${login.username}", password: "${login.password}" }) 
                    {
                        token
                        infStaff {
                            idStaff
                            email
                            role
                            createdAt
                            fullname
                        }
                    }
                }
            `
        };
        return this.api.post<LoginResponse>('graphql', query).pipe(
            map(res => {
                const loginData = res.data.login;

                // Lưu token vào localStorage
                localStorage.setItem('access_token', loginData.token);

                return res; 
            })
        );
    }

    // Logout
    logout(): Observable<LogoutResponse>{
        const query = {
            query: `
                mutation {
                    logout
                }
            `
        };
        return this.api.post<LogoutResponse>('graphql', query).pipe(
            tap((res) => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('staff_info');

                return res;
            })
        );   
    }

    // Register
    register(register: Register): Observable<RegisterResponse> {
        const query = {
            query: `
                mutation {
                    register(registerRequest: {
                        fullName: "${register.fullName}",
                        email: "${register.email}",
                        userName: "${register.userName}",
                        password: "${register.password}",
                        confirmPassword: "${register.confirmPassword}"
                    })
                }
            `
        };

        return this.api.post<RegisterResponse>('graphql', query).pipe(
            tap(res => {
                localStorage.setItem('email', register.email);
                return res;
            })
        );
    }

    // OTP
    confirmOTPRegister(confirmOTPRegister: ConfirmOTPRegister): Observable<OTPRegisterResponse>{
        const query = {
            query: `
                mutation {
                    confirmOTPRegister(confirmOTPRequest: {
                        email: "${confirmOTPRegister.email}", 
                        otp: "${confirmOTPRegister.otp}"
                })
            }`
        };

        return this.api.post<OTPRegisterResponse>('graphql', query).pipe(
            tap(res => {
                localStorage.removeItem('email');
                return res;
            })
        );
    }

    confirmOTPForgotPassword(confirmOTPForgotPassword: confirmOTPForgotPassword): Observable<confirmOTPForgotPasswordResponse>{
        const query = {
            query: `
                mutation {
                    confirmOTPForgotPassword(changePasswordRequest: {
                        email: "${confirmOTPForgotPassword.email}",
                        otp: "${confirmOTPForgotPassword.otp}",
                        newPassword: "${confirmOTPForgotPassword.newPassword}",
                        confirmPassword: "${confirmOTPForgotPassword.confirmPassword}"
                    })
                }`
        };

        return this.api.post<confirmOTPForgotPasswordResponse>('graphql', query).pipe(
            tap(res => {
                localStorage.removeItem('email');
                localStorage.removeItem('forgot_password_otp');                
                
                return res;
            })
        );
    }

    // Forgot Password
    sendOTPforgotPassword(sendOTPForgotPassword: sendOTPForgotPassword): Observable<OTPForgotPasswordResponse>{
        const query = {
            query: `
                mutation {
                    sendOTPForgotPassword(forgotPasswordRequest: {
                        email: "${sendOTPForgotPassword.email}",
                })
            }`
        };

        return this.api.post<OTPForgotPasswordResponse>('graphql', query).pipe(
            tap(res => {
                localStorage.setItem('email', sendOTPForgotPassword.email);
                return res;
            })
        );
    }

    getAccessToken(): string | null{
        return localStorage.getItem('access_token')
    }

    getCurrentStaff(): InfStaff | null {
    const staff = localStorage.getItem('staff_info');
    return staff ? JSON.parse(staff) : null;
    }
}