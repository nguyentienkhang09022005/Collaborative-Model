import { Component, inject } from '@angular/core';
import { CustomDatePipe } from '../../../../shared/pipes/date-pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DealItem } from '../../../../core/models/deal.model';
import { DealService } from '../../../../core/services/deal.service';
import { TeamService } from '../../../../core/services/team.service';
import { StaffService } from '../../../../core/services/staff.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';
import { PreferenceService } from '../../../../core/services/preference.service';
import {
  DEAL_STATUS,
  DEAL_STATUS_LABELS,
  DEAL_STATUS_COLORS
} from '../../../../core/constants/enums';
import { StaffItem } from '../../../../core/models/staff.model';
import {
  TeamMemberItem,
  TeamMemberRequest,
  TEAM_ROLE_LABELS
} from '../../../../core/models/team.model';

@Component({
  selector: 'app-deal-detail',
  imports: [CommonModule, FormsModule, CustomDatePipe],
  templateUrl: './deal-detail.html',
  styleUrls: ['./deal-detail.css'],
})
export class DealDetailComponent {
  dealForm: DealItem | null = null;
  isLoading: boolean = false;
  isEditing: boolean = false;
  idDeal: string = "";

  // Team members
  teamMembers: TeamMemberItem[] = [];
  allStaff: StaffItem[] = [];
  isAddingMember: boolean = false;
  isShowAddMember: boolean = false;
  newMemberIdStaff: string = '';
  newMemberRole: string = 'MEMBER'; // GraphQL enum: OWNER, MEMBER, VIEWER
  isLoadingTeam: boolean = false;

  // Expose constants to template
  dealStatusList = Object.values(DEAL_STATUS);
  teamRoleLabels = TEAM_ROLE_LABELS;

  private preferenceService = inject(PreferenceService);
  readonly themeConfig = this.preferenceService.themeConfig;

