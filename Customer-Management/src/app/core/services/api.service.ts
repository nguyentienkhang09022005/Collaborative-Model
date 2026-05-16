import { Injectable } from "@angular/core";
import { environment } from "../../../environment/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

export interface GraphQLError {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: string[];
  extensions?: Record<string, unknown>;
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
    private readonly baseUrl = environment.api_url;

    constructor(protected http: HttpClient) {}

    post<T>(url: string, body: any){
        return this.http.post<T>(`${this.baseUrl}/${url}`, body, { withCredentials: true });
    }

    Post<T>(url: string, body: any, options: any = {}){
        return this.http.post<T>(`${this.baseUrl}/${url}`, body, {
            withCredentials: true,
            ...options
        }) as Observable<T>;
    }

    graphql<T>(query: string, variables?: Record<string, unknown>): Observable<T> {
        const body = {
            query,
            ...(variables && { variables })
        };
        return this.http.post<GraphQLResponse<T>>(`${this.baseUrl}/graphql`, body, { withCredentials: true }).pipe(
            map(res => {
                if (res.errors && res.errors.length > 0) {
                    const firstError = res.errors[0];
                    const errorMessage = firstError.extensions?.['status'] === 409
                        ? firstError.message
                        : firstError.message;
                    throw new Error(errorMessage);
                }
                if (!res.data) {
                    throw new Error('No data returned from GraphQL');
                }
                return res.data as unknown as T;
            }),
            catchError((err: HttpErrorResponse | Error) => {
                let errorMessage = 'An unexpected error occurred';
                if (err instanceof Error) {
                    errorMessage = err.message;
                } else if (err.status === 409 && err.error?.errors?.[0]?.message) {
                    errorMessage = err.error.errors[0].message;
                } else if (err.error instanceof ErrorEvent) {
                    errorMessage = err.error.message;
                } else if (err.status === 0) {
                    errorMessage = 'Network error. Please check your connection.';
                } else if (err.message) {
                    errorMessage = err.message;
                }
                console.error('GraphQL Error:', errorMessage);
                return throwError(() => new Error(errorMessage));
            })
        );
    }
}