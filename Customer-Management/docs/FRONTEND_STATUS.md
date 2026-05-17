# Frontend Status - 2026-05-17 Updated

**Note**: Last updated with STAFF Kanban board, task priority indicators, and drag-drop status update.

## Project Info
- **Path**: `D:\Project_Angular\Collaborative-Model\Customer-Management`
- **Framework**: Angular 20.3.x (standalone components)
- **Styling**: Tailwind CSS v4.1.17
- **API**: GraphQL (backend: `https://localhost:7109`)

---

## Summary of Updates (2026-05-17)

### 1. Theme System Enhancement
- 5 themes: Light, Dark, Nature, Ocean, Sunset
- Full dark mode support added to all pages
- Dynamic theme classes used throughout

### 2. Dark Mode Fixes (2026-05-17)
- **Staff list**: Removed row dividers to match other list pages
- **Task list**: Status displayed as badges (not dropdowns) with dark mode colors
- **Task/Calendar modals**: All elements use dynamic theme classes
- **Notification list page**: Header, cards, text all use dynamic theme
- **Notification dropdown**: Container, items, type badges all support dark mode
- **Notification type badges**: Added dark mode color variants

### 3. Settings Page
- New settings page at `/settings`
- Theme selector with preview cards
- Supports all 5 themes

### 4. Auth Pages - Toast Notifications & OTP Input (2026-05-17)
- All auth pages now show toast notifications (success/error)
- Toast appears in top-right corner (same as dashboard/main layout)
- 6 separate OTP input boxes with auto-advance on OTP pages
- Redirect on successful OTP verification

### 5. GraphQL Type Fix - confirmOTPForgotPassword
- Issue: `ChangePasswordRequest!` type doesn't match backend schema
- Fix: Changed to `ChangePasswordRequestInput!` in auth.service.ts

### 6. UI/UX Enhancements (2026-05-17)
- **Reports page**: Redesigned with new card-based layout, gradient stat cards, progress bars
- **Sidebar redesigned**: 
  - Gradient background (slate-900 to slate-950)
  - Logo with icon and tagline
  - Gradient dividers
  - Active state uses border-left instead of background
  - User section with backdrop blur and border
- **Topbar redesigned**:
  - Backdrop blur with transparency
  - Gradient accent bar
  - User name with gradient text
  - Role badge
- **Password visibility toggle**: Eye icon on login and reset password forms
- **Scrollbar hidden**: Sidebar scrollbar hidden via CSS (still scrollable)
- **Settings nav restored**: Available to all users

---

## Project Structure

```
src/app/
├── core/
│   ├── constants/
│   │   └── enums.ts                    ✅ All backend enums (Task, Note, Notification, etc.)
│   ├── interceptors/
│   │   ├── auth.interceptor.ts         ✅ Auth Bearer token
│   │   └── error.interceptor.ts        ✅ 401 auto-logout
│   ├── models/
│   │   ├── auth.models.ts              ✅ InfStaff with nested person structure
│   │   ├── contact.model.ts            ✅ idContact, nested StaffItem with person
│   │   ├── customer.model.ts           ✅ nested person (no salary)
│   │   ├── deal.model.ts               ✅ nested StaffItem with person
│   │   ├── lead.models.ts              ✅ nested person (no salary)
│   │   ├── staff.model.ts               ✅ PersonInfo + StaffItem with nested person
│   │   ├── staff-presence.model.ts     ✅ StaffStatusItem, StaffActivityLogItem
│   │   ├── dashboard.model.ts           ✅ ChartDealItem with idDeal
│   │   ├── task.model.ts               ✅ String status/priority (PENDING, IN_PROGRESS, etc.)
│   │   ├── note.model.ts               ✅ NoteItem with @mention support
│   │   ├── notification.model.ts       ✅ NotificationItem with type labels/colors
│   │   ├── calendar.model.ts           ✅ String eventType/status (MEETING, CALL, SCHEDULED, etc.)
│   │   ├── team.model.ts               ✅ TeamMemberItem with OWNER/MEMBER/VIEWER
│   │   ├── audit-log.model.ts          ✅ AuditLogItem with action/entity labels
│   │   └── report.model.ts             ✅ Updated to match backend DTOs
│   └── services/
│       ├── api.service.ts               ✅ graphql<T>() method, error handling
│       ├── auth.service.ts              ✅ Login data extraction fixed
│       ├── customer.service.ts          ✅ CRUD operations
│       ├── lead.service.ts              ✅ CRUD + UploadExcelLead
│       ├── contact.service.ts           ✅ CRUD operations
│       ├── deal.service.ts              ✅ CRUD operations
│       ├── staff.service.ts             ✅ GetListStaff, GetStaffById
│       ├── dashboard.service.ts         ✅ GetStatistics, GetChartDeal
│       ├── task.service.ts              ✅ CRUD with string status/priority
│       ├── note.service.ts              ✅ Notes with @mention support
│       ├── notification.service.ts     ✅ CRUD - mutations return Boolean
│       ├── calendar.service.ts          ✅ String eventType/status
│       ├── team.service.ts              ✅ Fixed mutation args
│       ├── audit-log.service.ts         ✅ Admin only audit logs
│       ├── report.service.ts            ✅ Updated to match backend DTOs
│       ├── staff-presence.service.ts    ✅ Staff status, activity logs
│       ├── search.service.ts            ✅ Uses graphql() with parameterized query
│       ├── ai.service.ts                ⚠️ Commented - backend AI feature commented out
│       ├── toast.service.ts             ✅ Enhanced with warning type
│       └── preference.service.ts        ✅ Theme management with signals (NEW)
├── features/
│   ├── auth/
│   │   ├── pages/
│   │   │   ├── authen/                 ✅ Gradient background, centered card, SVG icons
│   │   │   ├── forgot-password/        ✅ Gradient background, centered card, SVG icons
│   │   │   └── reset-password/         ✅ Gradient background, centered card, SVG icons
│   │   └── components/otp/              ✅ alert() removed, 6-box OTP, toast notifications
│   ├── contacts/
│   │   ├── pages/contact-list/         ✅ Table layout, stat cards, modern UI
│   │   └── pages/contact-detail/        ✅ Card-based sections, no ID displayed
│   ├── customers/
│   │   ├── pages/customer-list/        ✅ Table layout, stat cards, modern UI
│   │   └── pages/customer-detail/      ✅ Card-based sections, no ID displayed
│   ├── dashboard/
│   │   └── pages/dashboard/            ✅ Gradient stat cards, enhanced charts (2026-05-17)
│   ├── deals/
│   │   ├── pages/deal-list/            ✅ Table layout, stat cards, modern UI
│   │   └── pages/deal-detail/          ✅ Card-based sections, no ID displayed
│   ├── leads/
│   │   ├── pages/lead-list/            ✅ Table layout, stat cards, modern UI
│   │   └── pages/lead-detail/          ✅ Card-based sections, no ID displayed
│   ├── staff/
│   │   └── pages/staff-list/           ✅ Table layout, stat cards, fixed person.phone/location
│   ├── tasks/
│   │   ├── pages/task-list/            ✅ Table + confirmation modal for status change
│   │   └── pages/task-detail/          ✅ Card-based + confirmation modal
│   ├── notifications/
│   │   └── pages/notification-list/     ✅ Notification list with fixed navigation
│   ├── calendar/
│   │   └── pages/calendar-list/        ✅ Calendar view with string eventType/status
│   ├── audit-log/
│   │   └── pages/audit-log-list/       ✅ Admin only - filtering by entity/action/date
│   ├── reports/
│   │   └── pages/report-list/          ✅ Updated to match backend DTOs
│   └── settings/                        ✅ NEW (2026-05-17)
│       └── pages/settings/
│           ├── settings.component.ts    ✅ Theme selector page
│           ├── settings.component.html  ✅ Theme cards with preview
│           └── settings.component.css
├── layouts/
│   └── main-layout/                    ✅ Dynamic theme, enhanced sidebar/topbar (2026-05-17)
│       ├── main-layout.component.ts     ✅ isRouteActive() method for nav
│       ├── main-layout.component.css   ✅ Hide scrollbar CSS
│       └── main-layout.html            ✅ Redesigned sidebar/topbar
├── guards/
│   └── auth.guard.ts
└── shared/
    ├── components/
    │   ├── toast/                      ✅ SVG icons, progress bar, gradient backgrounds
    │   └── confirm-dialog/             ✅ Backdrop blur, gradient header, reusable
    └── pipes/
        └── date-pipe.ts
```

