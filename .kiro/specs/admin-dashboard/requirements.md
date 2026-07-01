# Requirements Document

## Introduction

The Admin Dashboard feature adds a fully responsive, SaaS-style healthcare management interface to the Clinical Vitality web application. It covers 10 admin pages (Dashboard Overview, Patients, Interns, Appointments, Packages, Digital Products, Courses, Services, Blog, Revenue), 6 shared admin components (`AdminPageShell`, `StatCard`, `StatusBadge`, `DataTable`, `EmptyState`, `AdminFormModal`), and a strict three-tier responsive design system (mobile < 768 px, tablet 768–1023 px, desktop ≥ 1024 px). The interface is accessible only to users with the `ADMIN` role and reuses the existing `DashboardLayout`, design tokens, form primitives, and React Query data layer already present in the codebase.

---

## Glossary

- **AdminDashboard**: The React component rendered at `/admin/dashboard` — the command-center overview page.
- **AdminPageShell**: Shared wrapper component that provides consistent page framing (title, subtitle, actions slot, responsive padding) for every admin page.
- **StatCard**: Metric summary card that displays a KPI value, trend indicator, and optional navigation link.
- **StatusBadge**: Pill-shaped status indicator that maps a `BadgeStatus` value to a background color, text color, and label string.
- **DataTable**: Generic responsive table component that renders as a `<table>` on desktop and as stacked cards on mobile.
- **AdminFormModal**: Slide-up (mobile) or centered (desktop) dialog used for all admin create/edit forms, built on `@radix-ui/react-dialog`.
- **ConfirmModal**: Existing two-step confirmation dialog used for delete and status-change actions.
- **EmptyState**: Centered placeholder component shown when a data list contains zero records.
- **BadgeStatus**: Union type covering `active | inactive | pending | completed | cancelled | approved | rejected | published | draft`.
- **DashboardLayout**: Existing layout shell providing the `Sidebar` (desktop), `DashboardHeader`, and `BottomTabBar` (mobile).
- **ProtectedRoute**: Existing HOC that validates the authenticated user's `role` before rendering a route.
- **RevenueRecord**: New data model representing a single revenue transaction (`id`, `date`, `patientName`, `type`, `amount`, `paymentMethod`, `status`).
- **AdminPackage**: Extended package model with three price tiers (`price1Month`, `price3Months`, `price6Months`) replacing the single `price` + `duration` fields.
- **React_Query**: `@tanstack/react-query` v5 — the data-fetching and caching layer used across all admin pages.
- **authStore**: Zustand store that holds the currently authenticated user, including `role` and `accountStatus`.

---

## Requirements

### Requirement 1: Responsive Layout System

**User Story:** As an admin user, I want the dashboard to display correctly on any device, so that I can manage the practice from a desktop workstation, a tablet, or a mobile phone.

#### Acceptance Criteria

1. WHEN the viewport width is less than 768 px, THE AdminPageShell SHALL apply a padding of `16px` to the page content area.
2. WHEN the viewport width is between 768 px and 1023 px inclusive, THE AdminPageShell SHALL apply a padding of `20px` on all sides.
3. WHEN the viewport width is 1024 px or greater, THE AdminPageShell SHALL apply a padding of `24px 28px` to the page content area.
4. WHILE the viewport width is less than 1024 px, THE DashboardLayout SHALL hide the Sidebar and display the BottomTabBar.
5. WHILE the viewport width is 1024 px or greater, THE DashboardLayout SHALL display the Sidebar at exactly 220 px width and hide the BottomTabBar.
6. THE AdminPageShell SHALL NOT produce horizontal overflow or content clipping at any viewport width of 280 px or greater.
7. WHEN the viewport width is less than 768 px, THE DataTable SHALL render each data row as a stacked card and SHALL NOT render any `<table>` element.
8. WHEN the viewport width is less than 768 px, THE DataTable SHALL omit columns whose `hideOnMobile` property is `true` from the card view.
9. WHEN the viewport width is 768 px or greater, THE DataTable SHALL render data rows inside a `<table>` element with a `<thead>` and `<tbody>`.
10. WHEN a stat-card grid is displayed, THE AdminDashboard SHALL render the grid as a 4-column layout on desktop, a 2-column layout on tablet, and a 1-column layout on mobile.
11. WHEN a content card grid (packages, digital products, courses, services) is displayed, THE AdminPageShell SHALL render the grid as 3 columns on desktop, 2 columns on tablet, and 1 column on mobile.

