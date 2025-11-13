import { Injectable } from "@angular/core";
import { environment } from "../../../environment/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private readonly baseUrl = environment.api_url;

    constructor(protected http: HttpClient) {}

    get<T>(url: string){
        return this.http.get<T>(`${this.baseUrl}/${url}`, { withCredentials: true });
    }

    post<T>(url: string, body: any){
        return this.http.post<T>(`${this.baseUrl}/${url}`, body, { withCredentials: true });
    }

    put<T>(url: string, body: any){
        return this.http.put<T>(`${this.baseUrl}/${url}`, body, { withCredentials: true });
    }

    delete<T>(url: string){
        return this.http.delete<T>(`${this.baseUrl}/${url}`, { withCredentials: true });
    }
}