---

## Theme System (NEW - 2026-05-17)

### Available Themes

| Theme | Icon | Description |
|-------|------|-------------|
| Light | ☀️ | Default light theme with white cards |
| Dark | 🌙 | Dark theme with slate-900 backgrounds |
| Nature | 🌿 | Green-tinted natural theme |
| Ocean | 🌊 | Blue ocean-themed theme |
| Sunset | 🌅 | Warm sunset-themed theme |

### Theme Configuration (preference.service.ts)

```typescript
export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  icon: string;
  sidebarBg: string;
  sidebarText: string;
  sidebarHover: string;
  sidebarActive: string;
  contentBg: string;
  headerBg: string;
  cardBg: string;
  taskCardBg: string;        // NEW - Task card background (lighter than column bg)
  textPrimary: string;
  textSecondary: string;
  borderColor: string;
  inputBg: string;
  dropdownBg: string;
  tableHeaderBg: string;
  tableRowBg: string;
  tableRowHover: string;
  chartGridColor: string;
  statCardBg: string;
  statCardBorder: string;
}
```

### Dark Mode Status Badge Colors (2026-05-17)

Task status badges in dark mode:
```typescript
getStatusClass(status: string): string {
  if (this.themeConfig().id === 'dark') {
    const darkColors: Record<string, string> = {
      'PENDING': 'bg-slate-700 text-slate-200',
      'IN_PROGRESS': 'bg-blue-900 text-blue-200',
      'COMPLETED': 'bg-green-900 text-green-200',
      'CANCELED': 'bg-red-900 text-red-200'
    };
    return darkColors[status] || 'bg-slate-700 text-slate-200';
  }
  return this.statusColors[status] || 'bg-slate-100 text-slate-600';
}
```

Notification type badges in dark mode:
```typescript
// In notification-list.component.ts
getTypeClass(type: string): string {
  if (this.themeConfig().id === 'dark') {
    const darkColors: Record<string, string> = {
      'SUCCESS': 'bg-green-900 text-green-200',
      'WARNING': 'bg-amber-900 text-amber-200',
      'ERROR': 'bg-red-900 text-red-200',
      'INFO': 'bg-blue-900 text-blue-200',
      'APPOINTMENT': 'bg-purple-900 text-purple-200'
    };
    return darkColors[type] || 'bg-slate-700 text-slate-200';
  }
  return this.typeColors[type] || 'bg-slate-100 text-slate-600';
}
```

### Dynamic Theme Usage

All pages use dynamic theme classes for contrast:
- `[class]="themeConfig().contentBg"` - page background
- `[class]="themeConfig().cardBg"` - cards
- `[class]="themeConfig().statCardBg + ' ' + themeConfig().statCardBorder"` - stat cards
- `[class]="themeConfig().textPrimary"` - primary text
- `[class]="themeConfig().textSecondary"` - secondary text

