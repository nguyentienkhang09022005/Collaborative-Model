import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  NoteRequest,
  NoteUpdateRequest,
  NoteItem,
  NoteResponse,
  NoteMutationResponse
} from "../models/note.model";

@Injectable({
    providedIn: 'root'
})
export class NoteService {
    constructor(private api: ApiService) {}

    GetNotesByEntity(entityType: string, entityId: string): Observable<NoteItem[]> {
        const query = `
            query($entityType: String!, $entityId: UUID!) {
                notesByEntity(entityType: $entityType, entityId: $entityId) {
                    idNote
                    content
                    type
                    isPinned
                    createdAt
                    updatedAt
                    idStaff
                    staff {
                        id
                        person {
                            id
                            fullname
                            email
                        }
                    }
                    linkedEntityType
                    linkedEntityId
                    parentNoteId
                    replies {
                        idNote
                        content
                        type
                        isPinned
                        createdAt
                        idStaff
                        staff {
                            id
                            person {
                                fullname
                            }
                        }
                    }
                    mentions {
                        idMention
                        idNote
                        idStaffMentioned
                        staffMentioned {
                            id
                            person {
                                fullname
                            }
                        }
                        createdAt
                    }
                }
            }`;

        return this.api.graphql<NoteResponse>(query, { entityType, entityId }).pipe(
            map(res => (res as any)?.notesByEntity ?? [])
        );
    }

    GetNoteById(idNote: string): Observable<NoteItem | null> {
        const query = `
            query($idNote: UUID!) {
                noteById(idNote: $idNote) {
                    idNote
                    content
                    type
                    isPinned
                    createdAt
                    updatedAt
                    idStaff
                    staff {
                        id
                        person {
                            fullname
                            email
                        }
                    }
                    linkedEntityType
                    linkedEntityId
                    parentNoteId
                }
            }`;

        return this.api.graphql<NoteResponse>(query, { idNote }).pipe(
            map(res => (res as any)?.noteById?.[0] ?? null)
        );
    }

    GetPinnedNotes(entityType: string, entityId: string): Observable<NoteItem[]> {
        const query = `
            query($entityType: String!, $entityId: UUID!) {
                pinnedNotes(entityType: $entityType, entityId: $entityId) {
                    idNote
                    content
                    type
                    isPinned
                    createdAt
                    idStaff
                    staff {
                        id
                        person {
                            fullname
                        }
                    }
                }
            }`;

        return this.api.graphql<NoteResponse>(query, { entityType, entityId }).pipe(
            map(res => (res as any)?.pinnedNotes ?? [])
        );
    }

    createNote(request: NoteRequest): Observable<NoteItem> {
        const query = `
            mutation CreateNote($input: NoteInput!) {
                createNote(input: $input) {
                    idNote
                    content
                    type
                    isPinned
                    createdAt
                    idStaff
                    linkedEntityType
                    linkedEntityId
                    parentNoteId
                    staff {
                        id
                        person {
                            fullname
                        }
                    }
                }
            }`;

        const input = {
            content: request.content,
            type: request.type,
            idStaff: request.idStaff,
            linkedEntityType: request.linkedEntityType,
            linkedEntityId: request.linkedEntityId,
            parentNoteId: request.parentNoteId
        };

        return this.api.graphql<NoteMutationResponse>(query, { input }).pipe(
            map((res: any) => res.createNote)
        );
    }

    updateNote(idNote: string, request: NoteUpdateRequest): Observable<NoteItem> {
        const query = `
            mutation UpdateNote($idNote: UUID!, $input: NoteUpdateInput!) {
                updateNote(idNote: $idNote, input: $input) {
                    idNote
                    content
                    type
                    isPinned
                    updatedAt
                }
            }`;

        const input: Record<string, unknown> = {};
        if (request['content'] !== undefined) input['content'] = request['content'];
        if (request['isPinned'] !== undefined) input['isPinned'] = request['isPinned'];

        return this.api.graphql<NoteMutationResponse>(query, { idNote, input }).pipe(
            map((res: any) => res.updateNote)
        );
    }

    deleteNote(idNote: string): Observable<string> {
        const query = `
            mutation DeleteNote($idNote: UUID!) {
                deleteNote(idNote: $idNote)
            }`;

        return this.api.graphql<NoteMutationResponse>(query, { idNote }).pipe(
            map((res: any) => res.deleteNote)
        );
    }

    pinNote(idNote: string): Observable<NoteItem> {
        const query = `
            mutation PinNote($idNote: UUID!) {
                pinNote(idNote: $idNote) {
                    idNote
                    isPinned
                }
            }`;

        return this.api.graphql<NoteMutationResponse>(query, { idNote }).pipe(
            map((res: any) => res.pinNote)
        );
    }

    unpinNote(idNote: string): Observable<NoteItem> {
        const query = `
            mutation UnpinNote($idNote: UUID!) {
                unpinNote(idNote: $idNote) {
                    idNote
                    isPinned
                }
            }`;

        return this.api.graphql<NoteMutationResponse>(query, { idNote }).pipe(
            map((res: any) => res.unpinNote)
        );
    }

    replyNote(idNote: string, parentId: string): Observable<NoteItem> {
        const query = `
            mutation ReplyNote($idNote: UUID!, $parentId: UUID!) {
                replyNote(idNote: $idNote, parentId: $parentId) {
                    idNote
                    content
                    type
                    createdAt
                    parentNoteId
                    staff {
                        id
                        person {
                            fullname
                        }
                    }
                }
            }`;

        return this.api.graphql<NoteMutationResponse>(query, { idNote, parentId }).pipe(
            map((res: any) => res.replyNote)
        );
    }
}