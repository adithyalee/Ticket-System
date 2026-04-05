# Meeedly Enterprise Support Ticket System

**Author:** Adithya · **Carleton University**  
**Assignment:** Software Engineering Internship — Build a Scalable Support Ticket System (Meeedly)

A React-based support ticket platform built for the Meeedly internship assignment using `noplin-uis` for the interface and native React patterns for state, workflow logic, and persistence.

## Assignment Fit

This project is designed to satisfy the core assignment goals:

- Ticket creation with title and detailed description
- Ticket detail view with support replies and conversation history
- Ticket management dashboard for high-volume triage
- Team-aware assignment and queue management
- Clean React architecture without external state libraries
- Noplin UI components for the visible interface

## What The App Includes

- Customer ticket submission flow
- Enterprise dashboard with queue filters, search, sorting, pagination, and KPI cards
- Team routing and agent assignment
- Ticket detail page with:
  - public conversation thread
  - internal support notes
  - activity history
  - status, priority, SLA, and waiting-state management
- Role switching between `User`, `Support Agent`, and `Admin`
- Persistent seeded ticket data using `localStorage`

## Tech Constraints Followed

- React only
- No external state management library
- No external router
- No UI framework besides `noplin-uis`
- No chart, table, or helper libraries added for the app logic

## How To Run

### Install

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Build Production Bundle

```bash
npm run build
```

### Run Lint

```bash
npm run lint
```

## How To Review The Project

Use this sequence when evaluating the app:

1. Open the dashboard and review the KPI cards and queue filters.
2. Switch roles using the role switcher at the top.
3. As `User`, create a new support ticket.
4. Open the created ticket and confirm the conversation thread is visible.
5. Switch to `Support Agent` or `Admin`.
6. From the dashboard, assign tickets, change priority, and triage by team/queue.
7. Open a ticket detail page and add:
   - a public reply
   - an internal note
8. Change team, assignee, status, waiting state, and SLA state.
9. Refresh the browser and confirm ticket data persists.

## Architecture Overview

### Screen Layer

- `src/pages/CreateTicket.jsx`
  - customer-facing ticket submission flow
- `src/pages/Dashboard.jsx`
  - high-volume triage dashboard for support and admins
- `src/pages/TicketDetail.jsx`
  - single-ticket workspace for communication and management

### Reusable Component Layer

- `src/components/TicketForm.jsx`
  - shared form for ticket creation and message submission
- `src/components/TicketCard.jsx`
  - reusable triage card used on the dashboard
- `src/components/MessageThread.jsx`
  - reusable thread renderer for public replies and internal notes
- `src/components/Navbar.jsx`, `src/components/RoleSwitcher.jsx`, `src/components/StatusBadge.jsx`
  - shell and supporting UI components

### State Layer

- `src/context/TicketContext.jsx`
  - centralized reducer and state provider
- `src/hooks/useTickets.js`
  - domain API used by pages/components

### Service Layer

- `src/services/storageService.js`
  - persistence boundary wrapping `localStorage`
- `src/services/mockData.js`
  - seeded enterprise-style demo data with teams, agents, organizations, SLA states, and ticket activity
- `src/services/ticketUtils.js`
  - selector-style helpers for metrics, styling, and workflow rendering
- `src/services/ticketShape.js`
  - migrates legacy persisted tickets to the current enterprise field shape
- `src/services/ticketSelectors.js`
  - pure functions for dashboard queue matching, filtering, and sorting

## Data Model

Tickets are stored in normalized form using:

- `ticketsById`
- `ticketOrder`

Each ticket carries operational metadata beyond basic CRUD fields:

- `teamId`, `teamName`
- `organizationId`, `organizationName`
- `assignedToAgentId`, `assignedToAgentName`
- `priority`, `status`, `slaStatus`
- `waitingOn`
- `isEscalated`
- `messages`
- `internalNotes`
- `activity`

This structure keeps updates predictable and makes future backend migration easier.

## Scalability Decisions

This is still a frontend prototype, but it intentionally includes scale-oriented patterns:

- Normalized ticket state for predictable lookups and updates
- Reducer-driven workflow actions to avoid scattered mutation logic
- Team-aware ticket routing instead of a flat single-agent queue
- Memoized filtering, sorting, and stats derivation in the dashboard
- Pagination for large ticket lists
- Debounced persistence writes to reduce storage churn
- Seeded dataset so the dashboard always demonstrates non-trivial volume
- Separation between screen components, workflow hooks, and persistence services

## Product Decisions

The product is designed for two primary personas:

### Customer

- create a ticket quickly
- review the ticket history clearly
- receive public support responses

### Support/Admin

- triage by queue, team, priority, and SLA pressure
- assign ownership quickly
- separate public communication from internal notes
- review recent operational activity on each ticket

## Current Limitations

This project is intentionally a frontend-first prototype and does not yet include:

- backend API
- authentication and authorization
- real multi-user collaboration
- real-time updates via WebSockets
- server-side pagination or search indexing

## Future Improvements

- Replace `localStorage` with a backend ticket service
- Add role-based authentication and organization scoping
- Move filtering/search/pagination to the server for very large datasets
- Add SLA automation and notification workflows
- Add audit exports and analytics reporting for support managers

## Project Structure

```txt
src/
  components/
    MessageThread.jsx
    Navbar.jsx
    RoleSwitcher.jsx
    StatusBadge.jsx
    TicketCard.jsx
    TicketForm.jsx
  context/
    TicketContext.jsx
  hooks/
    useTickets.js
  pages/
    CreateTicket.jsx
    Dashboard.jsx
    TicketDetail.jsx
  services/
    mockData.js
    storageService.js
    ticketSelectors.js
    ticketShape.js
    ticketUtils.js
  App.jsx
  App.css
  index.css
  main.jsx
```

## Submission Links

**YouTube title (required format):**  
`Scalable Support Ticket System Made from Noplin UIs by Meeedly - Adithya - Carleton University`

Replace these after you publish (step-by-step: see **[SUBMISSION.md](SUBMISSION.md)**):

- GitHub Repo: [https://github.com/adithyalee/Ticket-System](https://github.com/adithyalee/Ticket-System)
- YouTube Walkthrough: `[add-youtube-link]`
- Medium Article: `[add-medium-link]`

Fill **`SUBMISSION_PROFILE.template.md`** → copy to `SUBMISSION_PROFILE.md` for your own values (`SUBMISSION_PROFILE.md` is gitignored).
