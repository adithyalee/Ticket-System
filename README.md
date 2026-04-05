# Support ticket system (Meeedly internship)

**Adithya · Carleton University**

I built this for Meeedly’s software engineering internship: a support ticket app in React that actually feels like something a real team would triage tickets on—not just create/read/update on a flat list.

The UI is **Noplin** (`noplin-uis`). State is plain **React Context + `useReducer`**—no Redux, no React Router, no second UI kit. Data sticks around in **`localStorage`** so you can refresh and still see your tickets.

## Before you submit

The [playlist video (index 10)](https://www.youtube.com/watch?v=-sjc31rI5lQ&list=PLN_pZg3k2CjjoJBAY9ftCEgpyJuDpF-9q&index=10) is the **spec** for folder layout and interface patterns—compare your repo to that, not to someone else’s walkthrough.

Noplin docs: [noplin.meeedly.com](https://noplin.meeedly.com/)

Your **own** demo video is separate. Title format is in [YOUTUBE_SCRIPT.md](YOUTUBE_SCRIPT.md).

## What it does

- **Create ticket** — title + description, category/priority, then land on the ticket page.
- **Dashboard** — search, filters (status, priority, team, queues like “Mine” / “Unassigned”), sort, pagination, KPI-style stat cards you can click to filter.
- **Ticket detail** — public thread, internal notes (support/admin), assign team/agent, status/priority, SLA + “waiting on” workflow, activity log.
- **Roles** — switch between customer (**User**), **Support Agent**, and **Admin** (bulk actions on the dashboard are admin-side; agents get line-level stuff like advancing status).

Seeded data loads on first run so the dashboard isn’t empty.

## Rules I stuck to

React only for the app. **`noplin-uis`** for buttons, fields, cards, toasts. No extra libraries for state, routing, charts, or tables.

## Run it

```bash
npm install
npm run dev
```

```bash
npm run build
npm run lint
```

## Quick tour (if you’re grading this)

1. Open the dashboard, click around filters and the stat cards.
2. Flip roles at the top.
3. As **User**, create a ticket and open it.
4. As **Support Agent** or **Admin**, reply, add an internal note, move team/agent, tweak status/SLA.
5. Refresh—data should still be there (`localStorage`).

## How the code is laid out

| Area | What lives there |
|------|------------------|
| `src/pages/` | `Dashboard`, `CreateTicket`, `TicketDetail` |
| `src/components/` | `TicketCard`, `TicketForm`, `MessageThread`, navbar, role switcher, status badge |
| `src/context/TicketContext.jsx` | reducer + provider |
| `src/hooks/useTickets.js` | what the pages call to create/update tickets |
| `src/services/` | `mockData` (seed), `storageService` (localStorage), `ticketShape` (migrate old saves), `ticketSelectors` / `ticketUtils` (filters, stats, helpers) |

Tickets are stored normalized: **`ticketsById`** + **`ticketOrder`**, with team, org, assignee, SLA, messages, internal notes, activity, etc. That made updates less messy than one giant array everywhere.

## Honest limits

No real backend, no auth, no websockets. It’s a frontend prototype meant to show structure and product thinking, not production security.

## Links for submission

**YouTube title (exact):**  
`Scalable Support Ticket System Made from Noplin UIs by Meeedly - Adithya - Carleton University`

- **GitHub:** [github.com/adithyalee/Ticket-System](https://github.com/adithyalee/Ticket-System)
- **YouTube:** add after you upload  
- **Medium:** add after you publish  

Full step list: [SUBMISSION.md](SUBMISSION.md). Copy [SUBMISSION_PROFILE.template.md](SUBMISSION_PROFILE.template.md) to `SUBMISSION_PROFILE.md` locally (that file is gitignored).
