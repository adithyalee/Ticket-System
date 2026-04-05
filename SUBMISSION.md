# Submission checklist

I use this so I don’t forget something dumb the night before the deadline. Only you can actually publish GitHub / YouTube / Medium.

## 1. Fill your details

1. Copy `SUBMISSION_PROFILE.template.md` to `SUBMISSION_PROFILE.md` (same folder).
2. Replace every `YOUR_...` value with your real project title, name, university, and links **after** you create the repo and uploads.

`SUBMISSION_PROFILE.md` is listed in `.gitignore` so your links stay local if you prefer. If you want them in the repo, remove that line from `.gitignore` or paste final links only into `README.md`.

## 2. Match the required video structure

Open the **official Meeedly structure video** and confirm your folders, file names, and UI patterns match:

[https://www.youtube.com/watch?v=-sjc31rI5lQ&list=PLN_pZg3k2CjjoJBAY9ftCEgpyJuDpF-9q&index=10](https://www.youtube.com/watch?v=-sjc31rI5lQ&list=PLN_pZg3k2CjjoJBAY9ftCEgpyJuDpF-9q&index=10)

If something differs, rename or refactor **before** you record your **own** submission walkthrough.

## 3. Clean commit history (recommended)

From this folder:

```powershell
cd C:\Users\muska\Desktop\Meeedly\ticket-system
git status
```

Stage and commit in logical chunks, for example:

```powershell
git add src/services/ticketShape.js src/services/ticketSelectors.js src/services/storageService.js
git commit -m "feat: ticket shape migration and dashboard selectors"

git add src/pages src/components src/context src/hooks
git commit -m "feat: enterprise dashboard, ticket detail, and workflows"

git add README.md ASSESSMENT_CHECKLIST.md SUBMISSION.md MEDIUM_ARTICLE.md
git commit -m "docs: submission materials and README"
```

Adjust grouping to taste; aim for **clear messages**, not one giant “final” commit.

## 4. Public GitHub repository

1. On GitHub: **New repository** → public → no README if this folder already has one.
2. Add remote if needed, then push:

```powershell
git remote -v
git push -u origin main
```

3. Copy the **public** repo URL into `README.md` (Submission Links) and into your YouTube description and Medium article.

## 5. Run the app before recording

```powershell
npm install
npm run dev
```

Open the URL shown (usually `http://localhost:5173/`). Walk through **ASSESSMENT_CHECKLIST.md** → *Final Manual QA*.

## 6. YouTube video (required format)

- **Not** a live stream.
- **Title** for this submission (exact assignment pattern):

  `Scalable Support Ticket System Made from Noplin UIs by Meeedly - Adithya - Carleton University`

- **Visibility:** The brief often says reviewers should be able to find your work. **Public** is safest. **Unlisted** is fine if you send them the link in your application email/portal (anyone with the link can watch; it won’t show on your channel for browse). **Private** usually **does not work** for reviewers—they can’t open it unless you add each person’s Google account, so avoid private for submissions.
- Paste **repo + Medium** links in the description.

## 7. Medium article

- Publish the article (you can adapt `MEDIUM_ARTICLE.md`).
- Embed or link **GitHub** and **YouTube**.

## 8. Final pass

- [ ] `npm run lint` and `npm run build` both succeed
- [ ] README links are real URLs, not placeholders
- [ ] Checklist in `ASSESSMENT_CHECKLIST.md` is fully ticked

## After URLs exist

Search the repo for placeholder links and put your real **YouTube**, **GitHub**, and **Medium** URLs in **README**, video description, and **MEDIUM_ARTICLE.md** when you publish.
