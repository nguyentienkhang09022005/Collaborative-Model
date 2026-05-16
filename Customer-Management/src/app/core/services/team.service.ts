import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  TeamMemberRequest,
  TeamMemberUpdateRequest,
  TeamMemberItem,
  TeamMemberResponse,
  TeamMemberMutationResponse
} from "../models/team.model";

@Injectable({
    providedIn: 'root'
})
export class TeamService {
    constructor(private api: ApiService) {}

    GetTeamMembers(entityType: string, entityId: string): Observable<TeamMemberItem[]> {
        const query = `
            query($entityType: String!, $entityId: UUID!) {
                teamMembers(entityType: $entityType, entityId: $entityId) {
                    id
                    entityType
                    entityId
                    idStaff
                    staff {
                        id
                        person {
                            id
                            fullname
                            email
                            phone
                        }
                    }
                    role
                    assignedAt
                    assignedBy
                    canEdit
                    canDelete
                }
            }`;

        return this.api.graphql<TeamMemberResponse>(query, { entityType, entityId }).pipe(
            map(res => (res as any)?.teamMembers ?? [])
        );
    }

    GetMyTeams(idStaff: string): Observable<TeamMemberItem[]> {
        const query = `
            query($idStaff: UUID!) {
                myTeams(idStaff: $idStaff) {
                    id
                    entityType
                    entityId
                    idStaff
                    staff {
                        id
                        person {
                            fullname
                        }
                    }
                    role
                    assignedAt
                    assignedBy
                    canEdit
                    canDelete
                }
            }`;

        return this.api.graphql<TeamMemberResponse>(query, { idStaff }).pipe(
            map(res => (res as any)?.myTeams ?? [])
        );
    }

    GetTeamMemberPermissions(idTeamMember: string): Observable<TeamMemberItem | null> {
        const query = `
            query($idTeamMember: UUID!) {
                teamMemberPermissions(idTeamMember: $idTeamMember) {
                    id
                    entityType
                    entityId
                    idStaff
                    role
                    assignedAt
                    assignedBy
                    canEdit
                    canDelete
                }
            }`;

        return this.api.graphql<TeamMemberResponse>(query, { idTeamMember }).pipe(
            map(res => (res as any)?.teamMemberPermissions ?? null)
        );
    }

    addTeamMember(request: TeamMemberRequest): Observable<TeamMemberItem> {
        const query = `
            mutation AddTeamMember($input: AddTeamMemberInput!) {
                addTeamMember(input: $input) {
                    id
                    entityType
                    entityId
                    idStaff
                    role
                    assignedAt
                    assignedBy
                    canEdit
                    canDelete
                    staff {
                        id
                        person {
                            fullname
                        }
                    }
                }
            }`;

        return this.api.graphql<TeamMemberMutationResponse>(query, { input: request }).pipe(
            map((res: any) => res.addTeamMember)
        );
    }

    updateTeamMember(idTeamMember: string, request: TeamMemberUpdateRequest): Observable<TeamMemberItem> {
        const query = `
            mutation UpdateTeamMember($idTeamMember: UUID!, $input: UpdateTeamMemberInput!) {
                updateTeamMember(idTeamMember: $idTeamMember, input: $input) {
                    id
                    role
                    canEdit
                    canDelete
                }
            }`;

        return this.api.graphql<TeamMemberMutationResponse>(query, { idTeamMember, input: request }).pipe(
            map((res: any) => res.updateTeamMember)
        );
    }

    removeTeamMember(idTeamMember: string): Observable<string> {
        const query = `
            mutation RemoveTeamMember($idTeamMember: UUID!) {
                removeTeamMember(idTeamMember: $idTeamMember)
            }`;

        return this.api.graphql<TeamMemberMutationResponse>(query, { idTeamMember }).pipe(
            map((res: any) => res.removeTeamMember)
        );
    }

    transferOwnership(entityType: string, entityId: string, newOwnerId: string): Observable<TeamMemberItem> {
        const query = `
            mutation TransferOwnership($entityType: String!, $entityId: UUID!, $newOwnerId: UUID!) {
                transferOwnership(entityType: $entityType, entityId: $entityId, newOwnerId: $newOwnerId) {
                    id
                    role
                    idStaff
                    staff {
                        id
                        person {
                            fullname
                        }
                    }
                }
            }`;

        return this.api.graphql<TeamMemberMutationResponse>(query, { entityType, entityId, newOwnerId }).pipe(
            map((res: any) => res.transferOwnership)
        );
    }
}