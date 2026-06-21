import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { ChatMessageItem, HistoryMessageItem } from "../models/ai.model";
import { Observable, map } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AiService {
    constructor(private api: ApiService) {}

    private readonly sendChatMessageMutation = `
        mutation SendChatMessage($chatRequest: ChatRequestInput!) {
            sendChatMessage(chatRequest: $chatRequest) {
                aiResponse
            }
        }
    `;

    private readonly getHistoryMessageQuery = `
        query GetHistoryMessage($idStaff: UUID!) {
            getHistoryMessage(idStaff: $idStaff) {
                role
                message
            }
        }
    `;

    private readonly getChatWelcomeMessageQuery = `
        query GetChatWelcomeMessage {
            getChatWelcomeMessage
        }
    `;

    private readonly deleteMessageMutation = `
        mutation DeleteMessage($idStaff: UUID!) {
            deleteMessage(idStaff: $idStaff)
        }
    `;

    ChatWithAI(idStaff: string, userMessage: string): Observable<ChatMessageItem> {
        return this.api.graphql<{ sendChatMessage: ChatMessageItem }>(
            this.sendChatMessageMutation,
            { chatRequest: { idStaff, userMessage } }
        ).pipe(
            map(res => res.sendChatMessage)
        );
    }

    ListHistoryMessage(idStaff: string): Observable<HistoryMessageItem[]> {
        return this.api.graphql<{ getHistoryMessage: HistoryMessageItem[] }>(
            this.getHistoryMessageQuery,
            { idStaff }
        ).pipe(
            map(res => res.getHistoryMessage ?? [])
        );
    }

    GetWelcomeMessage(): Observable<string> {
        return this.api.graphql<{ getChatWelcomeMessage: string }>(
            this.getChatWelcomeMessageQuery
        ).pipe(
            map(res => res.getChatWelcomeMessage ?? '')
        );
    }

    DeleteMessage(idStaff: string): Observable<string> {
        return this.api.graphql<{ deleteMessage: string }>(
            this.deleteMessageMutation,
            { idStaff }
        ).pipe(
            map(res => res.deleteMessage ?? '')
        );
    }
}
