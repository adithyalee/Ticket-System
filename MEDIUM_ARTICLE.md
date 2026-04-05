# I built a support ticket system for Meeedly’s internship (React + Noplin)

**Adithya — Carleton University**

Meeedly’s assignment wasn’t “make a form that saves to a list.” It was closer to: *build something you could plausibly ship as internal tooling*—high volume, multiple teams, and communication that doesn’t blur what the customer sees vs what support writes internally.

I used **React**, **`noplin-uis`** for the interface, and **Context + `useReducer`** for state. No Redux, no React Router package, no second component library. That constraint was annoying at times but it forced me to keep the architecture small and explicit.

## What I actually shipped

Customers can open tickets with a title and real description. Support sees a **dashboard** with search, filters, queues (mine, team, unassigned, etc.), sorting, pagination, and cards for things like urgent count and SLA breaches—some of those cards filter the list when you click them.

On a **ticket**, there’s a public conversation, **internal notes** (support/admin only), team + agent assignment, status/priority, SLA / “waiting on” flags, and an **activity** trail so you’re not guessing what changed.

I added **role switching** (User / Support Agent / Admin) so one demo can show both sides. Bulk actions on the dashboard are intentionally **admin**-only; agents get lighter controls so it doesn’t look like everyone is a superuser.

## How I structured the code

Folders are boring on purpose: `pages`, `components`, `context`, `hooks`, `services`. The reducer in `TicketContext` owns ticket mutations; `useTickets` is the thin API the UI calls. Persistence is `localStorage` behind `storageService`, and older saved data gets patched forward in `ticketShape` so I don’t brick someone’s browser state when fields change.

Tickets live in a **normalized** shape (`ticketsById` + `ticketOrder`). That made updates less error-prone than mutating nested arrays everywhere, and it’s the same idea you’d use before wiring a real API.

## “Scalable” without pretending

`localStorage` is not a database. I didn’t try to sell it as one. What I *did* try to do is keep list work **memoized**, use **pagination** so the DOM isn’t rendering 500 rows at once, and separate **selectors** from the React tree so the dashboard doesn’t turn into a 600-line file. Seed data gives enough tickets that those choices actually matter in the demo.

## What I’d do with more time

Real backend, auth, org scoping, server-side search/filter, notifications, the usual. The current app is a portfolio piece and a thought experiment in workflow UI, not production auth.

  `Scalable Support Ticket System Made from Noplin UIs by Meeedly - Adithya - Carleton University`