---

### Requirement 2: Shared Admin Components

**User Story:** As a developer, I want a library of shared admin components, so that every admin page has a consistent visual identity and behavior without duplicating code.

#### Acceptance Criteria

1. THE AdminPageShell SHALL render the `title` prop as an `<h1>` element in the `navy` color (`#1a3c4d`) and SHALL render the optional `subtitle` prop in the `muted` color (`#6b8896`).
2. WHEN an `actions` prop is provided to AdminPageShell, THE AdminPageShell SHALL render the actions in a flex row on the right side of the title bar and SHALL wrap them gracefully when viewport width is less than 768 px.
3. THE StatCard SHALL render the `value` prop in `navy` color with `fontWeight: 700` and `fontSize: 1.5rem`.
4. WHEN the `trend.up` property of StatCard is `true`, THE StatCard SHALL render the trend indicator and text in green (`#16a34a`).
5. WHEN the `trend.up` property of StatCard is `false`, THE StatCard SHALL render the trend indicator and text in red (`#dc2626`).
6. WHEN a `linkLabel` and `onLink` prop are provided to StatCard, THE StatCard SHALL render a teal hyperlink below the trend indicator that calls `onLink` on click.
7. FOR EVERY value in the `BadgeStatus` union (`active`, `inactive`, `pending`, `completed`, `cancelled`, `approved`, `rejected`, `published`, `draft`), THE StatusBadge SHALL render a non-empty label with a defined background color and text color from the approved color palette.
8. THE StatusBadge SHALL render with `borderRadius: 999px`, `padding: 3px 10px`, `fontSize: 11px`, and `fontWeight: 600`.
9. THE EmptyState SHALL render the `icon` prop inside a `40×40` circle with `brandLight` background (`#d0ecf2`), the `title` in `navy`, and the `description` in `muted`.
10. WHEN an `action` prop is provided to EmptyState, THE EmptyState SHALL render the action element centered below the description.

---

### Requirement 3: DataTable Component

**User Story:** As an admin staff member, I want a data table that handles search, filtering, pagination, and loading states, so that I can efficiently browse and find records across all entity lists.

#### Acceptance Criteria

1. WHEN the `data` array has N items and `pageSize` is P, THE DataTable SHALL render exactly `min(N, P)` row or card elements.
2. WHEN `loading` is `true`, THE DataTable SHALL render exactly 3 shimmer skeleton rows and SHALL NOT render any data row elements.
3. WHEN the `data` array is empty and `emptyState` is provided, THE DataTable SHALL render the `emptyState` element centered and SHALL NOT render any row or card elements.
4. WHEN `total` exceeds `pageSize`, THE DataTable SHALL render previous and next pagination controls and a page indicator.
5. WHEN `total` is less than or equal to `pageSize`, THE DataTable SHALL NOT render pagination controls.
6. WHEN the user types in the search input, THE DataTable SHALL call `onSearchChange` with the current input value on every keystroke.
7. WHEN a `filters` prop is provided, THE DataTable SHALL render the filter elements in a flex row to the right of the search bar.
8. THE DataTable SHALL render a sticky `<thead>` with a white background when `horizontalScroll` is `true`.

---

### Requirement 4: AdminFormModal Component

**User Story:** As an admin user, I want a consistent modal dialog for all create and edit forms, so that I can enter data without losing my page context.

#### Acceptance Criteria

1. WHEN `open` is `false`, THE AdminFormModal SHALL NOT render any element into the DOM (the Radix portal SHALL be fully unmounted).
2. WHEN `open` is `true`, THE AdminFormModal SHALL render the dialog with `role="dialog"` and the `title` prop as the accessible dialog title.
3. WHEN the viewport width is 1024 px or greater and `size` is `sm`, THE AdminFormModal SHALL render at a maximum width of 400 px.
4. WHEN the viewport width is 1024 px or greater and `size` is `md`, THE AdminFormModal SHALL render at a maximum width of 520 px.
5. WHEN the viewport width is 1024 px or greater and `size` is `lg`, THE AdminFormModal SHALL render at a maximum width of 720 px.
6. WHEN the viewport width is less than 768 px, THE AdminFormModal SHALL render at full viewport width and full viewport height (`100vw × 100dvh`) with `borderRadius: 0`.
7. WHEN `open` is `true` on desktop, THE AdminFormModal SHALL apply a backdrop blur effect to the content behind the modal.
8. WHEN a `footer` prop is provided and `open` is `true`, THE AdminFormModal SHALL keep the footer element visible without scrolling at any viewport height of 480 px or greater.
9. THE AdminFormModal body SHALL scroll independently of the footer element.
10. WHEN the user presses the Escape key or clicks the backdrop, THE AdminFormModal SHALL call `onClose`.
11. WHEN the viewport width is less than 768 px, THE AdminFormModal SHALL animate with a slide-up transition on open.
12. WHEN the viewport width is 1024 px or greater, THE AdminFormModal SHALL animate with a scale-in transition on open.

