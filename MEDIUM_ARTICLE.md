# Building A Scalable Support Ticket System In React With Noplin UI

*By **Adithya**, Carleton University ù Meeedly Software Engineering Internship assignment.*

The Meeedly internship assignment was not asking for a simple CRUD app. It asked for a support ticket system that could be explained like a real SaaS product: high ticket volume, multiple teams, efficient communication, and engineering decisions that scale beyond a small demo.

This article explains how I approached that challenge using React, `noplin-uis`, and native React state patterns without bringing in external state-management or UI libraries.

## The Goal

The system needed to support three main workflows:

- customers creating support tickets
- support staff replying and managing individual tickets
- managers viewing and organizing the whole system from a dashboard

To make the project feel closer to an enterprise support tool, I also added:

- team-based routing
- SLA visibility
- internal notes for support teams
- queue-based triage filters
- bulk management actions

## Architecture Approach

I kept the project split into clear layers:

- `pages/` for screen-level features
- `components/` for reusable UI pieces
- `context/` for centralized reducer-driven state
- `hooks/` for the ticket domain API
- `services/` for persistence, mock enterprise data, and selector-style helpers

This gave me a structure that is easy to explain and easy to extend.

### Why Context + useReducer?

Because external libraries were restricted, I used React Context and `useReducer` to keep state centralized and predictable.

That decision helped with:

- consistent workflow transitions
- assignment updates
- reply handling
- activity logging
- easier reasoning about ticket mutations

Instead of letting page components manually manage ticket state, the reducer now acts as the workflow engine for ticket creation, replies, internal notes, assignment, updates, and deletion.

## Data Model Decisions

A real support system needs more than `title`, `description`, and `status`.

Each ticket in this project includes:

- organization metadata
- support team ownership
- assigned agent
- priority and SLA state
- waiting state such as `Support` or `Customer`
- public messages
- internal notes
- activity history

I stored tickets in a normalized shape using `ticketsById` and `ticketOrder`. That makes lookups and updates more predictable and is also a better stepping stone toward a real backend API.

## Designing For Scale In A Frontend Prototype

This project is still a frontend-first prototype, so I wanted the scalability story to be honest.

I did not try to pretend that `localStorage` is the same as a real backend. Instead, I focused on frontend scalability patterns that are useful even before a backend exists:

- normalized state
- memoized dashboard filtering and sorting
- pagination
- debounced persistence
- seeded ticket data for realistic dashboard volume
- separated service and selector logic

The dashboard is the clearest example of this. Rather than just rendering every ticket with no structure, it provides:

- queue filters like `Mine`, `My Team`, `Unassigned`, and `Escalated`
- KPI cards for backlog and risk visibility
- pagination for high-volume browsing
- bulk actions for support managers

Those choices make the product feel closer to a real support operations tool.

## Product Thinking

I tried to make the project useful for both sides of the workflow.

### For customers

The customer flow is simple and direct:

- submit a ticket
- describe the issue clearly
- revisit the ticket and follow the conversation

### For support teams

The support workflow is more operational:

- route the ticket to the correct team
- assign it to an agent
- post customer-facing replies
- add internal-only notes
- update SLA or waiting state
- review recent ticket activity

That split between public communication and internal collaboration is important. A support system becomes much more realistic once internal notes exist alongside customer replies.

## Challenges Faced

The biggest challenge was meeting the ùthink like a software engineer in a real-world SaaS environmentù part of the brief without relying on extra packages.

Some specific challenges were:

- keeping the dashboard manageable as the ticket model became richer
- modeling multi-team workflows without a backend
- making the system feel enterprise-oriented while still keeping it understandable for a demo project

I solved this by keeping the architecture simple, centralizing workflow logic, and making the UI explain operational state clearly.

## What I Would Improve Next

If this project were continued beyond the assignment, the next steps would be:

1. Replace `localStorage` with a backend API and database.
2. Add authentication and organization-aware authorization.
3. Move search, filtering, and pagination to the server.
4. Add real-time updates using WebSockets.
5. Add reporting and support-team analytics.

## Final Thoughts

This project helped me balance product usability with software engineering constraints. The end result is still approachable as a React project, but it is structured around real support-team concerns instead of only basic CRUD operations.

Links (replace after you publish):

- GitHub Repository: [https://github.com/adithyalee/Ticket-System](https://github.com/adithyalee/Ticket-System)
- YouTube Walkthrough: `[add-youtube-link]`  
  **Title:** `Scalable Support Ticket System Made from Noplin UIs by Meeedly - Adithya - Carleton University`
