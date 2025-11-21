import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { StaffResponse } from "../models/staff.model";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class StaffService {
    constructor(private api : ApiService){}

    // List Staff
    GetListStaff(): Observable<StaffResponse>{
        const query = {
            query: `
                query {
                    staffs {
                        idStaff
                        fullname
                        email
                        role
                        createdAt
                    }
                }`
        };
    
        return this.api.post<StaffResponse>('graphql', query).pipe(
            tap(res => {
                return res;
            })
        );
    }
}