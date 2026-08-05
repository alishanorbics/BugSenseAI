# BugSense AI — Progress Summary

Written at the end of a long session to hand off to a fresh Claude Code session
with zero prior context. Read `PROJECT_SCOPE.md`, `CLAUDE.md`, `backend/CLAUDE.md`,
and `mobileapp/CLAUDE.md` first — this doc assumes familiarity with those.

**Nothing in this repo is committed to git yet.** `git status` shows everything
as untracked (`backend/`, `mobileapp/`, `CLAUDE.md`, `PROJECT_SCOPE.md`). No
commits have been made this entire session. A fresh session should probably
ask the user whether/when to make an initial commit.

## 1. What we just finished (this session, in build order)

### Backend scaffold (`bugsense/backend`)
Full Express/Mongoose skeleton: `app.js`, `server.js`, `src/config/{db,logger}.js`,
`src/middleware/{error,requestlog}.js`, `src/routes/index.js`, `.env`/`.env.example`.
Runs on **port 5050** (not 5000 — macOS's `ControlCenter`/AirPlay Receiver squats
on 5000 and silently intercepts requests without erroring; discovered via `lsof`).

### Mobile scaffold (`bugsense/mobileapp`)
React Native CLI, **plain JS/JSX only** (no TypeScript — the default RN 0.86
template is TS-first, so it was de-TypeScript-ified: `tsconfig.json` deleted,
`@types/*`/`typescript` removed from `package.json`). Full `src/` folder
structure per `mobileapp/CLAUDE.md`. Bundle ID `com.bugsense.app`.

### Theming (`src/helpers/colors.js`, `src/helpers/metrics.js`, `src/assets/fonts/index.js`)
Colors/fonts populated from `mobileapp/DESIGN.md` (dark-first palette: primary
`#1FCDF3` cyan, secondary `#178FC7`, background `#05060A`, muted `#D6D6D6`,
on_background `#FBFBFB`, **error `#FF4D4D`** — added later for required-field
asterisks and error states). Fonts: Orbitron (headings), Montserrat (body),
both linked natively via `react-native-asset` + `react-native.config.js` — the
actual `.ttf`/`.png` files live in a **top-level `mobileapp/assets/`** folder
(NOT under `src/`), because `react-native-asset` sweeps every file in whatever
directory it's pointed at, and colocating them with the `index.js` barrels
under `src/assets/` caused it to bundle the barrel `.js` file itself as a
native resource. `src/assets/fonts/index.js` and `src/assets/images/index.js`
are pure JS barrels; the binaries live outside `src/`.

### Base component library (`src/components/`)
`Text`, `Button`, `Input`, `Touchable`, `Row`, `Icon`, `FlatList`, `Loader`,
`Toast`. `Icon` uses **`lucide-react-native`** (NOT `react-native-vector-icons`
— that package doesn't actually ship a Lucide set despite what
`mobileapp/CLAUDE.md` implies; this was discovered empirically). `Icon`
maintains a curated string-name → component registry (~48 icons) rather than
importing all 3500+ lucide icons. `Toast` is a custom ref-based singleton
(mirrors the `helpers/navigation.js` pattern) — no toast library was installed.

### Redux (`src/redux/`)
`store/index.js` (redux-persist, whitelist `["auth","general"]`,
`baseApi`/`authApi` reducers excluded from persistence), `apis/Base/index.js`
(shared `baseApi`, `TAG_TYPES = ['User','Project','Bug','Comment']`),
`slices/auth.slice.js`, `slices/general.slice.js`, `selectors/index.js`,
`middlewares/error.middleware.js` (global toast on any `isRejectedWithValue`).

### Navigation (`src/navigation/`)
`MainStackNavigator` switches `AuthStackNavigator` ↔ `AppStackNavigator` on
`selectIsAuthenticated`. `AppStackNavigator`'s `initialRouteName` is
`ROUTES.PROJECT_LIST` — **there is no more `QAHome`/`DeveloperHome`**; those
placeholder routes were fully removed and replaced by `ProjectList` as the
real shared entry point for both roles.

### Auth module (backend `controllers/auth.controller.js`, `models/user.model.js`;
mobile `screens/Auth/*`)
Register/login (JWT via `helpers/token.js`), `AuthVerifier`/`OptionalAuthVerifier`
middleware, forgot-password flow (6-digit code, bcrypt-hashed, 10 min expiry,
emailed via `helpers/mail.js`/nodemailer). Mobile: `Login`, `Register`,
`ForgotPassword`, `VerifyResetCode`, `ResetPassword` screens, all Formik+Yup,
`redux/apis/Auth/index.js` is a **standalone `createApi`** (not injected into
`baseApi` — no token exists yet for these calls).

