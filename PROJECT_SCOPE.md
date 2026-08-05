# PROJECT_SCOPE.md — BugSense AI

## What this project is
BugSense AI is an AI-powered bug management and developer collaboration mobile app. QA Engineers create projects and submit detailed bug reports (description, reproduction steps, screenshots, logs). Developers get assigned bugs, review AI-generated analysis, collaborate via comments, and update status until QA verifies and closes the fix.

## Problem it solves
Bug reports often lack enough technical detail, causing repeated back-and-forth between QA and Developers and slowing down debugging. BugSense AI uses AI to analyze bug reports and surface technical insights before a developer starts working on the issue.

## Core AI feature: AI Bug Analyzer
On bug submission, it generates:
- A concise bug summary
- Possible root causes
- Suggested affected modules
- Severity recommendation
- Debugging recommendations

Uses the **Gemini API** (not Claude API) for this. Output is generated once at submission and stored on the bug record — not regenerated on every view.

## Actors & roles

### QA Engineer
- Create/manage projects
- Create bug reports
- Add reproduction steps
- Attach screenshots/logs
- Assign bugs to Developers
- Track bug status
- Verify fixes

### Developer
- View assigned bugs
- Review AI-generated analysis
- Add comments
- Update bug status
- Mark bugs as fixed

## Bug lifecycle
`created → assigned → in_progress → fixed → verified → closed`

(`reopened` if QA rejects a fix)

## User workflow
1. QA Engineer creates a project.
2. QA Engineer submits a bug report (description, reproduction steps, attachments).
3. AI Bug Analyzer generates technical insights.
4. QA Engineer assigns the bug to a Developer.
5. Developer reviews AI analysis, updates status, adds comments while working.
6. QA Engineer verifies the fix and closes the bug.

## Tech stack
- **Mobile app:** React Native - CLI
- **Backend:** Node.js & Express.js
- **Database:** MongoDB
- **AI integration:** Gemini API

## Repo structure
```
bugsense/
├── PROJECT_SCOPE.md        (this file — idea, scope, domain context)
├── CLAUDE.md               (shared/root coding context, if any)
├── backend/
│   └── CLAUDE.md           (backend coding conventions, folder structure, patterns)
└── mobileapp/
    ├── CLAUDE.md           (mobile coding conventions, folder structure, patterns)
    └── DESIGN.md           (UI/UX specs)
```

## Scope boundaries
- Mobile-first only, no web app version for now.
- Building for a small-to-mid-size team, not enterprise scale (no multi-tenant, SSO, etc.) unless explicitly requested.

## How to use this file
This file covers **project idea, scope, and domain context only**. It answers "what are we building and why." For coding patterns, folder structure, and technical conventions, defer to `backend/CLAUDE.md` or `mobileapp/CLAUDE.md` depending on which part of the codebase is being worked on.

When discussing any feature, architecture, or data model:
- Keep the QA/Developer role split central.
- Keep the bug lifecycle central.
- Assume the Gemini API for anything AI-related — never Claude's API.
- Flag security/scalability concerns relevant to a small team tool, but don't over-engineer for scale not yet requested.