### Pages with Full Dark Mode Support

| Page | Status |
|------|--------|
| Auth (Login/Register/OTP) | ✅ Full dark mode (NEW) |
| Dashboard | ✅ Full dark mode |
| Lead List | ✅ Full dark mode |
| Lead Detail | ✅ Full dark mode |
| Customer List | ✅ Full dark mode |
| Customer Detail | ✅ Full dark mode |
| Contact List | ✅ Full dark mode |
| Contact Detail | ✅ Full dark mode |
| Deal List | ✅ Full dark mode |
| Deal Detail | ✅ Full dark mode |
| Staff List | ✅ Full dark mode |
| Task List | ✅ Modals + badges + empty state |
| Task Detail | ✅ Full dark mode |
| Calendar List | ✅ Modals + event cards |
| Notification List | ✅ Full dark mode |
| Settings | ✅ Full dark mode |
| Audit Log | ✅ Full dark mode |
| Reports | ✅ Full dark mode |

### Sidebar Navigation (Updated)

| Menu | ADMIN | STAFF |
|------|-------|-------|
| Dashboard | ✅ | ✅ |
| Leads | ✅ | ✅ |
| Customers | ✅ | ✅ |
| Contacts | ✅ | ✅ |
| Deals | ✅ | ✅ |
| Staff | ✅ | ❌ |
| Tasks | ✅ | ✅ |
| Calendar | ✅ | ✅ |
| Audit Log | ✅ | ❌ |
| Reports | ✅ | ❌ |
| Settings | ✅ | ✅ | ← Visible to all (2026-05-17) |

### Auth Pages (UPDATED - 2026-05-17)
All auth pages now support dark mode and use toast notifications:
| Page | Path | Dark Mode | Toast Notifications | Password Toggle |
|------|------|-----------|---------------------|-----------------|
| Login | /authen | ✅ Full support | ✅ Success/Error | ✅ Eye icon |
| Forgot Password | /forgot-password | ✅ Full support | ✅ Success/Error | N/A |
| OTP Forgot Password | /otp-forgot-password | ✅ Full support | ✅ Success (6-box OTP) | N/A |
| Reset Password | /reset-password | ✅ Full support | ✅ Success/Error | ✅ Eye icons |

**Note**: Register page has been removed (registration no longer a function).

### Theme Color Visibility Rules (NEW)

For colored status badges and numbers, use conditional dark mode variants:
```html
<!-- Emerald (Won deals, Staff) -->
[class]="themeConfig().id === 'dark' ? 'text-emerald-400' : 'text-emerald-600'"

<!-- Amber (Negotiating, Pending) -->
[class]="themeConfig().id === 'dark' ? 'text-amber-400' : 'text-amber-600'"

<!-- Red (Lost) -->
[class]="themeConfig().id === 'dark' ? 'text-red-400' : 'text-red-600'"

<!-- Purple (Admin) -->
[class]="themeConfig().id === 'dark' ? 'text-purple-400' : 'text-purple-600'"

<!-- Green (Completed) -->
[class]="themeConfig().id === 'dark' ? 'text-green-400' : 'text-green-600'"
```

For icon backgrounds:
```html
[class]="themeConfig().id === 'dark' ? 'bg-emerald-900/30' : 'bg-emerald-50'"
```

---

## UI Design System

### Color Palette
| Element | Color |
|---------|-------|
| Primary | `slate-900` |
| Background | `slate-100` |
| Cards | `white` with `rounded-xl shadow-md border border-slate-100` |
| Active/Accent | `sky-500` / `emerald-500` |
| Status Colors | Success: `green`, Warning: `amber`, Error: `red`, Info: `blue` |

### Page Layout Pattern
```html
<!-- Page container -->
<div class="bg-slate-100 min-h-screen p-6">

  <!-- Header with title + action button -->
  <div class="flex items-center justify-between mb-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Page Title</h1>
      <p class="text-sm text-slate-500 mt-1">Page description</p>
    </div>
    <button class="px-5 py-2.5 bg-gradient-to-r from-slate-800 to-slate-900...">
      Add New
    </button>
  </div>

  <!-- Stat cards with icons -->
  <div class="grid grid-cols-4 gap-4 mb-6">
    <div class="bg-white rounded-xl p-5 shadow-md border border-slate-100">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-medium text-slate-500">Label</span>
        <div class="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-emerald-600">...</svg>
        </div>
      </div>
      <p class="text-2xl font-bold text-slate-900">{{ value }}</p>
      <p class="text-xs text-slate-400 mt-1">Subtitle</p>
    </div>
  </div>

  <!-- Data table -->
  <div class="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
    <table class="w-full">
      <thead>
        <tr class="bg-slate-50 border-b border-slate-200">
          <th class="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">Header</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        <tr class="hover:bg-gradient-to-r hover:from-emerald-50...">...</tr>
      </tbody>
    </table>
  </div>
</div>
```

---

## String Enum Types (Backend Returns String, Not Number)

### Task Priority
| Value | Label |
|-------|-------|
| LOW | Low |
| MEDIUM | Medium |
| HIGH | High |
| URGENT | Urgent |

### Task Status
| Value | Label |
|-------|-------|
| PENDING | Pending |
| IN_PROGRESS | In Progress |
| COMPLETED | Completed |
| CANCELED | Cancelled |
| CANCELLED | Cancelled | (backend uses this)

### Calendar Event Type
| Value | Label |
|-------|-------|
| MEETING | Meeting |
| CALL | Call |
| TASK_DEADLINE | Task Deadline |
| FOLLOW_UP | Follow Up |

