# CLAUDE.md — Backend Defaults

Personal default conventions for a fresh Node/Express/MongoDB backend, scaffolded from scratch. Derived from 4 shipped projects.

## Folder Structure

```
src/
  config/          # db.js (Mongo connection), logger.js (Winston setup) — loads env vars, never holds raw secrets
  controllers/     # <domain>.controller.js — business logic lives here, no separate services/ layer
  middleware/      # auth.middleware.js, validator.js, error.js, requestlog.js, upload.middleware.js
  models/          # <domain>.model.js
  routes/          # <domain>.route.js, index.js (aggregates all sub-routers)
  helpers/         # service-layer duty: mail.js, token.js, encryption.js, pagination.js, external API integrations
  utils/
    index.js       # shared constants/enums (ROLES, STATUS types, etc.) and small pure helpers
.env               # gitignored — actual secrets
.env.example        # checked in — placeholder keys, documents what vars exist
app.js             # express app, middleware stack, mounts routes/index.js
server.js          # http server bootstrap
```

Flat and single-level — no nested domain folders. `helpers/` does the work a `services/` folder would in other codebases; don't introduce a separate `services/` directory unless it's going to hold more than one file.

## Coding Patterns

**Naming**
- Files: `<domain>.<layer>.js` (`user.controller.js`, `bet.model.js`, `auth.middleware.js`).
- Folders: flat, lowercase, plural (`controllers`, `models`, `routes`, `middleware`, `helpers`, `config`, `utils`).
- DB fields, JSON payload keys, and local variables: `snake_case` (`date_of_birth`, `updated_fields`, `device_ids`).
- Functions and exports: `camelCase`. Constants/enums: `UPPER_SNAKE_CASE` (`ROLES.ADMIN`, `BET_STATUS.PENDING`).
- Mongoose's own `createdAt`/`updatedAt`/`_id` stay camelCase — that's a framework artifact, not an exception to snake_case.

**Response shape**
- Success: `{ success: true, message: '...', data: ... }`
- Handled failure: `{ success: false, message: '...' }`
- Validation failure: `{ success: false, message: 'Validation failed', errors: [...] }`
- Paginated lists: spread a `buildPaginationResponse(...)` helper into the envelope so it becomes `{ success, message, data, pagination }`.
- Always include the `message` key, even on hot-path/dashboard-style endpoints where you want a lighter payload — use `message: ''` there instead of omitting the key. Frontend code that reads `response.message` should never get `undefined`.

**Error handling**
- Every controller function: try/catch, `logger.error(...)` in the catch, then `next(error)`.
- Expected/handled failures (not-found, bad input) respond directly with `res.status(...).json({ success: false, message })` — don't throw for these.
- One centralized `errorHandler` middleware formats the final error response and is mounted **last** in `app.js`, after the 404 handler.

**Logging**
- Winston only. `logger.info` / `logger.warn` / `logger.error` — never `console.log`/`console.error` in application code.
- Catch-block convention: `logger.error(\`<Action> Error: ${error.message}\`)`.
- HTTP request logging goes through Morgan piped into `logger.http`.

**Auth**
- `AuthVerifier` / `OptionalAuthVerifier` middleware decodes the JWT and attaches it as `req.decoded`.
- Controllers read `decoded.id` / `decoded.role` directly — don't re-verify or re-decode inside a controller.
- Role checks are inline in the controller (`if (decoded.role !== ROLES.ADMIN)`) — there is no dedicated RBAC middleware layer. This is a known gap, not a deliberate design win; worth a real gate if the app grows more roles.

