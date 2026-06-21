//----------Request Models----------
export interface ChatRequest {
    idStaff: string;
    userMessage: string;
}

//----------Response Models----------
export interface ChatResponse {
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
        getHistoryMessage: HistoryMessageItem[];
    }
}

export interface HistoryMessageItem {
    role: string,
    message: string
}

export interface WelcomeMessageResponse {
    errors?: {
        message: string
    }[];
    data: {
        getChatWelcomeMessage: string;
    }
}

export interface DeleteMessageResponse {
    errors?: {
        message: string
    }[];
    data: {
        deleteMessage: string;
    }
}