---

### Requirement 5: Form Validation and Mutation Safety

**User Story:** As an admin user, I want all forms to validate data before submitting, so that I don't accidentally send malformed requests to the API.

#### Acceptance Criteria

1. WHEN a required form field is empty at submit time, THE AdminFormModal SHALL display an inline error message via the `FormField` `error` prop and SHALL NOT call the API mutation function.
2. WHEN a form field value fails `zod` schema validation, THE AdminFormModal SHALL surface the validation error inline beneath the relevant field before any network request is made.
3. WHEN an API mutation returns a non-2xx response, THE AdminFormModal SHALL remain open and SHALL display the error message as a red banner inside the modal footer area.
4. WHEN the API response includes a field-level `errors` map, THE AdminFormModal SHALL map each error back to its corresponding `FormField` component.
5. WHEN a delete action is triggered, THE System SHALL present the existing `ConfirmModal` with `variant: 'danger'` before calling the delete mutation.
6. WHEN a confirm/status-change action is triggered, THE System SHALL present the `ConfirmModal` with the appropriate variant before calling the mutation.

---

### Requirement 6: Route Protection and Access Control

**User Story:** As a system administrator, I want all admin routes to be protected, so that only authenticated users with the ADMIN role can access the dashboard.

#### Acceptance Criteria

1. THE ProtectedRoute SHALL wrap every admin route and SHALL redirect unauthenticated users to the login page.
2. WHEN an authenticated user with a role other than `ADMIN` attempts to navigate to any `/admin/*` route, THE ProtectedRoute SHALL redirect the user to a not-authorised view.
3. THE authStore SHALL provide the authenticated user's `role` value to all admin route guards.

---

### Requirement 7: Admin Dashboard Overview Page

**User Story:** As a practice owner, I want a command-centre overview page, so that I can see key performance indicators, revenue trends, and today's activity at a glance.

#### Acceptance Criteria

1. WHEN the AdminDashboard page loads, THE AdminDashboard SHALL fetch and display four StatCards: Total Active Patients, Follow-ups Due, Total Interns, and Today's Appointments.
2. WHEN the AdminDashboard page loads, THE AdminDashboard SHALL render a Revenue Growth SVG area chart showing Consultations and Package Sales data series.
3. WHEN the admin selects a time filter (This Week / Last 6 Months / This Year) on the Revenue Growth chart, THE AdminDashboard SHALL update the chart data series to reflect the selected period.
4. WHEN the AdminDashboard page loads, THE AdminDashboard SHALL render an Upcoming Appointments list showing confirmed and pending appointments with colored left borders (teal for confirmed, amber for pending, red for cancelled).
5. WHEN the AdminDashboard page loads, THE AdminDashboard SHALL render a Recent Activities table with columns: Patient, Action, Status, and Time.
6. WHEN a React Query data fetch fails on the AdminDashboard, THE AdminDashboard SHALL render an inline error banner with a Retry button above the main content.
7. WHEN the Retry button is clicked, THE AdminDashboard SHALL call the React Query `refetch()` function without performing a full page reload.

---

### Requirement 8: Patient Management Page

**User Story:** As an admin staff member, I want to view, search, add, edit, and delete patients, so that I can maintain an accurate and up-to-date patient roster.

#### Acceptance Criteria