Forgot-password request-reset is **intentionally enumerable**: if the email
isn't registered, it returns `404 { success:false, message:'No account found
for this email.' }` immediately (no code generated, no email sent) instead of
a generic "if this exists…" message. This was an explicit, accepted tradeoff
for a small internal team tool (see git history / conversation — there's no
git history yet, but this was a deliberate user-approved change).

### Projects module (backend `models/project.model.js`,
`controllers/project.controller.js`, `routes/project.route.js`; mobile
`redux/apis/Project/index.js`, `screens/Projects/*`)
`Project.members` is a **plain array of `User` ObjectId refs** (not embedded
`{user, role}` subdocuments) — role is a global property of `User` in this
app (no per-project roles), so embedding would just be stale-prone
denormalization. Read role via `.populate('members', 'name email role')`.
Only the QA who created a project (`created_by`) can update it or manage
members — enforced both in the controller (403) and mirrored in the mobile
`useProjectDetailController`'s `can_manage_members`/`can_report_bug` flags.
**Project deletion was explicitly skipped** — flagged to the user as
deferred until the Bug module's cascade semantics are designed (see below,
this is now even more true since Bugs exist).

### Bug Reporting module (backend `models/bug.model.js`,
`middleware/upload.middleware.js`, `controllers/bug.controller.js`,
`routes/bug.route.js`; mobile `redux/apis/Bug/index.js`,
`screens/Bugs/{CreateBug,BugDetail}/*`)
Just completed and user-confirmed working end-to-end. Bug routes are nested
under project routes: `routes/bug.route.js` uses
`express.Router({ mergeParams: true })`, mounted in `routes/project.route.js`
via `router.use('/:project_id/bugs', bugRoutes)`. File uploads via `multer`
(disk storage into `backend/uploads/`, allowlist mimetypes: images +
`text/plain` + `application/pdf`, 10MB/5-file limits). `ai_analysis` field on
the Bug model is fully scaffolded (`summary`, `root_causes`,
`affected_modules`, `severity_recommendation`, `debugging_recommendations`)
but **all null/empty** — the mobile `BugDetail` screen shows a hardcoded
"Analysis pending." placeholder section. **Only QA who is the project
creator** can report bugs (`createBug` checks `project.created_by`).

Mobile attachment picking uses `react-native-image-picker`'s
`launchImageLibrary` (photo library only) — it does **not** support picking
arbitrary log/text files from the Files app, even though the backend already
accepts `text/plain`/`application/pdf` uploads (verified via curl). This is a
known, flagged gap — see Open Questions below.

## 2. What we were in the middle of

**Nothing is mid-flight.** The Bug Reporting module was the last task given,
and the user just confirmed (`"Yes close this out."`) that all three
end-to-end checks passed:
1. QA reports a bug on a project → sees it in the project's bug list
2. QA opens bug detail → sees fields + "AI Analysis: Analysis pending."
3. Developer sees the same bug read-only, no "Report Bug" button

No task is currently open. The session is at a natural stopping point.

## 3. Next steps (in likely order, per `PROJECT_SCOPE.md`'s user workflow)

