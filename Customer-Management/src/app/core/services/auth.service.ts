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

    authen(login: Login): Observable<LoginResponse>{
        const query = `
            mutation Login($username: String!, $password: String!) {
                login(authenticationRequest: { username: $username, password: $password }) {
                    token
                    infStaff {
                        idStaff
                        email
                        role
                        createdAt
                        fullname
                    }
                }
            }`;

        return this.api.graphql<LoginResponse>(query, {
            username: login.username,
            password: login.password
        }).pipe(
            map(res => {
                const loginData = res.data.login;
                localStorage.setItem('access_token', loginData.token);
                localStorage.setItem("staff_info", JSON.stringify(loginData.infStaff));
                return res;
            })
        );
    }

    logout(): Observable<LogoutResponse>{
        const query = `
            mutation Logout {
                logout
            }`;

        return this.api.graphql<LogoutResponse>(query).pipe(
            tap((res) => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('staff_info');
                return res;
            })
        );
    }

    register(register: Register): Observable<RegisterResponse> {
        const query = `
            mutation Register($input: RegisterRequest!) {
                register(registerRequest: $input)
            }`;

        const input = {
            fullName: register.fullName,
            email: register.email,
            userName: register.userName,
            password: register.password,
            confirmPassword: register.confirmPassword
        };

        return this.api.graphql<RegisterResponse>(query, { input }).pipe(
            tap(res => {
                localStorage.setItem('email', register.email);
                return res;
            })
        );
    }

    confirmOTPRegister(confirmOTPRegister: ConfirmOTPRegister): Observable<OTPRegisterResponse>{
        const query = `
            mutation ConfirmOTPRegister($email: String!, $otp: String!) {
                confirmOTPRegister(confirmOTPRequest: { email: $email, otp: $otp })
            }`;

        return this.api.graphql<OTPRegisterResponse>(query, {
            email: confirmOTPRegister.email,
            otp: confirmOTPRegister.otp
        }).pipe(
            tap(res => {
                localStorage.removeItem('email');
                return res;
            })
        );
    }

    confirmOTPForgotPassword(confirmOTPForgotPassword: confirmOTPForgotPassword): Observable<confirmOTPForgotPasswordResponse>{
        const query = `
            mutation ConfirmOTPForgotPassword($input: ChangePasswordRequest!) {
                confirmOTPForgotPassword(changePasswordRequest: $input)
            }`;

        const input = {
            email: confirmOTPForgotPassword.email,
            otp: confirmOTPForgotPassword.otp,
            newPassword: confirmOTPForgotPassword.newPassword,
            confirmPassword: confirmOTPForgotPassword.confirmPassword
        };

        return this.api.graphql<confirmOTPForgotPasswordResponse>(query, { input }).pipe(
            tap(res => {
                localStorage.removeItem('email');
                localStorage.removeItem('forgot_password_otp');
                return res;
            })
        );
    }

    sendOTPforgotPassword(sendOTPForgotPassword: sendOTPForgotPassword): Observable<OTPForgotPasswordResponse>{
        const query = `
            mutation SendOTPForgotPassword($email: String!) {
                sendOTPForgotPassword(forgotPasswordRequest: { email: $email })
            }`;

        return this.api.graphql<OTPForgotPasswordResponse>(query, {
            email: sendOTPForgotPassword.email
        }).pipe(
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