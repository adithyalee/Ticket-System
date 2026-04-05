# YouTube walkthrough — what to show (run-of-show)

Use this as your shot list while recording. You don’t have to follow the minute marks exactly.

---

## When you upload the video

**Title (copy exactly, one line):**

`Scalable Support Ticket System Made from Noplin UIs by Meeedly - Adithya - Carleton University`

**Description (paste and fill in):**

```
Meeedly Software Engineering Internship — support ticket system (React + Noplin UI).

Adithya, Carleton University.

GitHub: https://github.com/adithyalee/Ticket-System
Medium: [paste your article URL here]
```

---

## Before you hit record

- [ ] `npm run dev` running, app loads with no errors in console (ideally)
- [ ] Browser window big enough to read text (1080p recording is enough)
- [ ] Mic test — say one sentence and play it back
- [ ] Optional: second half of video = quick code peek (VS Code / Cursor already open to the repo)

---

## Minimum they should *see* (check these off)

These map to the assignment + your README.

| # | Show |
|---|------|
| 1 | **Dashboard** — list of tickets, not empty |
| 2 | **Search or a filter** — list changes (e.g. search a word, or pick a status) |
| 3 | **Sort or pagination** — something that proves the list is manageable at volume |
| 4 | **Role switcher** — at least two roles (e.g. User → Support Agent or Admin) |
| 5 | **Create ticket** — as **User**: new ticket with title + description, lands on detail page |
| 6 | **Ticket detail** — **public reply** (as support/admin) appears in the thread |
| 7 | **Internal note** — as Support Agent or Admin, only in internal-notes path (not mixed into customer thread if your build separates tabs) |
| 8 | **Management stuff** — team or agent assignment, or status/priority change (one is enough) |
| 9 | **Persistence** — **refresh the page** (F5), ticket you care about is still there |
| 10 | **Say out loud once:** built with **React**, **Noplin UI** for components, **no Redux / no extra UI library** (Context + reducer is fine to mention) |

**Admin-only extra (good if you have 30 sec):** select tickets on the dashboard → bulk bar appears → one bulk action.

---

## Suggested order (~6–12 minutes)

| Block | About | What you do |
|-------|--------|-------------|
| **0 — Intro** | 30–60 sec | Name, school, “this is my Meeedly internship project,” one sentence on what the app is. |
| **1 — Dashboard** | 1–2 min | Scroll the list, hit a filter or search, change sort or page size, click a stat card if you use that. Mention queues (Mine, Unassigned, etc.) in one breath. |
| **2 — Roles** | 20 sec | Switch User → Agent → Admin; say bulk tools are for admin only. |
| **3 — New ticket** | 1 min | As **User**, create ticket → you’re on detail page. |
| **4 — Ticket page** | 2–3 min | Public reply, internal note, one assignment or status change, glance at activity log. |
| **5 — Refresh** | 15 sec | F5 — “still here because localStorage.” |
| **6 — Code (optional)** | 1–2 min | Show `src/pages`, `TicketContext.jsx`, `useTickets.js`, `services` — don’t read every file; just prove structure. |
| **7 — Outro** | 20 sec | “Repo and Medium in the description,” thanks. |

Shorter video: do blocks **0, 1, 3, 4, 5** + say Noplin + no extra libs in intro or outro (~4–5 min).

---

## One-liners that help reviewers

You can drop these anywhere natural:

- “Noplin handles buttons, inputs, cards — I didn’t add Material or Tailwind components.”
- “State is Context and `useReducer`, so all ticket updates go through one place.”
- “Tickets are normalized — `ticketsById` plus an order array — so the dashboard doesn’t get nasty when data grows.”

---

## Don’t stress about

- Perfect editing — cuts are fine, silence is fine.
- Reading the README out loud — they can read GitHub.
- Explaining every file — breadth over depth is OK for an internship demo.

---

## Not your submission video

The [official Meeedly structure playlist (index 10)](https://www.youtube.com/watch?v=-sjc31rI5lQ&list=PLN_pZg3k2CjjoJBAY9ftCEgpyJuDpF-9q&index=10) is for **matching folder/UI spec**. Your upload is **your** walkthrough of **this** repo.

More loose talking points: [YOUTUBE_SCRIPT.md](YOUTUBE_SCRIPT.md)