1. WHEN the Patients page loads, THE AdminPatientsPage SHALL render a DataTable with columns: Avatar+Name, Email, Phone, Blood Group, Status, Joined Date, and Actions.
2. WHEN the admin types in the search bar, THE AdminPatientsPage SHALL filter the patient list by name, email, or phone number.
3. WHEN the admin selects a value from the Status filter dropdown, THE AdminPatientsPage SHALL display only patients matching that account status.
4. WHEN the admin selects a value from the Blood Group filter dropdown, THE AdminPatientsPage SHALL display only patients matching that blood group.
5. WHEN the admin clicks "Add Patient", THE AdminPatientsPage SHALL open an `AdminFormModal` (size `md`) with fields: `fullName`, `email`, `phoneNumber`, `whatsappNumber`, `gender`, `bloodGroup`, `age`, `heightCm`, `weightKg`, `location`, `isDefencePersonnel`.
6. WHEN the admin clicks the Edit action for a patient, THE AdminPatientsPage SHALL open the same modal pre-populated with the patient's existing data.
7. WHEN the admin clicks the Delete action for a patient, THE AdminPatientsPage SHALL open a `ConfirmModal` with `variant: 'danger'` before calling the delete mutation.
8. WHEN a patient is successfully created or updated, THE AdminPatientsPage SHALL close the modal and invalidate the patient list React Query cache.
9. WHEN the viewport is less than 768 px, THE AdminPatientsPage card view SHALL show: Name, Phone, Status badge, Joined date, and action buttons.

---

### Requirement 9: Intern Management Page

**User Story:** As an admin staff member, I want to manage intern registrations and approve or reject pending interns, so that only qualified interns gain access to intern-specific content.

#### Acceptance Criteria

1. WHEN the Interns page loads, THE AdminInternsPage SHALL render four StatCards: Total Interns, Approved, Pending Approval, and Completed Courses.
2. WHEN the Interns page loads, THE AdminInternsPage SHALL render a DataTable with columns: Avatar+Name, University, Specialization, Semester/Year, Status badge, Progress bar, and Actions.
3. WHEN the admin toggles `isApproved` in the intern edit modal, THE AdminInternsPage SHALL call the PATCH API endpoint and update the intern's approval status.
4. WHEN the admin clicks "Add Intern", THE AdminInternsPage SHALL open an `AdminFormModal` (size `md`) with fields: `fullName`, `email`, `phoneNumber`, `universityName`, `specialization`, `semester`, `year`, `isApproved`.
5. WHEN the admin clicks the Delete action for an intern, THE AdminInternsPage SHALL open a `ConfirmModal` with `variant: 'danger'` before calling the delete mutation.
6. WHEN the viewport is less than 768 px, THE AdminInternsPage card view SHALL hide the progress bar column.

---

### Requirement 10: Appointments Management Page

**User Story:** As an admin staff member, I want to view, filter, confirm, reschedule, and cancel appointments, so that the practice schedule stays accurate and patients receive timely notifications.

#### Acceptance Criteria

1. WHEN the Appointments page loads, THE AdminAppointmentsPage SHALL render a tab bar with tabs: All, Today, Upcoming, Completed, Cancelled.
2. WHEN the admin clicks a status tab, THE AdminAppointmentsPage SHALL display only appointments matching the selected status filter.
3. WHEN the admin clicks Confirm on an appointment, THE AdminAppointmentsPage SHALL open a `ConfirmModal` (success variant) before updating the appointment status to `confirmed`.
4. WHEN the admin clicks Cancel on an appointment, THE AdminAppointmentsPage SHALL open a `ConfirmModal` (danger variant) before updating the appointment status to `cancelled`.
5. WHEN the Appointments page loads, THE AdminAppointmentsPage SHALL render a DataTable with columns: Patient, Date & Time, Type, Status, and Actions (Confirm, Reschedule, Cancel, View).
6. WHEN the admin uses the search input, THE AdminAppointmentsPage SHALL filter appointments by patient name.
7. WHEN a new appointment is created or an existing one is updated, THE AdminAppointmentsPage SHALL invalidate the appointments React Query cache.
8. WHEN the viewport is less than 768 px, THE AdminAppointmentsPage card view SHALL display icon buttons only in the actions row to conserve space.

---

### Requirement 11: Packages Management Page

**User Story:** As a content manager, I want to create and manage healthcare subscription packages with tiered pricing, so that patients can choose a plan that suits their needs and budget.

#### Acceptance Criteria

