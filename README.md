# TicketFlow Support Ticket System (Meeedly)

A scalable, maintainable support ticket system built with React and Noplin UI components. It demonstrates real-world SaaS-style thinking with normalized state management, efficient updates, reusable UI components, and `localStorage` persistence (no backend required).

## Features

- Ticket creation (title + detailed description, category, priority)
- Ticket detail view with a clear conversation thread
- Support/Admin actions: assign tickets to mock agents, update status, update priority
- Enterprise dashboard: search + filtering + sorting + pagination
- Mock role switching (no auth) via a UI role switcher

## How to Install

```bash
npm install
```

## How to Run

```bash
npm run dev
```

Then open the URL shown in your terminal (typically `http://localhost:5173/`).

## Folder Structure

```txt
src/
  pages/
    CreateTicket.jsx
    TicketDetail.jsx
    Dashboard.jsx
  components/
    TicketForm.jsx
    TicketCard.jsx
    MessageThread.jsx
    StatusBadge.jsx
    Navbar.jsx
    RoleSwitcher.jsx
  context/
    TicketContext.jsx
  hooks/
    useTickets.js
  services/
    storageService.js
    mockData.js
```

## Tech Stack

- React
- Noplin UI (`noplin-uis`) for UI components
- React Context API + `useReducer` for state management
- Browser `localStorage` for persistence

