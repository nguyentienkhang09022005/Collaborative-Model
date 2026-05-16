import { PersonInfo } from './staff.model';

export interface TeamMemberRequest {
  entityType: string;
  entityId: string;
  idStaff: string;
  role: number;
  canEdit: boolean;
  canDelete: boolean;
}

export interface TeamMemberUpdateRequest {
  role?: number;
  canEdit?: boolean;
  canDelete?: boolean;
}

export interface TeamMemberItem {
  id: string;
  entityType: string;
  entityId: string;
  idStaff: string;
  staff?: TeamStaffItem;
  role: string;
  assignedAt: string;
  assignedBy?: string;
  canEdit: boolean;
  canDelete: boolean;
}

export interface TeamStaffItem {
  id: string;
  person: PersonInfo;
}

export interface TeamMemberResponse {
  errors?: { message: string }[];
  data: {
    teamMembers: TeamMemberItem[];
    myTeams: TeamMemberItem[];
    teamMemberPermissions: TeamMemberItem;
  };
}

export interface TeamMemberMutationResponse {
  errors?: { message: string }[];
  data: {
    addTeamMember: TeamMemberItem;
    updateTeamMember: TeamMemberItem;
    removeTeamMember: string;
    transferOwnership: TeamMemberItem;
  };
}

export const TEAM_ROLE_LABELS: Record<number, string> = {
  0: 'Owner',
  1: 'Member',
  2: 'Viewer'
};

export const TEAM_ROLE_COLORS: Record<number, string> = {
  0: 'bg-purple-100 text-purple-700',
  1: 'bg-blue-100 text-blue-700',
  2: 'bg-slate-100 text-slate-600'
};

export const TEAM_ENTITY_TYPE_LABELS: Record<string, string> = {
  'Lead': 'Lead',
  'Deal': 'Deal'
};