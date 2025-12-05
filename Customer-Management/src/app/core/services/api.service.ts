import { Injectable } from "@angular/core";
import { environment } from "../../../environment/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

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
}   