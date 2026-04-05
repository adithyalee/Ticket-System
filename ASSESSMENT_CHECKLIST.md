# Assessment Checklist

Use this checklist before submitting the project.

## Core Feature Checklist

- [x] Ticket creation page exists
- [x] Ticket creation includes title and detailed description
- [x] Individual ticket detail page exists
- [x] Ticket detail shows conversation history clearly
- [x] Ticket detail allows replies
- [x] Dashboard lists all tickets
- [x] Dashboard supports organization of tickets
- [x] Dashboard supports assignment and filtering actions

## Engineering Checklist

- [x] Built with React
- [x] Uses `noplin-uis` for the visible interface
- [x] No additional app libraries added for state/UI workflows
- [x] Reusable component structure is present
- [x] State is centralized through Context + reducer
- [x] Tickets use normalized storage shape
- [x] Dashboard uses search, sorting, pagination, and memoized derivation
- [x] Supports high-volume demo data
- [x] Supports multi-team ticket ownership and routing
- [x] Supports internal notes and public replies

## Product Thinking Checklist

- [x] Customer flow is simple and clear
- [x] Manager/support triage flow is efficient
- [x] Ticket ownership is visible
- [x] Waiting state and SLA pressure are visible
- [x] Activity history is available for auditing

## Submission Checklist

Follow **[SUBMISSION.md](SUBMISSION.md)** for commands and order.

- [x] README includes setup instructions
- [x] README explains architecture decisions
- [x] README explains scalability decisions
- [x] YouTube script file exists and is submission-oriented
- [x] Medium article file exists and matches the project direction
- [ ] Copy `SUBMISSION_PROFILE.template.md` → `SUBMISSION_PROFILE.md` and fill values
- [ ] Replace placeholder personal details and public links in README / video description / Medium
- [ ] Confirm final folder/interface naming against the [official structure video](https://www.youtube.com/watch?v=-sjc31rI5lQ&list=PLN_pZg3k2CjjoJBAY9ftCEgpyJuDpF-9q&index=10) (this is **not** your submission recording; it is the assignment spec)
- [ ] Publish the repository publicly and push `main`
- [ ] Record and upload the YouTube walkthrough (correct title format, not a live stream)
- [ ] Publish the Medium article with final links

## Final Manual QA

- [ ] Create a new ticket as `User`
- [ ] Reply as `Support Agent`
- [ ] Add an internal note as `Admin` or `Support Agent`
- [ ] Reassign the ticket to another team and agent
- [ ] Bulk-manage selected tickets from the dashboard
- [ ] Refresh the page to confirm persistence