  constructor(
    private dealService: DealService,
    private teamService: TeamService,
    private staffService: StaffService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(){
    this.route.queryParams.subscribe(param => {
      this.idDeal = param['id']
      if (this.idDeal){
        this.onInfDeal(this.idDeal)
        this.loadTeamMembers()
        this.loadAllStaff()
      }
    })
  }

  // Get current user ID from JWT (not from localStorage staff_info)
  private get currentUserId(): string | null {
    return this.authService.getCurrentUserId();
  }

  // Get current user role from JWT (not from localStorage staff_info)
  private get currentUserRole(): string | null {
    return this.authService.getCurrentUserRole();
  }

  loadTeamMembers(){
    this.isLoadingTeam = true;
    this.teamService.GetTeamMembers('Deal', this.idDeal).subscribe({
      next: (data) => {
        this.isLoadingTeam = false;
        this.teamMembers = data;
      },
      error: (err) => {
        this.isLoadingTeam = false;
        this.toastService.error('Failed to load team members');
      }
    });
  }

  loadAllStaff(){
    this.staffService.GetListStaff().subscribe({
      next: (data) => {
        this.allStaff = data;
      }
    });
  }

  onInfDeal(idDeal: string){
    this.isLoading = true;
    this.dealService.GetInfDeal(idDeal).subscribe({
      next: (data) => {
        this.isLoading = false;
        if (data) {
          this.dealForm = data;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error('Failed to load deal');
      }
    })
  }

  onUpdateDeal(status: string){
    this.isLoading = true;
    this.dealService.UpdateDeal(status, this.idDeal).subscribe({
      next: (data) => {
        this.isLoading = false;
        this.toastService.success('Deal updated successfully');
        this.isEditing = false;
        this.onInfDeal(this.idDeal);
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(err.message || 'Failed to update deal');
      }
    })
  }

  onEdit() {
    this.isEditing = true;
  }

  onBack() {
    this.router.navigate(['/app/deals']);
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return 'bg-slate-500';
    return DEAL_STATUS_COLORS[status] || 'bg-slate-500';
  }

  getStatusLabel(status: string | undefined): string {
    if (!status) return 'Unknown';
    return DEAL_STATUS_LABELS[status] || status;
  }

  formatPrice(price: number | undefined): string {
    if (!price) return '0';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  }

  // Team management
  toggleAddMember(){
    this.isShowAddMember = !this.isShowAddMember;
    this.newMemberIdStaff = '';
    this.newMemberRole = 'MEMBER';
  }

  onAddTeamMember(){
    if (!this.newMemberIdStaff) {
      this.toastService.error('Please select a staff member');
      return;
    }

    const request: TeamMemberRequest = {
      entityType: 'Deal',
      entityId: this.idDeal,
      idStaff: this.newMemberIdStaff,
      role: this.newMemberRole,
      canEdit: true,
      canDelete: false
    };

    this.teamService.addTeamMember(request).subscribe({
      next: (data) => {
        this.toastService.success('Team member added successfully');
        this.isShowAddMember = false;
        this.newMemberIdStaff = '';
        this.newMemberRole = 'MEMBER';
        this.loadTeamMembers();
      },
      error: (err) => {
        this.toastService.error(err.message || 'Failed to add team member');
      }
    });
  }

  onRemoveTeamMember(idTeamMember: string){
    if (!confirm('Are you sure you want to remove this team member?')) return;

    this.teamService.removeTeamMember(idTeamMember).subscribe({
      next: () => {
        this.toastService.success('Team member removed successfully');
        this.loadTeamMembers();
      },
      error: (err) => {
        this.toastService.error(err.message || 'Failed to remove team member');
      }
    });
  }

  getRoleLabel(role: string | undefined): string {
    if (!role) return 'Unknown';
    const roleMap: Record<string, string> = {
      'OWNER': 'Owner',
      'MEMBER': 'Member',
      'VIEWER': 'Viewer',
      '0': 'Owner',
      '1': 'Member',
      '2': 'Viewer'
    };
    return roleMap[role] || role;
  }

  getRoleClass(role: string | undefined): string {
    if (!role) return this.themeConfig().id === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600';
    const roleNum = role === 'OWNER' ? 0 : role === 'MEMBER' ? 1 : role === 'VIEWER' ? 2 : parseInt(role);
    if (this.themeConfig().id === 'dark') {
      const darkColors: Record<number, string> = {
        0: 'bg-purple-900 text-purple-300',
        1: 'bg-blue-900 text-blue-300',
        2: 'bg-slate-700 text-slate-300'
      };
      return darkColors[roleNum] || 'bg-slate-700 text-slate-300';
    }
    const lightColors: Record<number, string> = {
      0: 'bg-purple-100 text-purple-700',
      1: 'bg-blue-100 text-blue-700',
      2: 'bg-slate-100 text-slate-600'
    };
    return lightColors[roleNum] || 'bg-slate-100 text-slate-600';
  }

  getStaffName(staff: any): string {
    return staff?.person?.fullname || staff?.fullname || '-';
  }

  getAvailableStaff(): StaffItem[] {
    const assignedIds = this.teamMembers.map(m => m.idStaff);
    return this.allStaff.filter(s => !assignedIds.includes(s.id));
  }

  isOwner(): boolean {
    const userId = this.currentUserId;
    if (!userId || !this.idDeal) return false;
    // Check if user is the deal creator (IdStaff stored in deal itself)
    if (this.dealForm?.staff?.id === userId) return true;
    // Check if user has OWNER role in team_members
    const myMembership = this.teamMembers.find(m => m.idStaff === userId);
    return myMembership?.role === 'OWNER';
  }

  isMember(): boolean {
    const userId = this.currentUserId;
    if (!userId || !this.idDeal) return false;
    // Creator is also considered a member
    if (this.dealForm?.staff?.id === userId) return true;
    const myMembership = this.teamMembers.find(m => m.idStaff === userId);
    return myMembership != null;
  }

  isViewer(): boolean {
    const userId = this.currentUserId;
    if (!userId || !this.idDeal) return false;
    // Creator/Owner/Member cannot be viewer
    if (this.dealForm?.staff?.id === userId) return false;
    const myMembership = this.teamMembers.find(m => m.idStaff === userId);
    return myMembership?.role === 'VIEWER';
  }

  isAdmin(): boolean {
    return this.currentUserRole === 'ADMIN';
  }

  // Check if current user can edit this deal
  canEdit(): boolean {
    const userId = this.currentUserId;
    if (!userId || !this.idDeal) return false;
    // ADMIN can edit any deal
    if (this.currentUserRole === 'ADMIN') return true;
    // Creator can always edit
    if (this.dealForm?.staff?.id === userId) return true;
    const myMembership = this.teamMembers.find(m => m.idStaff === userId);
    if (!myMembership) return false;
    // OWNER can always edit
    if (myMembership.role === 'OWNER') return true;
    // MEMBER can edit only if CanEdit = true
    if (myMembership.role === 'MEMBER' && myMembership.canEdit) return true;
    // VIEWER cannot edit
    return false;
  }

  // Check if current user can delete this deal
  canDelete(): boolean {
    const userId = this.currentUserId;
    if (!userId || !this.idDeal) return false;
    // Creator can delete
    if (this.dealForm?.staff?.id === userId) return true;
    const myMembership = this.teamMembers.find(m => m.idStaff === userId);
    // Only OWNER can delete
    return myMembership?.role === 'OWNER';
  }

  // Check if current user can update team member permissions
  canUpdateMemberPermissions(): boolean {
    const userId = this.currentUserId;
    if (!userId || !this.idDeal) return false;
    // Creator can manage team
    if (this.dealForm?.staff?.id === userId) return true;
    const myMembership = this.teamMembers.find(m => m.idStaff === userId);
    // Only OWNER can update member permissions
    return myMembership?.role === 'OWNER';
  }

  getMyRole(): string {
    const userId = this.currentUserId;
    if (!userId || !this.idDeal) return '';
    // If user is the creator, they are OWNER
    if (this.dealForm?.staff?.id === userId) return 'OWNER';
    const myMembership = this.teamMembers.find(m => m.idStaff === userId);
    return myMembership?.role || '';
  }

  getMyRoleLabel(): string {
    return this.getRoleLabel(this.getMyRole());
  }
}
