import { PersonInfo } from './staff.model';

export interface NoteRequest {
  content: string;
  type: string;
  idStaff?: string;
  linkedEntityType: string;
  linkedEntityId: string;
  parentNoteId?: string;
}

export interface NoteUpdateRequest {
  content?: string;
  isPinned?: boolean;
}

export interface NoteItem {
  idNote: string;
  content: string;
  type: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt?: string;
  idStaff: string;
  staff?: StaffNoteItem;
  linkedEntityType: string;
  linkedEntityId: string;
  parentNoteId?: string;
  replies?: NoteItem[];
  mentions?: NoteMentionItem[];
}

export interface StaffNoteItem {
  id: string;
  person: PersonInfo;
}

export interface NoteMentionItem {
  idMention: string;
  idNote: string;
  idStaffMentioned: string;
  staffMentioned?: StaffNoteItem;
  createdAt: string;
}

export interface NoteResponse {
  errors?: { message: string }[];
  data: {
    notesByEntity: NoteItem[];
    noteById: NoteItem[];
    pinnedNotes: NoteItem[];
  };
}

export interface NoteMutationResponse {
  errors?: { message: string }[];
  data: {
    createNote: NoteItem;
    updateNote: NoteItem;
    deleteNote: string;
    pinNote: NoteItem;
    unpinNote: NoteItem;
    replyNote: NoteItem;
  };
}

export const NOTE_TYPE_LABELS: Record<string, string> = {
  'COMMENT': 'Comment',
  'UPDATE': 'Update',
  'SYSTEM': 'System'
};

export const NOTE_TYPE_COLORS: Record<string, string> = {
  'COMMENT': 'bg-blue-100 text-blue-700',
  'UPDATE': 'bg-amber-100 text-amber-700',
  'SYSTEM': 'bg-slate-100 text-slate-600'
};