### Calendar Event Status
| Value | Label |
|-------|-------|
| SCHEDULED | Scheduled |
| IN_PROGRESS | In Progress |
| COMPLETED | Completed |
| CANCELLED | Cancelled |

### Participant Status
| Value | Label |
|-------|-------|
| PENDING | Pending |
| ACCEPTED | Accepted |
| DECLINED | Declined |
| TENTATIVE | Tentative |

### Deal Status
| Value | Label | Color |
|-------|-------|-------|
| OPEN | Open | bg-emerald-500 |
| NEGOTIATING | Negotiating | bg-amber-500 |
| WON | Won | bg-green-500 |
| LOST | Lost | bg-red-500 |

### Contact Status
| Value | Label | Color |
|-------|-------|-------|
| NEW | New | bg-blue-500 |
| IN_PROGRESS | In Progress | bg-amber-500 |
| SUCCESS | Success | bg-green-500 |
| FAILED | Failed | bg-red-500 |
| CLOSED | Closed | bg-purple-500 |
| CANCELED | Canceled | bg-slate-500 |

### Staff Role
| Value | Label | Color |
|-------|-------|-------|
| ADMIN | Admin | bg-purple-100 text-purple-700 |
| STAFF | Staff | bg-blue-100 text-blue-700 |

---

## Role-Based UI

### Sidebar Navigation
| Menu | ADMIN | STAFF |
|------|-------|-------|
| Dashboard | ✅ | ✅ |
| Leads | ✅ | ✅ |
| Customers | ✅ | ✅ |
| Contacts | ✅ | ✅ |
| Deals | ✅ | ✅ |
| Tasks | ✅ | ✅ |
| Calendar | ✅ | ✅ |
| Staff | ✅ | ❌ |
| Audit Log | ✅ | ❌ |
| Reports | ✅ | ❌ |
| **Settings** | ✅ | ✅ |

### main-layout.component.ts
```typescript
isAdmin(): boolean {
  return this.currentStaff?.role === 'ADMIN';
}
```

### Dynamic Theme (main-layout.html)
```html
<aside class="w-64 {{ themeConfig().sidebarBg }} flex flex-col...">
<header class="h-16 {{ themeConfig().headerBg }} ...">
<section class="flex-1 p-6 {{ themeConfig().contentBg }} ...">
```

---

## Notification Type Labels & Colors

```typescript
export const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  'TASK_ASSIGNED': 'Task Assigned',
  'TASK_COMPLETED': 'Task Completed',
  'DEAL_UPDATED': 'Deal Updated',
  'CONTACT_STATUS_CHANGED': 'Contact Status Changed',
  'MENTION': 'Mentioned',
  'SYSTEM': 'System',
  'NotificationReminder': 'Reminder'
};

export const NOTIFICATION_TYPE_COLORS: Record<string, string> = {
  'TASK_ASSIGNED': 'bg-blue-100 text-blue-700',
  'TASK_COMPLETED': 'bg-green-100 text-green-700',
  'DEAL_UPDATED': 'bg-amber-100 text-amber-700',
  'CONTACT_STATUS_CHANGED': 'bg-purple-100 text-purple-700',
  'MENTION': 'bg-cyan-100 text-cyan-700',
  'SYSTEM': 'bg-slate-100 text-slate-600',
  'NotificationReminder': 'bg-orange-100 text-orange-700'
};
```

---

## GraphQL Mutation Fixes

### Fixed Argument Names
All mutations use `input: $input` instead of `<name>Input: $input`:

| Service | Mutation | Fixed |
|---------|----------|-------|
| task.service.ts | createTask | `input: $input` |
| task.service.ts | updateTask | `idTask: $idTask, input: $input` |
| note.service.ts | createNote | `input: $input` |
| note.service.ts | updateNote | `idNote: $idNote, input: $input` |
| calendar.service.ts | createCalendarEvent | `input: $input` |
| calendar.service.ts | updateCalendarEvent | `idEvent: $idEvent, input: $input` |
| calendar.service.ts | cancelCalendarEvent | Boolean return (no selection) |
| calendar.service.ts | addParticipant | Fixed: `input: $input` (was `eventParticipantInput`) |
| team.service.ts | addTeamMember | `input: $input` |
| team.service.ts | updateTeamMember | `idTeamMember: $idTeamMember, input: $input` |
| auth.service.ts | confirmOTPForgotPassword | `ChangePasswordRequestInput!` (was `ChangePasswordRequest!`) |

### Notification Mutations (Boolean Return)
Backend returns `Boolean!` for these mutations - no subfields selection allowed:

| Mutation | Return Type | Fix Applied |
|---------|-------------|-------------|
| markAsRead | Boolean! | Removed subfields selection |
| markAllAsRead | Boolean! | Already correct |
| pinNotification | Boolean! | Removed subfields selection |
| deleteNotification | Boolean! | Removed subfields selection |

---

## Entity ID Handling

**UUIDs are NOT displayed to users** - they are hidden from UI but still processed internally:

- Task Linked Entity: Only type label shown (Lead/Customer/Deal), no Entity ID
- Task forms: Entity ID field removed from UI
- All detail pages: No IDs displayed to users

---

## Notification Redirect Navigation

### Route Map (main-layout & notification-list)
```typescript
const routeMap: Record<string, { path: string; useQueryParam: boolean }> = {
  'Task': { path: '/tasks', useQueryParam: false },      // /tasks/:id
  'Lead': { path: '/lead-detail', useQueryParam: true },   // /lead-detail?id=
  'Customer': { path: '/customer-detail', useQueryParam: true },
  'Contact': { path: '/contact-detail', useQueryParam: true },
  'Deal': { path: '/deal-detail', useQueryParam: true }
};
```

