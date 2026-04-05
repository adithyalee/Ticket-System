# YouTube walkthrough — rough script

**Step-by-step shot list + checkboxes:** [YOUTUBE_DEMO_FORMAT.md](YOUTUBE_DEMO_FORMAT.md)

## Title (paste exactly)

`Scalable Support Ticket System Made from Noplin UIs by Meeedly - Adithya - Carleton University`

## Description (starter)

Walkthrough of my Meeedly internship project — scalable support ticket system in React + Noplin UI.

Adithya, Carleton University.

- Repo: https://github.com/adithyalee/Ticket-System  
- Medium: (paste your link)

---

## What to say (not word-for-word if you don’t want)

**Intro**  
Hey, I’m Adithya from Carleton. This is my submission for the Meeedly internship build: a support ticket system. It’s React, Noplin components for the actual UI, and I didn’t add Redux or another UI library—just Context and a reducer.

**Why it’s not “just CRUD”**  
The brief was basically: think like a real SaaS support team. So there’s teams, routing, SLAs, queues, internal notes vs public replies, and a dashboard that doesn’t fall over when there are a lot of tickets.

**Dashboard**  
Show the list, search, filters, sorting, pagination. Mention the stat cards—some of them double as quick filters. Show role switcher: User vs agent vs admin (bulk select is admin).

**Create flow**  
Switch to User, create a ticket, land on detail page.

**Ticket page**  
Thread for the customer, internal notes tab for support, assignment, status/priority, workflow stuff, activity log at the bottom.

**Code (quick)**  
Flip to the editor: `pages`, `components`, `TicketContext` + reducer, `useTickets`, `services` for storage and mock data. I pulled filter/sort logic into `ticketSelectors` so the dashboard component wasn’t doing everything inline.

**Wrap**  
Thanks for watching—links in the description.

---

## Before you hit record

- App running (`npm run dev`)
- Real Medium + YouTube links in the description when you have them
- Show all three pages + role switch + at least one reply and one internal note
- Say clearly: Noplin for UI, no extra state/UI libs
