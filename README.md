# BugSense AI

An AI-powered bug management and developer collaboration mobile app. QA
Engineers create projects and submit detailed bug reports; Developers get
assigned bugs, review AI-generated analysis, collaborate via comments, and
update status until QA verifies and closes the fix.

## The problem

Bug reports often lack enough technical detail, causing repeated
back-and-forth between QA and Developers and slowing down debugging.
BugSense AI uses AI to analyze bug reports and surface technical insights
*before* a developer starts working on the issue.

## Roles

- **QA Engineer** — creates/manages projects, submits bug reports (with
  reproduction steps and attachments), assigns bugs to Developers, verifies
  fixes, and closes or reopens bugs.
- **Developer** — views bugs assigned to them, reviews the AI-generated
  analysis, updates status as they work, and collaborates via comments.

## Bug lifecycle

```
created → assigned → in_progress → fixed → verified → closed
                                      ↑         │
                                      └─ reopened (QA rejects the fix)
```

## Features / Modules

- **Auth** — register/login (JWT), forgot-password flow (6-digit emailed
  code), change password.
- **Projects** — QA creates projects and manages members (QA/Developer),
  with per-project bug-status pipeline stats.
- **Bug Reporting** — QA submits bugs with title, description, reproduction
  steps, severity, and file attachments (images, text logs, PDFs).
- **AI Bug Analyzer** — on submission, the **Gemini API** generates a
  summary, likely root causes, affected modules, a severity recommendation,
  and debugging recommendations. Generated once and stored, not
  regenerated on every view.
- **Assignment & Lifecycle** — QA assigns a bug to a Developer; the
  Developer moves it through `in_progress → fixed`.
- **Comments** — threaded discussion on a bug between QA and the assigned
  Developer.
- **Verify / Close / Reopen** — QA verifies a fix, closes it, or rejects it
  and reopens it for the same Developer.
- **Dashboard** — role-aware at-a-glance metrics (active projects, open
  bugs, bugs needing attention/assigned to you).

## Tech stack

- **Mobile app** — React Native CLI (0.86), plain JavaScript (no
  TypeScript), Redux Toolkit + RTK Query, React Navigation, Formik + Yup.
- **Backend** — Node.js / Express.js, MongoDB (Mongoose).
- **AI integration** — Gemini API.

## Repo structure

```
bugsense/
├── PROJECT_SCOPE.md        # project idea, scope, domain context
├── CLAUDE.md                # shared/root coding context
├── backend/
│   ├── CLAUDE.md            # backend coding conventions
│   └── src/
│       ├── config/          # db + logger setup
│       ├── controllers/     # route handlers
│       ├── helpers/         # mail, tokens, Gemini, validators, pagination
│       ├── middleware/      # auth, upload, validation, error handling
│       ├── models/          # Mongoose schemas
│       ├── routes/          # Express routers
│       └── utils/           # shared enums/constants
└── mobileapp/
    ├── CLAUDE.md             # mobile coding conventions
    ├── DESIGN.md             # UI/UX specs
    └── src/
        ├── components/       # base wrapper components (Button, Text, Input, ...)
        ├── config/           # environment config
        ├── helpers/          # colors, metrics, routes, navigation ref, etc.
        ├── navigation/       # stack + tab navigators
        ├── redux/            # store, RTK Query APIs, slices
        └── screens/          # feature screens (Auth, Projects, Bugs, ...)
```

## Getting started

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in MONGODB_URI, JWT_SECRET, GEMINI_API_KEY, SMTP_*
npm run dev
```
Runs on `http://localhost:5050`.

### Mobile app
```bash
cd mobileapp
npm install
npx react-native start          # in one terminal
npx react-native run-ios        # or run-android, in another
```

## Scope boundaries

Mobile-first only (no web app for now). Built for a small-to-mid-size team,
not enterprise scale — no multi-tenancy or SSO unless explicitly requested.
