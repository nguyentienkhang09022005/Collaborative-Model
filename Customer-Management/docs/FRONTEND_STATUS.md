# Frontend Status - 2026-05-16 (Updated)

## Project Info
- **Path**: `D:\Project_Angular\Collaborative-Model\Customer-Management`
- **Framework**: Angular 20.3.x (standalone components)
- **Styling**: Tailwind CSS v4.1.17
- **API**: GraphQL (backend: `https://localhost:7109`)

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
│   │   ├── dashboard.model.ts           ✅ ChartDealItem with idDeal
│   │   ├── task.model.ts               ✅ String status/priority (PENDING, IN_PROGRESS, etc.)
│   │   ├── note.model.ts               ✅ NoteItem with @mention support
│   │   ├── notification.model.ts       ✅ NotificationItem with type labels/colors
│   │   ├── calendar.model.ts           ✅ String eventType/status (MEETING, CALL, SCHEDULED, etc.)
│   │   ├── team.model.ts               ✅ TeamMemberItem with OWNER/MEMBER/VIEWER
│   │   ├── audit-log.model.ts          ✅ AuditLogItem with action/entity labels
│   │   └── report.model.ts             ✅ DashboardSummary, RevenueChart, etc.
│   └── services/
│       ├── api.service.ts               ✅ graphql<T>() method, error handling
│       ├── auth.service.ts              ✅ Login data extraction fixed
│       ├── customer.service.ts          ✅ CRUD operations
│       ├── lead.service.ts              ✅ CRUD + UploadExcelLead
│       ├── contact.service.ts           ✅ CRUD operations
│       ├── deal.service.ts              ✅ CRUD operations
│       ├── staff.service.ts             ✅ GetListStaff, GetStaffById
│       ├── dashboard.service.ts         ✅ GetStatistics, GetChartDeal
│       ├── task.service.ts             ✅ CRUD with string status/priority, fixed mutation args
│       ├── note.service.ts             ✅ Notes with @mention support, fixed mutation args
│       ├── notification.service.ts     ✅ CRUD + GetUnreadCount
│       ├── calendar.service.ts         ✅ String eventType/status, fixed mutation args
│       ├── team.service.ts             ✅ Fixed mutation args
│       ├── audit-log.service.ts        ✅ Admin only audit logs
│       ├── report.service.ts           ✅ Reports + export mutations
│       ├── search.service.ts            ✅ Uses graphql() with parameterized query
│       ├── ai.service.ts                ⚠️ Commented - AI refactor pending
│       └── toast.service.ts             ✅ Enhanced with warning type
├── features/
│   ├── auth/
│   │   ├── pages/
│   │   │   ├── authen/                 ✅ Gradient background, centered card, SVG icons
│   │   │   ├── register/               ✅ Gradient background, centered card, SVG icons
│   │   │   ├── forgot-password/         ✅ Gradient background, centered card, SVG icons
│   │   │   └── reset-password/          ✅ Gradient background, centered card, SVG icons
│   │   └── components/otp/              ✅ alert() removed
│   ├── contacts/
│   │   ├── pages/contact-list/         ✅ Table layout, stat cards, modern UI
│   │   └── pages/contact-detail/       ✅ Card-based sections, no ID displayed
│   ├── customers/
│   │   ├── pages/customer-list/        ✅ Table layout, stat cards, modern UI
│   │   └── pages/customer-detail/      ✅ Card-based sections, no ID displayed
│   ├── dashboard/
│   │   └── pages/dashboard/             ✅ Gradient stat cards with icons, modern charts
│   ├── deals/
│   │   ├── pages/deal-list/            ✅ Table layout, stat cards, modern UI
│   │   └── pages/deal-detail/          ✅ Card-based sections, no ID displayed
│   ├── leads/
│   │   ├── pages/lead-list/            ✅ Table layout, stat cards, modern UI
│   │   └── pages/lead-detail/          ✅ Card-based sections, no ID displayed
│   ├── staff/
│   │   └── pages/staff-list/            ✅ Table layout, stat cards, fixed person.phone/location
│   ├── tasks/
│   │   ├── pages/task-list/           ✅ Table + confirmation modal for status change
│   │   └── pages/task-detail/         ✅ Card-based + confirmation modal
│   ├── notifications/
│   │   └── pages/notification-list/   ✅ Notification list page
│   ├── calendar/
│   │   └── pages/calendar-list/        ✅ Calendar view with string eventType/status
│   ├── audit-log/
│   │   └── pages/audit-log-list/       ✅ Admin only - filtering by entity/action/date
│   └── reports/
│       └── pages/report-list/          ✅ Admin only - dashboard summary, charts, exports
├── layouts/
│   └── main-layout/                     ✅ Role-based sidebar, notification dropdown, logout confirm
├── guards/
│   └── auth.guard.ts
└── shared/
    ├── components/
    │   ├── toast/                       ✅ SVG icons, progress bar, gradient backgrounds
    │   └── confirm-dialog/             ✅ Backdrop blur, gradient header, reusable
    └── pipes/
        └── date-pipe.ts
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

