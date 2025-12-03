import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { ChatRequest, ChatResponse, HistoryMessageResponse } from "../models/ai.model";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AiService {
    constructor(private api: ApiService) {}

    ChatWithAI(chatRequest: ChatRequest): Observable<ChatResponse>{
        const query = {
            query: `
                mutation {
                    sendChatMessage(
                        chatRequest: {
                        idStaff: "${chatRequest.idStaff}",
                        userMessage: "${chatRequest.userMessage}"
                        }
                    ) {
                    aiResponse
                }
            }`
        };
            
        return this.api.post<ChatResponse>('graphql', query).pipe(
            tap(res => {
                return res;
            })
        );
    }

    ListHistoryMessage(idStaff: string): Observable<HistoryMessageResponse>{
        const query = {
            query: `
                query {
                    historyMessage(idStaff: "${idStaff}") {
                        role
                        message
                    }
                }`
        };
            
        return this.api.post<HistoryMessageResponse>('graphql', query).pipe(
            tap(res => {
                return res;
            })
        );
    }
}