**Important**: Backend returns capitalized entity types (`'Lead'`, `'Customer'`, `'Task'`) - NOT uppercase.

---

## Build Status

```
npm run build  # ✅ Success (2026-05-17)
```

**Token Settings (Backend)**:
- Access Token Expiration: 5 minutes
- Refresh Token Expiration: 7 days
- Refresh token stored in HTTP-only cookie (Secure, SameSite=None)

**Build Output**:
- main-*.js: ~1.17 MB
- Total: ~1.17 MB (including Kanban board + task priority indicators + theme enhancements)

**Budget**: 1MB warning (expected with Settings + Themes + Kanban board features)

**Warnings** (non-blocking):
- NG8107 optional chain simplifications in contact-detail.html, task-detail.html, task-list.html
- Bundle size exceeded original 500kB budget (expected with all pages)

---

## Bug Fixes (2026-05-17)

### Previously Fixed (2026-05-16)

1. **Task Status Type** - Backend returns string enum, not number
   - Fixed: Changed priority/status from `number` to `string` in model
   - Fixed: Form selects use string values (PENDING, LOW, etc.)
   - Fixed: Service uses `statusMap` to convert string → int for mutations

2. **Task Mutation Args** - Wrong argument order
   - Fixed: `updateTask(taskUpdateInput: $input, idTask: $idTask)` → `updateTask(idTask: $idTask, input: $input)`

3. **Calendar Event Type/Status** - Backend returns string enum, not number
   - Fixed: Changed `eventType` and `status` to string type in CalendarEventItem
   - Fixed: All label/color maps use `Record<string>`
   - Fixed: Filter methods compare against string values

4. **Notification Dropdown** - Click bell shows dropdown with type-based icons/colors
   - Type-based styling with unique icons
   - Click notification → mark as read + navigate to entity
   - "Mark all read" and "View all" links

5. **Task Status Confirmation Modal**
   - On status change → popup confirmation with warning icon
   - Shows new status label before confirming
   - Applied to both task-list and task-detail pages

6. **Staff List UI** - Phone/Location showed empty
   - Fixed: `s.phone` → `s.person?.phone`, `s.location` → `s.person?.location`

7. **Staff Route Missing** - `/staff` redirected to dashboard
   - Fixed: Added `StaffListComponent` import + route in app.routes.ts

8. **cancelCalendarEvent** - Backend returns Boolean! not object
   - Fixed: Removed subfields selection from mutation

### Newly Fixed (2026-05-17)

9. **CalendarService addParticipant param name**
   - Issue: `addParticipant(eventParticipantInput: $input)` - wrong param name
   - Fix: Changed to `addParticipant(input: $input)`

10. **Notification mutations - subfields on Boolean**
    - Issue: GraphQL error "Field must not have a selection since type Boolean! has no subfields"
    - Fix: `markAsRead`, `pinNotification`, `deleteNotification` - removed subfields, return `Observable<boolean>`

11. **Notification redirect to dashboard**
    - Issue: Task notification redirected to dashboard (not found)
    - Root cause 1: `main-layout.ts` routeMap used uppercase keys (`'TASK'`) but backend returns capitalized (`'Task'`)
    - Root cause 2: `notification-list.ts` `getRouteForEntity` used wrong paths (`/leads/${entityId}`)
    - Fix: Updated routeMap keys to match backend case, fixed paths to match `app.routes.ts`

12. **Task redirect - missing entity ID**
    - Issue: Task notification navigated to `/tasks` without ID
    - Fix: Changed to `navigate([route.path, notification.relatedEntityId])`

13. **Report service - mismatched backend DTOs**
    - Issue: Frontend queried fields that don't exist in backend
    - Fixes:
      - DashboardSummary: removed `totalTasks`, `completedTasks`, `pendingTasks`
      - RevenueChart: query `dataPoints { date, wonAmount, lostAmount, pipelineValue }`
      - PipelineFunnel: query single object (not array), use `openDealsCount`, `wonDealsCount` etc.
      - TopPerformingStaff: query `staffPerformances { ... }` array
      - LeadConversion: `convertedCustomers` → `convertedLeads`
      - StaffPerformance: `avgDealValue` → `averageDealValue`
      - DateTime params: use `DateTime!` (required), not nullable

14. **StaffPresenceService created**
    - New service added for staff status tracking
    - Provides `GetStaffStatuses`, `GetOnlineStaffs`, `GetStaffActivityLogs`
    - Mutations: `UpdateMyStatus`, `RefreshLastActive`

15. **Dashboard header redesigned**
    - Issue: "Dashboard" title and "Welcome back" text looked plain
    - Fix: Added gradient icon box, styled title with gradient text, dot separators for subtitle
    - Date moved to styled card on right side

16. **Settings & Theme System (NEW)**
    - Created `preference.service.ts` with Angular signals for reactive theme state
    - 5 themes: Light (☀️), Dark (🌙), Nature (🌿), Ocean (🌊), Sunset (🌅)
    - Theme persisted to localStorage via `effect()`
    - Settings page at `/settings` with theme selector cards
    - Dynamic theme classes applied to sidebar, header, and content areas
    - Added Settings nav item to sidebar (visible to all users)

17. **Sidebar Navigation Fix**
    - Issue: Dashboard nav item had different styling than other nav items
    - Fix: Unified all nav items with same `rounded-lg mx-2` padding and hover effects

