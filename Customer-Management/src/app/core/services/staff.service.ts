import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { StaffItem, StaffResponse, StaffByIdResponse } from "../models/staff.model";

@Injectable({
    providedIn: 'root'
})
export class StaffService {
    constructor(private api: ApiService) {}

    GetListStaff(): Observable<StaffItem[]> {
        const query = `
            query {
                staffs {
                    id
                    username
                    role
                    createdAt
                    salary
                    person {
                        id
                        fullname
                        email
                        phone
                        location
                    }
                }
            }`;

        return this.api.graphql<StaffResponse>(query).pipe(
            map(res => (res as any)?.staffs ?? [])
        );
    }

    GetStaffById(idStaff: string): Observable<StaffItem | null> {
        const query = `
            query($id: UUID!) {
                staffById(idStaff: $id) {
                    id
                    username
                    role
                    createdAt
                    salary
                    person {
                        id
                        fullname
                        email
                        phone
                        location
                    }
                }
            }`;

        return this.api.graphql<StaffByIdResponse>(query, { id: idStaff }).pipe(
            map(res => res.data?.staffById ?? null)
        );
    }
}