### main-layout.component.ts
```typescript
isAdmin(): boolean {
  return this.currentStaff?.role === 'ADMIN';
}
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

## GraphQL Mutation Fixes (2026-05-16)

### Fixed Argument Names
All mutations now use `input: $input` instead of `<name>Input: $input`:

| Service | Mutation | Fixed |
|---------|----------|-------|
| task.service.ts | createTask | `input: $input` |
| task.service.ts | updateTask | `idTask: $idTask, input: $input` |
| note.service.ts | createNote | `input: $input` |
| note.service.ts | updateNote | `idNote: $idNote, input: $input` |
| calendar.service.ts | createCalendarEvent | `input: $input` |
| calendar.service.ts | updateCalendarEvent | `idEvent: $idEvent, input: $input` |
| calendar.service.ts | cancelCalendarEvent | Boolean return (no selection) |
| team.service.ts | addTeamMember | `input: $input` |
| team.service.ts | updateTeamMember | `idTeamMember: $idTeamMember, input: $input` |

---

## Entity ID Handling

**UUIDs are NOT displayed to users** - they are hidden from UI but still processed internally:

- Task Linked Entity: Only type label shown (Lead/Customer/Deal), no Entity ID
- Task forms: Entity ID field removed from UI
- All detail pages: No IDs displayed to users

---

## Build Status

```
npm run build  # ✅ Success
```

**Build Output**:
- main-*.js: ~890 kB
- styles-*.css: ~52 kB
- polyfills-*.js: ~35 kB
- Total: ~977 kB

**Warnings** (non-blocking):
- NG8107 optional chain simplifications in contact-detail.html
- Bundle size exceeded 500kB budget (expected with all features)

---

## Bug Fixes (2026-05-16)

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

---

## Verification Checklist

- [x] Dashboard shows statistics with gradient stat cards
- [x] List pages (Contacts, Deals, Leads, Customers, Staff) use table layouts
- [x] Detail pages show human-readable info (no UUIDs displayed)
- [x] ADMIN sees Staff, Audit Log, Reports menu items
- [x] STAFF sees only allowed menu items
- [x] Notification dropdown shows type-based icons and colors
- [x] Task status change requires confirmation popup
- [x] Auth pages have modern gradient styling
- [x] Modals have backdrop blur and smooth animations
- [x] Empty states show helpful messages with icons
- [x] Hover effects on table rows for better UX
- [x] Status badges use consistent color coding
- [x] Build succeeds without errors
- [x] Calendar list displays events with string enum types
- [x] All mutations use correct argument names

---

## Next Steps (Optional)

1. Fix NG8107 warnings in contact-detail.html (replace `?.` with `.`)
2. Optimize bundle size (lazy load, code splitting)
3. AI Chat integration when backend ChatQuery is refactored
4. Real-time updates via SignalR (currently using polling)
5. Elasticsearch integration when backend is ready