18. **Dashboard Charts Enhanced**
    - Line chart: custom tooltips, grid lines, hover points (radius: 0 → hover: 6), smooth animation
    - Bar chart: rounded corners (borderRadius: 6), custom tooltips, grid lines
    - Pie chart: legend at bottom, custom tooltips, rotate animation
    - All charts: dark-themed tooltips with Inter font, 1500ms easing

19. **Staff List - Row Dividers**
    - Issue: Staff list had hardcoded black dividers between rows unlike other list pages
    - Fix: Removed `[class]="'divide-y ' + themeConfig().borderColor"` from tbody

20. **Task List - Status Display**
    - Issue: Task status was dropdown, not visible badges
    - Fix: Changed to colored badge using `getStatusClass()` method with dark mode variants

21. **Task/Calendar Modals - Dark Mode**
    - Issue: Create/Edit and Confirm modals had hardcoded light mode colors
    - Fix: All modal elements now use dynamic theme classes

22. **Notification List Page - Dark Mode**
    - Issue: Notification list page used hardcoded colors not adapting to theme
    - Fix: Page background, header, cards, text all use dynamic theme classes

23. **Notification Dropdown - Dark Mode**
    - Issue: Header notification dropdown had hardcoded light colors
    - Fix: Dropdown container, header, items, and type badges all use dynamic theme classes
    - Added dark mode variants for `getNotificationTypeClass()` in main-layout.component.ts

24. **Notification Type Badges - Dark Mode**
    - Issue: Type badges in notification pages not visible in dark mode
    - Fix: Added dark mode color variants in `notification-list.component.ts` getTypeClass() method

25. **Auth Pages - Dark Mode Support (NEW)**
    - Issue: Auth pages (authen, register, OTP) had no dark mode support - all hardcoded slate colors
    - Fix: Injected PreferenceService into auth components
    - Changes:
      - authen.html: Page bg, card, headings, labels, inputs, links all use themeConfig
      - register.html: Same pattern as authen
      - otp-register.html: OTP form with dynamic theme
      - otp-forgot-password.html: Same as otp-register
    - Brand title: Gradient in light mode, white text in dark mode (conditional)

26. **Main Layout - Sidebar/Header Text Visibility (NEW)**
    - Issue: Gradient title invisible in dark mode, hardcoded text colors
    - Fix: Brand title (SIDEBOARD) uses conditional styling
    - Fix: User name and role in sidebar header use themeConfig().sidebarText
    - Fix: Logout button uses themeConfig().sidebarText with dark mode hover
    - Fix: Header name gradient - solid white in dark mode

27. **Dashboard - Text Visibility Fixes (NEW)**
    - Issue: Heading gradient `from-slate-800 to-slate-600` invisible in dark mode
    - Fix: Heading uses conditional - white text in dark mode, gradient in light mode
    - Fix: Welcome text uses themeConfig().textSecondary
    - Fix: Quick Summary stat numbers (purple-600, red-600, amber-600, green-600)
      - Dark mode: text-purple-400, text-red-400, text-amber-400, text-green-400

28. **Deal List - Stat Badge Colors (NEW)**
    - Issue: Won/Negotiating/Lost stat badges hardcoded for light mode
    - Fix: Label, icon, and number colors use conditional dark mode variants
      - Won: text-emerald-600 (light) → text-emerald-400 (dark)
      - Negotiating: text-amber-600 → text-amber-400
      - Lost: text-red-600 → text-red-400
      - Icon backgrounds: bg-emerald-50 → bg-emerald-900/30 (dark)

29. **Staff List - Stat Badge Colors (NEW)**
    - Issue: Admin/Staf stat badges hardcoded for light mode
    - Fix: Same pattern as deal list with conditional dark mode variants
      - Admin: text-purple-600 → text-purple-400
      - Staff: text-emerald-600 → text-emerald-400

30. **Task List - Button & Empty State Fixes (NEW)**
    - Issue: Edit/delete buttons and empty state text not visible in dark mode
    - Fix: Edit button uses conditional text/slate-500 (light) → text/slate-400 (dark)
    - Fix: Delete button uses conditional text-red-500 (light) → text-red-400 (dark)
    - Fix: Empty state icon container bg-slate-100 → dark mode variant
    - Fix: Empty state text uses themeConfig().textSecondary

31. **Row Dividers Removed from List Pages (NEW)**
    - Issue: Table rows had visible dividers (black lines) unlike staff list
    - Fix: Removed `[class]="'divide-y ' + themeConfig().borderColor"` from tbody
    - Affected pages: customer-list, lead-list, contact-list, deal-list, task-list, audit-log, reports

32. **Notification Button Border in Header (NEW)**
    - Issue: Notification bell button had visible ring/border in light mode
    - Fix: Changed to conditional classes - dark mode uses slate colors, light mode uses sky

33. **Action Buttons Made More Prominent (NEW)**
    - Issue: Slate gradient buttons (from-slate-800 to-slate-900) were too muted
    - Fix: Changed primary action buttons to sky gradient with dark mode variants
    - List page Add/Create buttons: bg-sky-600/700 (dark) / from-sky-600 to-sky-700 (light)
    - Detail page Edit buttons: Same sky gradient pattern
    - Detail page Save buttons: Keep emerald gradient for confirmation
    - Affected pages:
      - deal-list.html: Add Deal button
      - customer-list.html: Add Customer button
      - lead-list.html: Add Lead button
      - contact-list.html: Add Contact button
      - task-list.html: Create Task button
      - calendar-list.html: New Event button
      - deal-detail.html: Edit/Save buttons
      - customer-detail.html: Edit/Save buttons
      - lead-detail.html: Edit/Save buttons
      - contact-detail.html: Edit/Save buttons
      - task-detail.html: Edit/Save buttons
      - reports.html: Refresh button

