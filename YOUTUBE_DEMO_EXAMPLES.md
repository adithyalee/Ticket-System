# Demo examples — what to actually *do* on screen

Use this like a recipe while you record. Swap the words if you want; keep the **order** so you hit every requirement.

---

## Setup (before recording)

1. Run `npm run dev`, open the app (usually `http://localhost:5173/`).
2. Fullscreen or maximize the browser so text is readable.
3. Start your screen recorder.

---

## Example A — full walkthrough (~8–10 min)

### 1) Intro (you talking, app visible or black screen)

- “I’m Adithya from Carleton. This is my Meeedly internship project — a support ticket system in React with Noplin UI, no Redux or extra UI libraries.”

### 2) Dashboard first

- Click **Dashboard** in the nav if you’re not there.
- **Scroll** the ticket list a bit.
- Type something in **search** — e.g. `billing` or a ticket id like `TKT-1001` — show the list change.
- Click a **status** filter (e.g. **Open**), then **All** or **Clear Filters** if you have it.
- Change **sort** once (e.g. **Sort: Priority**).
- Change **page size** (e.g. **10/page** → **50/page**) or click **Next** on pagination.
- Click one **stat card** (e.g. **Urgent** or **Unassigned**) and show the list filtering.

**Say:** “Dashboard is for triage — search, filters, sort, pagination, and these cards double as quick filters.”

### 3) Roles

- At the top, click **Support Agent** — point at the label (e.g. Jordan).
- Click **Admin** — point at bulk-style actions if visible on cards.
- Click **User** (Taylor) for the next step.

**Say:** “I can switch personas — customer vs support vs admin. Bulk stuff is admin-only in my build.”

### 4) Create a ticket (as User)

- Click **+ New Ticket** (or **Create Ticket** in nav).
- **Title** (example — you can paste this):

  `Billing export times out after 30 seconds`

- Pick any **Category** (e.g. **Billing**) and **Priority** (e.g. **Medium**).
- **Description** (example):

  `When I go to Reports → Export and choose CSV, the spinner runs then the page goes blank. Browser is Chrome, happens every time since yesterday. Account: demo@company.com`

- Click **Submit Ticket**.
- You should land on the **ticket detail** page for the new ticket.

**Say:** “Customer flow is: describe the issue, submit, land on the ticket.”

### 5) Ticket page — support side

- Switch role to **Support Agent** or **Admin**.
- Scroll to **Post a Public Reply**, type something like:

  `Thanks for the detail. We're reproducing on our side and will update you within one business day.`

- Click **Send Reply** — show the message in the **Conversation** thread.
- Scroll to **Add Internal Note** (if visible for your role), type:

  `Internal: possible timeout on large CSV — check API gateway logs for this org.`

- Submit — show it under **Internal Notes** (or the internal tab), **not** as a normal customer message.

**Say:** “Public thread is what the customer sees; internal notes stay on our side.”

### 6) Management panel (same ticket)

Do at least **two** of these (don’t rush):

- **Assign Team** — click a different team (e.g. move from one team to **Platform Support** or **Billing Ops**).
- **Assign Agent** — click an agent name (e.g. **Agent Lee**).
- **Status** — e.g. **Open** → **In Progress**.
- **Workflow** — e.g. **Waiting On Customer** or **Waiting On Support** (show the button state if it highlights).

Glance at **Recent Activity** — mention that changes show up there.

### 7) Persistence

- **Refresh** the browser (F5).
- Scroll to the same ticket — your new ticket should still exist, with reply / note / updates still there.

**Say:** “State is in localStorage for this demo, so refresh keeps data.”

### 8) Admin extra (optional, ~30 sec)

- Go **Dashboard** as **Admin**.
- Click **Select** on a ticket card, then use the **bulk** bar (**Start Work** / **Mark High** / etc.) once.
- **Say:** “Admins can multi-select and bulk-update.”

### 9) Code (optional, ~1–2 min)

Follow **[YOUTUBE_CODE_TOUR.md](YOUTUBE_CODE_TOUR.md)** — at minimum `package.json` deps + `src/` tree + `TicketContext` reducer.

### 10) Outro

- “Repo and Medium are in the description. Thanks.”

---

## Example B — short version (~4–5 min)

1. Dashboard: **one** search + **one** filter + **one** sort or page change.  
2. Role → **User** → **New Ticket** → short title + one sentence description → **Submit**.  
3. Role → **Support Agent** → **public reply** + **internal note**.  
4. **One** management change (status or assign agent).  
5. **F5** refresh.  
6. Say **Noplin** + **Context/reducer** + **no Redux** once.  
7. Done.

---

## Example phrases (copy ideas, not required verbatim)

| Moment | You could say |
|--------|----------------|
| Stack | “React and Noplin components only — no Material, no Redux.” |
| State | “Ticket updates go through Context and a reducer.” |
| Data | “Tickets are normalized: a map by id plus display order.” |
| Why | “Internal notes vs public replies is what makes it feel like real support software.” |

---

## Checklist (tick while recording)

- [ ] Dashboard + search/filter/sort or pagination  
- [ ] Role switcher used  
- [ ] New ticket as **User**  
- [ ] Public reply  
- [ ] Internal note  
- [ ] Assignment or status/workflow change  
- [ ] Browser refresh — data still there  
- [ ] Said **Noplin** + **no extra UI/state libs**  

**YouTube title (exact):**  
`Scalable Support Ticket System Made from Noplin UIs by Meeedly - Adithya - Carleton University`

More folder-by-folder code path: [YOUTUBE_CODE_TOUR.md](YOUTUBE_CODE_TOUR.md)
