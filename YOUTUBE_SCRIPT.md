# YouTube Walkthrough Script

## Required Title (copy exactly for YouTube)

`Scalable Support Ticket System Made from Noplin UIs by Meeedly - Adithya - Carleton University`

## Video Description Template

This video walks through my Meeedly Software Engineering Internship assignment: **Build a Scalable Support Ticket System**.

**Author:** Adithya · **Carleton University**

Links:
- GitHub Repository: `[add-public-repo-link]`
- Medium Article: `[add-medium-article-link]`

## Recommended Flow

### 1. Introduction

"Hello, my name is Adithya from Carleton University. This is my submission for the Meeedly Software Engineering Internship assignment: Build a Scalable Support Ticket System. I built it in React using Noplin UI components, with no external state-management or UI libraries."

### 2. What Problem The Product Solves

"The assignment asked for more than a CRUD app, so I designed this as an internal support platform for a SaaS company handling high ticket volume, multiple support teams, and communication between customers, support agents, and admins."

### 3. Dashboard Walkthrough

Show the dashboard first.

Talk through:
- KPI cards for backlog, urgent tickets, unassigned tickets, awaiting-customer tickets, and SLA breaches
- queue filters such as `Mine`, `My Team`, `Unassigned`, `Escalated`, and `Awaiting Customer`
- search, sorting, pagination, and bulk actions
- team-aware routing and assignment

Suggested script:

"This dashboard is designed for support triage. Instead of just listing tickets, it helps teams manage workload at scale. Support staff can filter by queue, team, status, category, priority, and SLA pressure. I also added bulk actions to make manager workflows more efficient."

### 4. Ticket Creation Flow

Switch to `User` role and create a ticket.

Suggested script:

"From the customer perspective, the flow is simple: create a ticket with a title and detailed description, then immediately view the ticket detail page and follow the conversation history."

### 5. Ticket Detail Flow

Open a ticket detail page.

Talk through:
- public conversation thread
- internal notes for support-only collaboration
- team and agent assignment
- status, priority, waiting state, and SLA management
- activity log for auditability

Suggested script:

"The ticket detail page acts as the operational workspace. Public replies keep customer communication clear, while internal notes let support teams collaborate without exposing internal context to customers. The activity feed records assignment and workflow changes so the ticket history is easy to review."

### 6. Architecture Explanation

Open the code editor and show:
- `src/pages`
- `src/components`
- `src/context/TicketContext.jsx`
- `src/hooks/useTickets.js`
- `src/services/mockData.js`
- `src/services/storageService.js`
- `src/services/ticketUtils.js`, `ticketSelectors.js`, `ticketShape.js`

Suggested script:

"I separated the app into pages, reusable components, centralized reducer state, a domain hook, and service utilities. The reducer keeps updates predictable, `useTickets` exposes a clean domain API to the UI, and the storage service acts as the persistence boundary. That makes the project easier to maintain and easier to migrate to a backend later."

### 7. Scalability Decisions

Suggested talking points:
- normalized ticket storage with `ticketsById` and `ticketOrder`
- memoized dashboard filtering and sorting
- pagination for large ticket volumes
- seeded demo data to simulate realistic load
- team-based ownership instead of a flat queue
- debounced `localStorage` persistence

Suggested script:

"Since this is a frontend-first prototype, I focused on scalable frontend patterns. Tickets are normalized for predictable updates, dashboard computations are memoized, pagination keeps the list manageable, and the state layer is separated from the UI so a real backend could replace local storage later without rewriting the entire product."

### 8. Challenges Faced

Suggested script:

"One challenge was creating a richer enterprise workflow without external libraries. I solved that by leaning on React Context plus `useReducer`, and by modeling tickets with team ownership, SLA state, activity history, and internal notes instead of only basic CRUD fields."

### 9. Outro

Suggested script:

"That concludes my walkthrough. Thank you for reviewing my submission. The GitHub repository and Medium article are linked in the description."

## Final Recording Checklist

- Paste your real GitHub and Medium URLs in the description (name and university are already set in this file)
- Show the app running locally
- Demonstrate all 3 required pages
- Demonstrate role switching
- Demonstrate assignment and ticket response
- Mention Noplin UI and no-external-library constraint clearly
- Keep the video concise and confident