34. **confirmOTPForgotPassword GraphQL Type Fix**
    - Issue: Backend returns error "Variable `input` is not compatible with type ChangePasswordRequest!"
    - Fix: Changed mutation type from `ChangePasswordRequest!` to `ChangePasswordRequestInput!`
    - File: auth.service.ts line 83

35. **Reports Page Redesign (NEW)**
    - Issue: Reports page looked outdated with old card layout
    - Fix: Redesigned with gradient stat cards, progress bars, card-based staff performance grid
    - Added: Icon headers, descriptions, Win Rate stat with progress bar
    - Fix: Conversion rate progress bar using `[style.width.%]` instead of string

36. **Sidebar Redesign (NEW)**
    - Issue: Sidebar looked plain and outdated
    - Fix: Added gradient background, logo with icon, gradient dividers
    - Active state: border-left sky-400 instead of background
    - User section: backdrop blur, border, gradient avatar

37. **Topbar Redesign (NEW)**
    - Issue: Topbar looked plain with hardcoded colors
    - Fix: Backdrop blur, gradient accent bar, gradient user name
    - Notification dropdown: Uses themeConfig for dark/light mode
    - Role badge: Conditional background based on theme

38. **Password Visibility Toggle (NEW)**
    - Issue: Users couldn't see password while typing
    - Fix: Added eye icon toggle on login and reset password forms
    - Files: authen.component.ts/html, reset-password.component.ts/html

39. **Sidebar Scrollbar Hidden (NEW)**
    - Issue: Scrollbar appeared when zooming browser, looked ugly
    - Fix: CSS to hide scrollbar while keeping scroll functionality
    - File: main-layout.css - `::-webkit-scrollbar { display: none }`

40. **Team Assignment Integration (NEW - 2026-05-17)**
    - Issue: TeamService existed but was not integrated into any page
    - Fix: Integrated into Deal Detail page (`deal-detail.component.ts/html`)
    - Features added:
      - View team members of a deal
      - Add team member (select staff + role: Owner/Member/Viewer)
      - Remove team member
      - Dark mode support for role badges
      - Filter out already-assigned staff from dropdown
    - Files modified:
      - `deal-detail.component.ts` - Added TeamService, StaffService, team management methods
      - `deal-detail.html` - Added Team Members card section

41. **Team Role Enum Fix (2026-05-17)**
    - Issue: Backend returns string enum ("OWNER", "MEMBER", "VIEWER") but frontend checked number ("0", "1", "2")
    - Fix: Changed all role comparisons from number to string
    - Files modified:
      - `deal-detail.component.ts` - All role checks now use string comparison
      - `team.model.ts` - Changed `TeamMemberRequest.role` from `number` to `string`
      - `deal-detail.html` - Role dropdown values changed to string enum

42. **Team Role Permission System (2026-05-17)**
    - Issue: Need full role-based permission system for Deal List and Deal Detail
    - Permission Matrix:
      | Action | OWNER | MEMBER (canEdit=true) | MEMBER (canEdit=false) | VIEWER |
      |--------|-------|----------------------|------------------------|--------|
      | View entity | ✅ | ✅ | ✅ | ✅ |
      | Edit entity | ✅ | ✅ | ❌ | ❌ |
      | Delete entity | ✅ | ❌ | ❌ | ❌ |
      | Add member | ✅ | ❌ | ❌ | ❌ |
      | Remove member | ✅ | ❌ | ❌ | ❌ |
    - Deal List: Query team members for each deal, store in `dealPermissions` Map
    - Deal Detail: Use `canEdit()` function and `member.canDelete` field
    - Files modified:
      - `deal-list.component.ts` - Added TeamService, AuthService, dealPermissions Map
      - `deal-list.html` - Delete button uses `canDeleteDeal(d.idDeal)`
      - `deal-detail.component.ts` - Role checks use string comparison, canEdit/canDelete functions
      - `deal-detail.html` - Edit button uses `canEdit()`, Add Member uses `isOwner()`, Remove uses `canUpdateMemberPermissions()`

43. **getDeals / getMyDeals API Split (2026-05-17)**
    - Issue: Backend separated deals API for ADMIN vs STAFF
    - Solution:
      - ADMIN: `getDeals` → all system deals
      - STAFF: `getMyDeals` → only own deals + team member deals
    - Files modified:
      - `deal.service.ts` - Added `GetMyDeals()` method for STAFF
      - `deal-list.component.ts` - `loadDeals()` checks role and calls appropriate API

44. **JWT Token Decoding (2026-05-17)**
    - Issue: Backend JWT uses "sub" claim, localStorage staff_info may be out of sync
    - Solution: Decode JWT directly to get user ID and role
    - Methods added to `auth.service.ts`:
      - `decodeJWT()` - Decode JWT payload to get claims (sub, role, email, name)
      - `getCurrentUserId()` - Returns `sub` claim from JWT
      - `getCurrentUserRole()` - Returns `role` claim (supports both custom and Microsoft format)
    - Files modified:
      - `auth.service.ts` - Added decodeJWT, getCurrentUserId, getCurrentUserRole methods
      - `deal-list.component.ts` - Uses `authService.getCurrentUserRole()` for ADMIN check
      - `deal-detail.component.ts` - Uses JWT claims instead of localStorage staff_info