**Mongoose / DB**
- Default to `findByIdAndUpdate`/`findOneAndUpdate` with `{ new: true, runValidators: true }`. Use fetch-then-`.save()` only when (a) a `pre('save')` hook must fire (e.g. password hashing on `User`), or (b) you need the document's current field value to compute the new one before persisting (e.g. balance math inside a transaction).
- Always declare indexes explicitly via `schema.index(...)` — including for simple uniqueness (`schema.index({ email: 1 }, { unique: true })` instead of inline `unique: true` on the field). Keeps every index for a model visible in one place and composes with compound/sparse/TTL indexes later.
- Use `.lean({ virtuals: true })` for anything returned straight to the client, paired with the `mongoose-lean-virtuals` plugin registered on that schema. Use plain `.lean()` (no virtuals) when the doc is only for internal computation.
- Default to `ObjectId` + `ref` per parent type for cross-document relations, in separate collections. Use `refPath` polymorphic refs only when the exact same schema is genuinely shared across 2+ parent types with identical structure (e.g. one `Comment` collection attached to both `Media` and `Milestone`) — don't reach for it preemptively.
- Reach for an aggregation pipeline (`$lookup`/`$group`) only when `.populate()` can't express the join.

**Validation**
- Joi only. All schemas centralized in one `helpers/validators.js` file — don't scatter schemas per-controller or create a `validators/` folder per domain.
- Enforced by a shared `middleware/validator.js` mounted at the route layer, before the controller. Controllers never call Joi directly.
- Every field gets a custom `.messages()` override for user-facing error text, always ending in a period.

**Middleware stack**
- Global order in `app.js`: `helmet` → `cors` → `express.json` → `express.urlencoded` → `requestLogger` (Morgan → Winston) → static file serving → mounted API routes → 404 handler → `errorHandler` (last).
- If you add a webhook endpoint that needs the raw body (e.g. Stripe signature verification), mount it with `express.raw(...)` *before* `express.json()`.
- Per-route order: `AuthVerifier`/`OptionalAuthVerifier` → `upload(...)` (if file upload) → `validator(schema)` → controller.

**Secrets — hard rule, not a preference**
- Never commit a file containing real credentials (service-account JSON, API keys, private keys) — not even into `config/`. Env vars only, loaded from a gitignored `.env`.
- Check in a `.env.example` alongside it with placeholder values, documenting every var the app expects.

## Situational Patterns

Not always-true rules — apply when the situation actually calls for it.

- **Multi-document financial writes**: when a single logical operation touches
  balance fields, payment records, or ledger entries across more than one
  document, wrap the writes in a Mongoose transaction. Use this exact shape —
  `finally` guarantees `endSession()` runs on every exit path, including
  early returns inside the try block:

```js
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // all writes here must pass { session }
    await Account.updateOne({ _id }, { $inc: { balance: -amount } }, { session });
    await Ledger.create([{ account: _id, amount, type: 'debit' }], { session });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    logger.error(`Transaction Error: ${error.message}`);
    return next(error);
  } finally {
    session.endSession();
  }
```

  Confirmed in BetItUp for balance updates and payment records. Not yet
  needed elsewhere — apply if a new project introduces similar money flows,
  but don't reach for a transaction for single-document writes; Mongoose's
  default write is already atomic at the document level.

## How to Write New Code

When adding a new resource:
1. Create the model in `models/<name>.model.js` — snake_case fields, ObjectId+ref for relations, explicit `schema.index(...)` for anything queried or unique, register `mongoose-lean-virtuals` if it'll ever be read with `.lean({ virtuals: true })`.
2. Create the Joi schema(s) in `helpers/validators.js`, with `.messages()` (period-terminated) on every field.
3. Create the controller in `controllers/<name>.controller.js`: try/catch, `logger.error` + `next(error)` on failure, direct `res.status().json()` for expected/handled failures, response envelope `{ success, message, data }`.
4. Wire the route in `routes/<name>.route.js`: `AuthVerifier` (if needed) → `upload(...)` (if file) → `validator(schema)` → controller. Mount it in `routes/index.js`.
5. If it's a list endpoint, use `buildPaginationResponse(...)` spread into the response.

## Open Decisions

None currently — all cross-project inconsistencies found during the audit were resolved into the rules above.