1. WHEN the Packages page loads, THE PackagesManagementPage SHALL render packages as a card grid with each card showing: category badge, package name, three pricing chips (1M, 3M, 6M), description excerpt, active toggle, Edit button, and Delete button.
2. WHEN the admin clicks "Create Package", THE PackagesManagementPage SHALL open an `AdminFormModal` (size `lg`) with fields: `name`, `category`, `description`, `price1Month`, `price3Months`, `price6Months`, `features` (tag-chip list), `isActive`.
3. WHEN the admin toggles the active switch on a package card, THE PackagesManagementPage SHALL call the PATCH API endpoint to update `isActive` for that package.
4. WHEN a package is successfully created or updated, THE PackagesManagementPage SHALL close the modal and invalidate the packages React Query cache.
5. WHEN the admin clicks Delete on a package and the backend returns a 409 Conflict, THE PackagesManagementPage SHALL display a toast notification with the conflict message and SHALL NOT perform the deletion.
6. THE PackagesManagementPage SHALL render category badges with distinct colors: Thyroid (blue), Diabetes (amber), Weight Loss (green), General (teal), Other (gray).

---

### Requirement 12: Digital Products Management Page

**User Story:** As a content manager, I want to manage ebooks, diet guides, and recipe books for sale, so that patients can purchase digital content from the practice.

#### Acceptance Criteria

1. WHEN the Digital Products page loads, THE DigitalProductsPage SHALL render products as a card grid with each card showing: thumbnail (or fallback placeholder), category badge, title, price, status badge, Edit button, and Delete button.
2. THE DigitalProductsPage thumbnail SHALL render at `height: 140px` with `borderRadius: 10px` and `object-fit: cover`.
3. WHEN a thumbnail is unavailable, THE DigitalProductsPage SHALL render a gray placeholder with a `FileText` icon in place of the thumbnail.
4. WHEN the admin clicks "Add Digital Product", THE DigitalProductsPage SHALL open an `AdminFormModal` with fields: `title`, `description`, `price`, `category` (ebook / diet_guide / recipe_book), `status` (published / draft), file upload, and thumbnail upload.
5. WHEN a file is selected in the upload field, THE DigitalProductsPage SHALL display the filename and SHALL NOT display the raw file object URL.
6. WHEN a digital product is successfully created or updated, THE DigitalProductsPage SHALL close the modal and invalidate the digital products React Query cache.

---

### Requirement 13: Course Management Page

**User Story:** As a content manager, I want to manage intern training courses including videos and eligibility criteria, so that interns can access structured learning content appropriate to their academic level.

#### Acceptance Criteria

1. WHEN the Courses page loads, THE CourseManagementPage SHALL render courses as a card grid with each card showing: title, description excerpt, eligibility (min semester and year), video count, test badge, active toggle, View, Edit, and Delete buttons.
2. WHEN the admin clicks "View" on a course, THE CourseManagementPage SHALL navigate to a full-page course detail view (not a modal) showing the video list, add-video form, eligibility section, `hasTest` toggle, and Issue Certificates action.
3. WHEN the admin reorders videos using the order controls on the course detail page, THE CourseManagementPage SHALL update the video `order` field and persist the new order via the API.
4. WHEN the admin clicks "Add Course", THE CourseManagementPage SHALL open an `AdminFormModal` (size `md`) with fields: `title`, `description`, `minSemester`, `minYear`, `hasTest`, `isActive`.
5. WHEN a course is successfully created or updated, THE CourseManagementPage SHALL close the modal and invalidate the courses React Query cache.

---

### Requirement 14: Services Management Page

**User Story:** As an admin staff member, I want to manage Yoga, Zumba, and Blood Test services with their time slots, so that patients can book available sessions.

#### Acceptance Criteria

1. WHEN the Services page loads, THE ServicesManagementPage SHALL render services as a card grid with each card showing: service icon in a `50×50` brandLight circle, service name, type badge, price, available slot count, active toggle, Edit, and Delete buttons.
2. THE ServicesManagementPage SHALL render Yoga with the `PersonStanding` icon, Zumba with the `Music` icon, and Blood Test with the `Droplets` icon from lucide-react.
3. WHEN the admin clicks "Add Service", THE ServicesManagementPage SHALL open an `AdminFormModal` with fields: `name`, `type`, `description`, `price`, slots (tag-input), `isActive`.
4. WHEN the admin types a time slot value and presses Enter or comma in the slots field, THE ServicesManagementPage SHALL add the value as a chip to the slots list.
5. WHEN the admin clicks the × on a slot chip, THE ServicesManagementPage SHALL remove that slot from the list.
6. WHEN a service is successfully created or updated, THE ServicesManagementPage SHALL close the modal and invalidate the services React Query cache.

---

### Requirement 15: Blog Management Page

