# Product Requirements Document (PRD)
## New CRM & Lead Management Application

**Document Version:** 1.0  
**Reference:** Uploaded CRM screen recording  
**Product Type:** Web-based CRM application  
**Primary Objective:** Lead tracking, team coordination, task scheduling and customer conversion.

---

## 1. Product Overview

The application will provide a centralized platform for managing the complete lead lifecycle, from initial lead creation to follow-up, customer conversion and sales tracking.

The system should allow business owners and sales teams to:

- Create and manage business leads.
- Assign leads to employees.
- Track lead status and priority.
- Schedule follow-up activities.
- Manage calls, meetings and reminders.
- Maintain notes, attachments and activity history.
- Convert qualified leads into customers.
- Monitor team productivity and lead performance.

## 2. Application Modules

| Module | Priority | Description |
|---|---|---|
| Dashboard | High | Overall business and lead overview |
| Lead Management | Critical | Create, view, edit and manage leads |
| Task Management | Critical | Follow-up and task scheduling |
| Customer Management | High | Manage converted and existing customers |
| Activity Management | High | Track notes, tasks and files |
| Team Management | High | Employee assignment and tracking |
| Sales Management | Medium | Sales pipeline and opportunities |
| Reports & Analytics | Medium | Lead and employee performance |

## 3. Functional Requirements

### 3.1 Dashboard

The dashboard should provide a quick overview of business operations.

**Dashboard widgets:**
- Total Leads
- New Leads
- Open Leads
- Pending Leads
- Converted Leads
- Inactive Leads
- Total Customers
- Pending Tasks
- Completed Tasks
- Today's Follow-ups

**Dashboard visualizations:**
- Lead status distribution
- Leads created over time
- Lead source distribution
- Employee-wise lead distribution
- Task completion overview
- Recent activities

**Dashboard functionality:**
- Date range filter.
- Employee filter.
- Clickable KPI cards.
- Navigate to relevant lead/task records.
- Recent lead and task lists.

### 3.2 Lead Management

This is the primary module of the application.

#### A. Lead Listing

Display all leads in a searchable and filterable data table.

**Table columns:**
1. Serial Number
2. Lead Date
3. Lead Assigned To
4. Contact Name
5. Contact Details
6. Lead Specification / Business Opportunity
7. Rating
8. Status
9. Last Activity
10. Actions

**Available filters:**
- Lead Status
- Lead Rating
- Business Opportunity
- Inactive From
- Lead Date
- Lead Created Date
- Lead Assigned Date
- Lead Source

**Additional functionality:**
- Global lead search.
- Pagination.
- Configurable page size.
- Sorting.
- Bulk lead assignment.
- Bulk import through Excel/CSV.
- Export lead records.
- Quick lead creation.

#### B. Create Lead

Provide a dedicated form to create a new lead.

**Lead information:**

| Field | Type | Required |
|---|---|---|
| Contact Name | Text | Yes |
| Business Mobile | Phone | Yes |
| Lead Date | Date | Yes |
| Lead Owner | Employee selection | Yes |
| Business Opportunity | Dropdown | Yes |
| Lead Source | Dropdown | Yes |
| Rating | Dropdown | Yes |
| Status | Dropdown | Yes |
| Comments | Multiline text | No |

**Lead rating options:**
- Hot
- Warm
- Cold

**Lead status options:**
- Open
- Pending
- Follow-up
- Converted
- Lost

The status values should be configurable by the administrator.

#### C. Lead Details

Clicking a lead should open a detailed lead view.

Display:

**Lead Information**
- Lead Owner
- Lead Date
- Created By
- Created Date & Time
- Last Activity
- Source
- Contact Name
- Business Mobile
- Business Opportunity
- Rating
- Status
- Comments

**Lead actions:**
- Edit Lead
- Assign Lead
- Convert to Customer
- Delete Lead

#### D. Lead Assignment

Allow managers to assign or reassign leads to employees.

Requirements:
- Select one or multiple leads.
- Select an employee.
- Confirm assignment.
- Maintain assignment history.
- Record assigned date and assigned by.
- Notify the assigned employee.

### 3.3 Task Management

Task management is another major feature demonstrated in the recording.

Employees should be able to create follow-up activities against leads.

#### A. Create Task

**Task creation form:**

| Field | Type |
|---|---|
| Assignee | Employee dropdown |
| Type | Dropdown |
| Task Details | Text / Description |
| Due Date | Date and time |
| Location | Location input |
| Participants | Multi-select |
| Priority | Low / Medium / High |
| Status | Dropdown |
| Attachment | File upload |
| Comments | Multiline text |

**Task types observed or indicated in the recording:**
- Call
- Follow-up
- Mail
- Meeting
- Additional configurable task types

#### B. Task Listing

Display all scheduled tasks.

**Table columns:**
- Serial Number
- Assignee
- Task Details
- Task Under (Lead/Customer)
- Type
- Scheduled Time
- Priority
- Status
- Actions

**Task filters:**
- Assignee
- Task Type
- Priority
- Status
- Due Date
- Lead / Customer
- Overdue Tasks

#### C. Task Actions

- View task details.
- Edit task.
- Reschedule task.
- Change priority.
- Change status.
- Mark task as completed.
- Add comments.
- Upload attachments.
- Delete task (with permission).

**Task status:**
- Pending
- In Progress
- Completed
- Cancelled

### 3.4 Lead Activity Management

Each lead should maintain an activity section.

The recording demonstrates three activity categories:

**1. Notes**
- Add notes.
- View previous notes.
- Track author.
- Track creation date and time.