1. **AI Bug Analyzer module** — the next logical module per `PROJECT_SCOPE.md`.
   On bug submission (or as a follow-up trigger), call the **Gemini API**
   (`GEMINI_API_KEY` placeholder already exists in `.env`/`.env.example`, but
   the real key has **not** been set — check `backend/.env` before assuming
   it's live) to populate `Bug.ai_analysis.*`. Output is generated **once** at
   submission and stored, not regenerated on every view (explicit
   `PROJECT_SCOPE.md` requirement). This will need a new `helpers/gemini.js`
   or similar, and either a synchronous call inside `createBug` or an async
   job — recommend starting synchronous for simplicity given "small team"
   scope, but flag latency implications to the user (bug creation would block
   on the AI call).
2. **Assignment + status-transition endpoints** — explicitly deferred by both
   the Projects and Bug Reporting task instructions. QA assigns a bug to a
   Developer (`Bug.assignee`), status moves through
   `created → assigned → in_progress → fixed → verified → closed`
   (`reopened` if QA rejects a fix). `BUG_STATUS` enum already exists in
   `backend/src/utils/index.js` with all 7 values — no schema changes needed,
   just new controller endpoints + inline role/ownership checks (Developer can
   only update status on bugs assigned to them; QA can verify/close/reopen).
3. **Comments** — Developer collaboration while working a bug. Needs a new
   `Comment` model (`TAG_TYPES` in `mobileapp/src/redux/apis/Base/index.js`
   already includes `'Comment'`, anticipating this).
4. **Mobile document picker for log attachments** — add
   `react-native-document-picker` (or extend the existing
   `react-native-image-picker` flow) so QA can attach `.txt`/`.log` files, not
   just photos, closing the gap noted above.
5. **Rate-limiting** — flagged twice now (once on the password-reset code
   endpoints, once implicitly on bug-report file uploads) and skipped both
   times as out-of-scope-for-now. Worth a dedicated pass
   (`express-rate-limit`) before this app is used by anyone outside a fully
   trusted small team.
6. **Project deletion** — still not built. Now that Bugs reference Projects,
   deletion needs real cascade/archive semantics designed, not a naive
   `findByIdAndDelete`.

## 4. Blockers / open questions (unresolved, need a decision)

- **Gemini API key**: not set in `backend/.env`. The AI module cannot be
  tested end-to-end until the user provides a real key (same pattern as SMTP
  credentials earlier in this session — placeholders only, user fills in
  real secrets).
- **Assignment/status-transition authorization model**: not yet designed.
  Open question for whoever builds it: can a Developer self-assign, or only
  QA assigns? Can a Developer move status backward? `PROJECT_SCOPE.md` says
  "QA Engineer... Assign bugs to Developers" (QA-initiated) and "Developer...
  Update bug status" + "Mark bugs as fixed" — suggests QA assigns, Developer
  transitions forward through their own assigned bugs, QA alone verifies/closes/reopens.
  Not yet confirmed with the user.
- **Project deletion semantics**: cascade-delete bugs, block deletion if bugs
  exist, or soft-archive? Not decided.
- **Mobile automated UI testing in this environment is unreliable**: tap
  coordinates via `mcp__Claude_Code_iOS_Simulator__control` have intermittently
  failed to land correctly all session (confirmed by the user watching the
  simulator directly — "your pointer is not tapping at correct place"). The
  established, user-agreed workaround for the rest of this session was:
  Claude verifies backend exhaustively via `curl` + does careful code review,
  then the **user manually walks through the mobile UI** and reports
  pass/fail. Don't burn time re-debugging tap calibration; just ask the user
  to test and describe results. Backend curl testing has been 100% reliable
  throughout.

## 5. Relevant context / conventions / gotchas for a fresh session

### Environment / how to run things
- Backend: `cd backend && node server.js` (or `npm run dev` for nodemon).
  **Port 5050**, not 5000 (see above). Currently running as PID 30498 (may be
  dead by the time you read this — check `lsof -nP -i :5050`).
- Metro: `cd mobileapp && npx react-native start`. Was running as PID group
  24819/24839 — check `pgrep -fl "react-native start"` before starting a
  second instance (a stray Metro from an earlier task once squatted on port
  8081 and silently broke a fresh Metro start; always `pkill -f "react-native
  start"` first if unsure).
- iOS build: `cd mobileapp/ios && bundle exec pod install` (needs
  `LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8` env vars set or CocoaPods errors with
  a cryptic Ruby encoding exception), then
  `xcodebuild -workspace BugsenseApp.xcworkspace -configuration Debug -scheme
  BugsenseApp -destination id=BE368EC3-64FB-4A8B-8D8F-F3E410E7B002 build`.
  Simulator UDID `BE368EC3-64FB-4A8B-8D8F-F3E410E7B002` (iPhone 17 Pro).
  Built app path:
  `/Users/alishan/Library/Developer/Xcode/DerivedData/BugsenseApp-hjkufakuywrqshaxnopgcvcmyimk/Build/Products/Debug-iphonesimulator/BugsenseApp.app`.
- **After adding any new native dependency**, do a full clean rebuild (`rm
  -rf ~/Library/Developer/Xcode/DerivedData/BugsenseApp-*`) rather than
  incremental — incremental builds after new native modules repeatedly
  produced incomplete `.app` bundles (missing `Info.plist`/executable) this
  session for no clear reason. Also: **never combine `run_in_background:
  true` on the Bash tool with a trailing `&` in the command string** — this
  double-backgrounds the process, the wrapper reports "completed" instantly
  while the real build keeps running detached and undetected. Always verify
  with `ps`/`lsof` before trusting a completion notification for anything
  backgrounded this way.
- To reset the mobile app's logged-in session (no logout button exists yet):
  `xcrun simctl uninstall <UDID> com.bugsense.app && xcrun simctl install
  <UDID> <app-path> && xcrun simctl launch <UDID> com.bugsense.app`.

### Test accounts (already registered in the live MongoDB Atlas DB)
- QA: `mobile.qa@example.com` / password **`finalpassword789`** (was reset
  mid-session via the forgot-password flow; the original registration
  password no longer works).
- Developer: `mobile.dev@example.com` / `password123`.
- Both are QA-creator/member of a project named **"BugSense Mobile App"**
  (has an "Updated description." description, one bug report titled "Login
  button unresponsive on iOS" with a `.txt` attachment already on it).
- An "outsider" QA account also exists: `outsider.qa@example.com` /
  `password123` (registered purely to test access-denial; not a member of
  anything).

### Jest gotcha (hit repeatedly — check this FIRST before debugging any new "SyntaxError: Unexpected token 'export'" in tests)
`mobileapp/jest.config.js`'s `transformIgnorePatterns` allowlist and its
`transform` regex have both needed expanding **every single time** a new
native/ESM package was added and first reached by the test's `require` graph.
Current allowlist (as of this session) covers: `react-native`,
`@react-native-community`, `@react-native-async-storage`, `@react-navigation`,
`@reduxjs/toolkit`, `react-redux`, `redux-persist`, `immer`,
`react-native-screens`, `react-native-gesture-handler`, `lucide-react-native`,
`react-native-svg`, `react-native-image-picker`. The `transform` regex also
had to be widened from `js|jsx|ts|tsx` to include `mjs` (lucide resolves to
`.mjs` files under Jest's resolver). **If a fresh session adds any new
package that gets imported anywhere in the App.jsx require chain, expect this
exact failure mode again** — the fix is always: add the package name to the
`transformIgnorePatterns` regex alternation. First-time transform of a new
large package (e.g. lucide's ~3500 icon files) can take up to ~15 minutes;
it's cached to ~1.5s on every subsequent run. Don't assume a hang — check if
it's just slow.

### Backend conventions confirmed/established this session
- `helpers/pagination.js`'s `buildPaginationResponse` didn't exist before
  this session even though `backend/CLAUDE.md` referenced it — it was built
  from scratch when the first paginated endpoint (`listProjects`) needed it.
- Mongoose version in this project is **9.8.0** (unusually new). Its
  `pre('save')` hooks do **not** accept the legacy `(next)` callback
  parameter for async functions anymore — using
  `pre('save', async function(next) { ... next(); })` throws `TypeError: next
  is not a function` at runtime. Always use pure `async function() { ...
  return; }` with no `next` param (see `user.model.js`'s `hashPassword` hook
  for the correct pattern).
- Every list endpoint uses the same pagination shape:
  `{ success, message, data: [...], pagination: { page, limit, total,
  total_pages } }`.
- Every "does the logged-in user have access to this resource" check follows
  the same `is_creator || is_member` pattern — see `hasProjectAccess` in
  `bug.controller.js` (a small local helper) and the inline equivalent
  duplicated in `project.controller.js`'s `getProject`/`listMembers`. Worth
  extracting to a shared helper if a third module needs the same check.
- `mongoose.isValidObjectId(id)` guards are used on every route param before
  querying, to return a clean `400` instead of letting Mongoose throw a
  `CastError` that falls through to a generic `500`.

### Mobile conventions confirmed/established this session
- Every "selector" field (role picker, severity picker) uses plain
  `useState` in the **controller** (not the screen — screens stay pure view
  per `mobileapp/CLAUDE.md`), rendered as a row of bordered `Touchable` chips
  with `colors.primary`/`colors.muted` border+text color swapping. See
  `useRegisterController.js` (role) and `useCreateBugController.js`
  (severity) for the exact pattern to copy for any future selector field.
- `useRoute()` for reading navigation params is always called **inside the
  controller hook**, never in the screen component, for consistency (screens
  only destructure `{ values, functions }` from the controller).
- File uploads from mobile: build a `FormData` in the controller's
  `onSubmit`, append text fields as strings and each picked asset as
  `{ uri, type, name }`, pass as `body` to the RTK Query mutation directly
  (fetchBaseQuery auto-detects `FormData` and skips JSON-stringifying /
  lets `fetch` set the multipart boundary itself — don't manually set
  `Content-Type`).
- `config/env.js` has both `API_BASE_URL` (`.../api` suffix, used by RTK
  Query baseApi/authApi) and `FILE_BASE_URL` (no `/api` suffix, used to
  build absolute URLs for `/uploads/...` attachment paths returned by the
  backend, e.g. in `BugDetail`'s `Linking.openURL` call).