**User Story:** As a content manager, I want to write and manage blog posts and recipe articles, so that the practice can publish educational content for patients.

#### Acceptance Criteria

1. WHEN the Blog page loads, THE BlogPage SHALL render a card grid with filter tabs: All, Blog, Recipe.
2. WHEN the admin clicks a filter tab, THE BlogPage SHALL display only posts matching the selected category.
3. WHEN the admin clicks "Write Post", THE BlogPage SHALL navigate to `/admin/blog/new` — a full-page form (not a modal).
4. WHEN the admin clicks Edit on a post, THE BlogPage SHALL navigate to `/admin/blog/:id/edit` pre-populated with the post's existing data.
5. THE BlogPage write/edit form SHALL contain: title input, category select, featured image upload, rich-text editor area (minimum height 300 px), tags input, publish/draft toggle, and Save button.
6. WHEN the admin clicks Delete on a post, THE BlogPage SHALL open a `ConfirmModal` with `variant: 'danger'` before calling the delete mutation.
7. WHEN a post is successfully saved, THE BlogPage SHALL redirect the admin back to `/admin/blog` and invalidate the blog React Query cache.
8. WHEN a post is set to draft, THE BlogPage SHALL display the `draft` StatusBadge on that post's card.
9. WHEN a post is published, THE BlogPage SHALL display the `published` StatusBadge on that post's card.

---

### Requirement 16: Revenue Analytics Page

**User Story:** As a practice owner, I want to view revenue analytics broken down by category and time period, so that I can understand the financial performance of the practice.

#### Acceptance Criteria

1. WHEN the Revenue page loads, THE RevenuePage SHALL render four StatCards: Total Revenue (all time), Consultation Revenue, Package Revenue, and Digital Product Revenue, each with a period comparison percentage.
2. WHEN the Revenue page loads, THE RevenuePage SHALL render a monthly SVG chart displaying 12 months of revenue data with month labels on the X axis and amount labels on the Y axis.
3. WHEN the admin toggles a data series button (Consultations, Packages, Digital), THE RevenuePage SHALL show or hide that data series on the chart.
4. WHEN the Revenue page loads, THE RevenuePage SHALL render a Revenue Breakdown DataTable with columns: Date, Patient, Type, Amount, Payment Method, and Status.
5. THE RevenuePage DataTable status column SHALL use `StatusBadge` with `paid` rendered as `active`, `pending` as `pending`, and `refunded` as `cancelled` styling.

---

### Requirement 17: Data Fetching and Caching

**User Story:** As an admin user, I want the dashboard to feel fast and avoid unnecessary loading states during navigation, so that I can work efficiently without interruptions.

#### Acceptance Criteria

1. THE React_Query client SHALL be configured with `staleTime: 30000` (30 seconds) for all admin data queries.
2. WHEN an admin navigates between pages within 30 seconds of the last fetch, THE React_Query SHALL serve cached data without issuing a new network request.
3. WHEN a create, update, or delete mutation succeeds, THE React_Query SHALL invalidate the relevant entity query cache so the list refreshes automatically.
4. THE DataTable SHALL default to a `pageSize` of 20 records and SHALL NOT render all records simultaneously for any list exceeding 20 items.
5. WHEN images (avatars, thumbnails) are rendered in admin pages, THE System SHALL apply `loading="lazy"` to avoid layout shift.

---

### Requirement 18: Error Handling

**User Story:** As an admin user, I want clear error messages and recovery options when something goes wrong, so that I can resolve issues without losing my work.

#### Acceptance Criteria

1. WHEN a React Query fetch returns an error, THE AdminPage SHALL render an inline amber error banner with a warning icon and the error message string above the main page content.
2. WHEN the admin clicks the Retry button in the error banner, THE AdminPage SHALL call `refetch()` without performing a full page reload.
3. WHEN a CRUD mutation returns a non-2xx response, THE AdminFormModal SHALL remain open and display the error as a red banner inside the modal footer area.
4. WHEN a delete mutation returns a 409 Conflict response, THE System SHALL display a `@radix-ui/react-toast` notification with the conflict message and SHALL NOT close the confirm modal automatically.
5. WHEN a page loads with zero records, THE AdminPage SHALL render the `EmptyState` component with a contextual icon, title, description, and a CTA button that opens the add modal directly.
6. IF a form mutation is in progress, THEN THE AdminFormModal submit button SHALL display a loading spinner and SHALL remain enabled.