**2. Tasks**
- View tasks linked to the lead.
- Create new tasks.
- Track task completion.
- View upcoming follow-ups.

**3. Files**
- Upload documents.
- View uploaded files.
- Download attachments.
- Delete files based on permissions.

All activities should be associated with the corresponding lead.

### 3.5 Customer Management

The application should support a separate customer management module.

**Proposed functionality:**
- Customer listing.
- Create customer.
- Edit customer.
- Customer profile.
- Contact details.
- Customer activity history.
- Customer-specific tasks.
- Customer documents.
- Search and filtering.

When a lead is converted, the system should create a customer record while retaining the original lead history.

### 3.6 Sales Management

A separate sales module is visible in the reference application's navigation.

The exact sales workflow is not demonstrated in the recording.

Proposed functionality:
- Sales opportunity listing.
- Opportunity details.
- Sales pipeline stages.
- Deal value.
- Assigned salesperson.
- Expected closing date.
- Sales status.
- Sales performance reports.

This module requires further business validation before finalizing its scope.

### 3.7 Team Management

Provide employee and team management functionality.

**Requirements:**
- Employee listing.
- Employee profile.
- Create and update employees.
- Assign roles.
- Assign leads.
- Assign tasks.
- Track employee-wise performance.
- View employee task completion.

---

## 4. User Roles & Permissions

The application should support role-based access control.

| Role | Permissions |
|---|---|
| Super Admin | Full application access |
| Admin | Manage users, leads, tasks and settings |
| Manager | Manage team, assign leads and monitor performance |
| Sales Executive | Manage assigned leads and tasks |
| Employee | Access permitted tasks and records |

Permissions should be configurable at module and action level.

## 5. Global Application Features

### Navigation
- Left sidebar or modern top navigation.
- Dashboard.
- Tasks.
- Leads.
- Customers.
- Sales.
- Reports.
- Settings.

### Global Search
A global search field should support searching:
- Contact names.
- Mobile numbers.
- Lead records.
- Customer records.

### Notifications
- New lead assignment.
- New task assignment.
- Upcoming follow-up.
- Overdue task.
- Lead status changes.
- Task completion.

### User Profile
- Profile information.
- Password management.
- Notification preferences.
- Logout.

## 6. UI/UX Requirements

The new application should have a modern SaaS CRM design.

**Design principles:**
- Clean and professional interface.
- Minimal visual clutter.
- Consistent spacing and typography.
- Clear information hierarchy.
- Responsive layouts.
- Modern data tables.
- Well-designed forms and modal dialogs.
- Consistent status badges.
- Easy-to-understand action buttons.
- Desktop, tablet and mobile compatibility.

**Important design expectations:**

1. Use dedicated detail pages instead of displaying all information in crowded layouts.
2. Use side panels or modals for quick actions.
3. Use clear visual indicators for Hot, Warm and Cold leads.
4. Highlight overdue and upcoming tasks.
5. Provide confirmation before destructive actions.
6. Maintain consistent UI patterns across all modules.

## 7. Data Model – Initial Proposal

The backend should support the following core entities:

1. User
2. Role
3. Permission
4. Lead
5. Lead Assignment History
6. Customer
7. Task
8. Task Participant
9. Lead Activity
10. Notes
11. Attachment
12. Lead Source
13. Business Opportunity
14. Notification
15. Sales Opportunity

### Important relationships

- One lead can have multiple tasks.
- One lead can have multiple notes.
- One lead can have multiple attachments.
- One lead can have multiple assignment history records.
- One customer can have multiple activities.
- One employee can manage multiple leads.
- One employee can have multiple assigned tasks.

## 8. Non-Functional Requirements

### Performance
- Fast page loading.
- Server-side pagination.
- Efficient filtering and searching.
- Optimized API responses.

### Security
- Secure authentication.
- Role-based authorization.
- Protected APIs.
- Secure file uploads.
- Audit logs for important actions.
- Data access restrictions.

### Reliability
- Data validation.
- Error handling.
- Transaction-safe operations.
- Backup and recovery strategy.

### Scalability
- Support multiple teams.
- Support increasing lead volumes.
- Modular backend architecture.
- Extensible configuration.

## 9. Acceptance Criteria

The first release should be considered successful when:

- Users can securely log in.
- Admin can create and manage employees.
- Users can create, edit and view leads.
- Managers can assign and reassign leads.
- Employees can view their assigned leads.
- Users can create tasks against leads.
- Users can update task status.
- Users can maintain notes and attachments.
- Users can view lead activity history.
- Leads can be converted into customers.
- Dashboard information reflects actual records.
- Search, filters and pagination work correctly.
- Role-based permissions are enforced.

## 10. Suggested Development Phases

| Phase | Scope |
|---|---|
| Phase 1 | Authentication, roles and dashboard |
| Phase 2 | Lead management and lead assignment |
| Phase 3 | Task management and follow-ups |
| Phase 4 | Lead activities, notes and attachments |
| Phase 5 | Customer management and conversion |
| Phase 6 | Sales management and reporting |
| Phase 7 | Notifications, audit logs and optimization |

## 11. Scope Clarifications

The following items need confirmation before implementation:

- Whether leads are entered manually, imported, or received through external sources.
- Whether employees can see all leads or only assigned leads.
- Whether lead status changes should trigger automatic tasks.
- Whether follow-up reminders should be sent through WhatsApp, email or in-app notifications.
- Whether customer conversion requires approval.
- Whether sales management requires quotation, invoice and payment tracking.
- Whether multiple organizations should be supported in one application.

---

**End of Initial Product Requirements Document.**
