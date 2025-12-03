export interface ChatRequest {
    idStaff: string;
    userMessage: string;
}

export interface ChatResponse{
    errors?: {
        message: string
    }[];
    data: {
        sendChatMessage: ChatMessageItem;
    }
}

export interface ChatMessageItem {
    aiResponse: string,
}

export interface HistoryMessageResponse {
    errors?: {
        message: string
    }[];
    data: {
        historyMessage: HistoryMessageItem[];
    }
}

export interface HistoryMessageItem {
    role: string,
    message: string
}