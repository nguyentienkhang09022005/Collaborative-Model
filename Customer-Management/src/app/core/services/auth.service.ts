import { Injectable } from "@angular/core";
import { map, Observable, tap, of, catchError } from "rxjs";
import { Login, InfStaff, LoginResponse, LogoutResponse } from "../models/auth.models";
import { ApiService } from "./api.service";
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
                        id
                        username
                        role
                        createdAt
                        person {
                            fullname
                            email
                            phone
                            location
                        }
                    }
                }
            }`;

        return this.api.graphql<LoginResponse>(query, {
            username: login.username,
            password: login.password
        }).pipe(
            map(res => {
                const loginData = (res as any)?.login;
                if (loginData) {
                    localStorage.setItem('access_token', loginData.token);
                    localStorage.setItem("staff_info", JSON.stringify(loginData.infStaff));
                }
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
            mutation ConfirmOTPForgotPassword($input: ChangePasswordRequestInput!) {
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

    // Decode JWT to get raw claims (sub, role, email, etc.)
    decodeJWT(): { sub: string; role: string; email: string; name: string; [key: string]: string } | null {
        const token = this.getAccessToken();
        if (!token) return null;

        try {
            const payload = token.split('.')[1];
            // JWT uses base64url encoding, replace - with + and _ with /
            const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch {
            return null;
        }
    }

    getCurrentUserId(): string | null {
        return this.decodeJWT()?.sub || null;
    }

    getCurrentUserRole(): string | null {
        // Try "role" claim first (custom), then Microsoft format role claim
        const jwt = this.decodeJWT();
        if (!jwt) return null;
        return jwt['role'] || jwt['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
    }

    // Token expiration methods
    getTokenExpiration(): number | null {
        const jwt = this.decodeJWT();
        console.log('[Auth] JWT decode result:', jwt);
        if (!jwt) {
            console.log('[Auth] JWT is null');
            return null;
        }
        const exp = jwt['exp'];
        console.log('[Auth] Raw exp value:', exp, 'type:', typeof exp);
        if (!exp) return null;
        const expNum = parseInt(exp as unknown as string);
        console.log('[Auth] Parsed exp:', expNum, 'Current time:', Date.now(), 'Expired:', Date.now() >= expNum * 1000);
        return expNum;
    }

    isTokenExpired(): boolean {
        const exp = this.getTokenExpiration();
        if (!exp) {
            console.log('[Auth] No exp found, treating as expired');
            return true;
        }
        // Add buffer of 30 seconds to refresh before actual expiration
        const isExpired = Date.now() >= (exp * 1000) - 30000;
        console.log('[Auth] Token expired check:', isExpired, 'Exp time:', new Date(exp * 1000).toISOString());
        return isExpired;
    }

    // Refresh token - returns true if successful
    refreshToken(): Observable<boolean> {
        console.log('[Auth] refreshToken() called');
        const query = `
            mutation RefreshToken {
                refreshToken {
                    token
                    infStaff {
                        id
                        username
                        role
                        createdAt
                        person {
                            fullname
                            email
                            phone
                            location
                        }
                    }
                }
            }`;

        return this.api.graphql(query).pipe(
            map(res => {
                console.log('[Auth] refreshToken response:', res);
                const data = (res as any)?.refreshToken;
                if (data && data.token) {
                    console.log('[Auth] Refresh SUCCESS, new token:', data.token.substring(0, 20) + '...');
                    localStorage.setItem('access_token', data.token);
                    localStorage.setItem('staff_info', JSON.stringify(data.infStaff));
                    return true;
                }
                console.log('[Auth] Refresh failed - no token in response');
                return false;
            }),
            catchError((err) => {
                console.error('[Auth] Refresh token error:', err);
                return of(false);
            })
        );
    }
}