# What code to show on video (folder order)

Use this as a **click path** in VS Code / Cursor. You don’t need to open every file—**show the folder tree**, then open a few files for 5–10 seconds each.

---

## 1. Project root (10 sec)

- Open **`package.json`**
- Scroll to **`dependencies`**
- Say: *“Only `react`, `react-dom`, and `noplin-uis`—no Redux, no extra UI kit.”*

---

## 2. `src/` — the whole tree (10 sec)

In the file explorer, expand **`src/`** so they see:

```
src/
  components/
  context/
  hooks/
  pages/
  services/
  App.jsx
  main.jsx
```

Say: *“Pages are screens, components are reusable pieces, context is state, hooks wrap the API, services are data and helpers.”*

---

## 3. `src/pages/` (20–30 sec)

Open **one** file they already saw in the demo, e.g. **`Dashboard.jsx`**.

Say: *“This is the triage screen—filters, list, pagination live here.”*

Optionally point at the tab bar for **`CreateTicket.jsx`** and **`TicketDetail.jsx`** without reading code line by line.

---

## 4. `src/context/TicketContext.jsx` (30 sec)

Scroll to **`ticketReducer`** / the big **`switch (action.type)`**.

Say: *“All ticket updates go through the reducer—create, reply, assign, update, delete.”*

You don’t need to explain every case—**show the structure**.

---

## 5. `src/hooks/useTickets.js` (20 sec)

Scroll the top: **`createTicket`**, **`addMessage`**, **`updateTicket`**, etc.

Say: *“Components call this hook instead of touching the reducer directly.”*

---

## 6. `src/services/` (30 sec)

Show the **folder**; open briefly:

| File | One line |
|------|-----------|
| **`mockData.js`** | Fake teams, agents, seed tickets |
| **`storageService.js`** | Saves/loads from `localStorage` |
| **`ticketSelectors.js`** | Dashboard filter/sort logic |
| **`ticketShape.js`** | Fills in missing fields on old saved data |

Say: *“Persistence and heavy list logic stay out of the React components.”*

---

## 7. `src/components/` (15 sec)

Expand the folder—name-drop **2–3** files:

- **`TicketCard.jsx`** — row on the dashboard  
- **`TicketForm.jsx`** — create + reply  
- **`MessageThread.jsx`** — conversation UI  

No need to open all of them if you’re short on time.

---

## 8. `src/App.jsx` (10 sec)

Show **`TicketProvider`** wrapping the app and how **dashboard / new / detail** are switched.

Say: *“Single app shell—no React Router package, just state for which page is active.”*

---

## Skip on video (unless they ask)

- `node_modules/`  
- `dist/`  
- Every CSS line  
- `SUBMISSION_PROFILE.md` / secrets  

---

## Minimum “code” segment (under 1 minute)

1. `package.json` dependencies  
2. `src/` folder tree  
3. `TicketContext.jsx` reducer `switch`  
4. `useTickets.js` (top of file, function names)  

That’s enough to prove structure and constraints.