45. **Token Refresh System (2026-05-17)**
    - Issue: Access token expires after 5 minutes, needs auto-refresh
    - Solution: Error interceptor catches 401, calls refreshToken mutation, retries request
    - Components:
      - `auth.service.ts` - Added `refreshToken()`, `getTokenExpiration()`, `isTokenExpired()`
      - `error.interceptor.ts` - 401 → refreshToken() → retry with new token
      - Backend: `RefreshTokenAsync` has `[AllowAnonymous]` to bypass auth
    - Debug logs added for troubleshooting:
      - `[Auth] JWT decode result:`
      - `[Auth] Raw exp value:`
      - `[Auth] Token expired check:`
      - `[ErrorInterceptor] 401 received, attempting token refresh...`
      - `[Auth] refreshToken() called`
      - `[Auth] Refresh SUCCESS` / `[Auth] Refresh failed`
    - Note: Refresh token stored in HTTP-only cookie (set on login), 7-day expiration
    - Note: Incognito mode may not receive cookies - use normal tab for testing

46. **Deal Detail Load for Team Members (PENDING - Backend Fix Required)**
    - Issue: STAFF who is team MEMBER cannot view deal detail (GetDealById only checks creator)
    - Root cause: `GetDealById` in DealQuery.cs only checks `IdStaff == currentUserId`
    - Backend needs fix:
      - Check if user is creator OR team member
      - Similar to GetMyDeals logic: query team_members for deal membership
    - Current behavior: Only creator (IdStaff) can view deal detail

47. **STAFF Task Kanban Board (2026-05-17)**
    - Issue: STAFF task list was displayed as table, less intuitive than Kanban board
    - Solution: STAFF sees 4-column Kanban board with drag-drop status change
    - Features:
      - 4 columns: Pending, In Progress, Completed, Cancelled
      - Drag-drop to change task status (direct API update, no confirmation modal)
      - Tasks sorted by due date (earliest first, no due date last)
      - Priority color indicator on left border of each task card
      - Priority badge with updated colors (LOW=green, MEDIUM=blue, HIGH=orange, URGENT=red)
      - Task card shows: priority badge, task ID, title, description, assignee avatar + name, due date
      - Overdue date highlighted in red
      - Scrollable columns with max-height
      - Dark mode task card background (bg-slate-700, brighter than column bg-slate-800)
    - ADMIN keeps original table layout
    - Files modified:
      - `task-list.component.ts` - Added CDK DragDrop, grouped tasks by status, drop handler
      - `task-list.html` - Kanban layout for STAFF, table for ADMIN
      - `task.model.ts` - Added TASK_PRIORITY_BORDER_COLORS, updated priority colors
      - `preference.service.ts` - Added taskCardBg theme property
      - `enums.ts` - Added CANCELLED status
      - `task.service.ts` - Added CANCELLED to statusMap

---

## Verification Checklist

- [x] Dashboard shows statistics with gradient stat cards
- [x] List pages (Contacts, Deals, Leads, Customers, Staff) use table layouts
- [x] Detail pages show human-readable info (no UUIDs displayed)
- [x] ADMIN sees Staff, Audit Log, Reports, Settings menu items
- [x] STAFF sees Dashboard, Leads, Customers, Contacts, Deals, Tasks, Calendar, Settings
- [x] Notification dropdown shows type-based icons and colors (dark mode compatible)
- [x] Task status change requires confirmation popup
- [x] Auth pages have modern gradient styling
- [x] Modals have backdrop blur and smooth animations
- [x] Empty states show helpful messages with icons
- [x] Hover effects on table rows for better UX
- [x] Status badges use consistent color coding
- [x] Build succeeds without errors
- [x] Calendar list displays events with string enum types
- [x] All mutations use correct argument names
- [x] Notification clicks navigate to correct entity pages
- [x] Report queries match backend DTO structure
- [x] Theme switching works correctly with 5 themes
- [x] Theme persists across page refresh (localStorage)
- [x] Settings page accessible via sidebar
- [x] Team role permission system works correctly (OWNER/MEMBER/VIEWER)
- [x] Deal List shows delete button only for OWNER
- [x] Deal Detail edit button shows based on canEdit permission
- [x] Deal Detail add/remove member buttons show based on OWNER permission
- [x] Dashboard header styled with gradient icon and subtitle
- [x] Notification list page fully supports dark mode
- [x] Task list status displayed as badges (not dropdowns) in both themes
- [x] Task/Calendar modals use dynamic theme classes
- [x] All detail pages (task, deal, customer, lead, contact) use dynamic theme
- [x] Auth pages show toast notifications (login, forgot password, OTP, reset)
- [x] OTP pages use 6-box input with auto-advance
- [x] confirmOTPForgotPassword uses correct GraphQL type (ChangePasswordRequestInput)
- [x] Password visibility toggle on login and reset password forms
- [x] Reports page redesigned with card-based layout and gradient stats
- [x] Sidebar uses gradient background with modern nav items
- [x] Topbar uses backdrop blur with gradient accents
- [x] Sidebar scrollbar hidden (scroll still works)
- [x] Settings nav visible to all users (not just ADMIN)
- [x] Token refresh system implemented (401 → refresh → retry)
- [x] STAFF Kanban board with drag-drop status change
- [x] Task cards show priority border indicator (green/blue/orange/red)
- [x] Task cards sorted by due date (earliest first)
- [x] Overdue dates highlighted in red on task cards
- [x] Task card background contrasts with column in dark mode
- [x] CANCELLED status supported (backend uses CANCELLED, frontend supports both CANCELED/CANCELLED)

---

## Next Steps (Optional)

1. Fix NG8107 warnings in contact-detail.html (replace `?.` with `.`)
2. Optimize bundle size (lazy load, code splitting)
3. AI Chat integration - backend ChatQuery/ChatMutation are commented out
4. Real-time updates via SignalR (currently using polling)
5. Elasticsearch integration when backend is ready
6. Add more settings options (language, date format, notification preferences)