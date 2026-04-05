# Support ticket system

Hi — I’m **Adithya** (Carleton). This repo is my Meeedly software engineering internship project: a support ticket app in React.

I wanted it to feel less like a homework CRUD demo and more like something you’d actually use to triage tickets — queues, teams, internal notes vs what the customer sees, that kind of thing. All the interactive UI is **Noplin** (`noplin-uis`). I kept state in **Context + `useReducer`** and didn’t pull in Redux or another UI library. Everything persists in **`localStorage`** for now so a refresh doesn’t wipe your data.

## Run it

```bash
npm install
npm run dev
```

```bash
npm run build
npm run lint
```

## What’s in here

There’s a flow to **create** tickets (title, description, category, priority), a **dashboard** with search, filters, sorting, pagination, and stat cards (some of them filter the list when you click), and a **ticket detail** page with the public thread, internal notes for support, assignment, status/priority, SLA / waiting-on stuff, and an activity log.

You can flip between **User**, **Support Agent**, and **Admin** at the top — mostly so I could demo customer vs staff in one build. Bulk actions on cards are **admin** only; agents get simpler actions.

First time you open it, it seeds a bunch of fake tickets so the dashboard isn’t empty.

## Repo layout (rough map)

`src/pages/` — the three screens.  
`src/components/` — cards, forms, thread, navbar, role switcher, etc.  
`src/context/TicketContext.jsx` — reducer.  
`src/hooks/useTickets.js` — what the UI calls to change tickets.  
`src/services/` — mock data, localStorage wrapper, helpers to migrate old saved shapes, plus filter/sort logic for the dashboard.

Tickets sit in **`ticketsById`** plus **`ticketOrder`** so I’m not copying huge arrays around every update.

## Assignment links I had to follow

Meeedly’s [structure reference (playlist, video index 10)](https://www.youtube.com/watch?v=-sjc31rI5lQ&list=PLN_pZg3k2CjjoJBAY9ftCEgpyJuDpF-9q&index=10) — I checked my folders/UI against that before calling it done.  
Noplin: [noplin.meeedly.com](https://noplin.meeedly.com/)


## Reality check

No backend, no real auth, no websockets. It’s a frontend project — good for showing how I’d structure things before plugging in an API.

## Submission bits

**YouTube title https://youtu.be/Xagu6WDYm70
`Scalable Support Ticket System Made from Noplin UIs by Meeedly - Adithya - Carleton University`

- **Repo:** [github.com/adithyalee/Ticket-System](https://github.com/adithyalee/Ticket-System)  

