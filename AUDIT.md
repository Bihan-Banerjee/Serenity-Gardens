# Serenity Gardens — Codebase Audit

**Date:** 2026-09-06 · **Branch:** `master` @ `b720dfb` · **Status:** live in production
(client: Vercel · server: Render · DB: MongoDB Atlas)

Scope: `server/` (Express 5 + Mongoose), `client/` (React 19 + Vite + TS), `scripts/`.
No code was changed as part of this audit.

---

## Executive summary

Three issues need action before anything else:

1. **Order totals are set by the browser.** A customer can pay ₹1 for a ₹10,000 order. Live now on a `rzp_live_` key.
2. **Every logged-in customer can read every order**, including all other customers' names and email addresses.
3. **Cash-on-Delivery checkout is broken** — the endpoint is admin-only, so every customer COD attempt returns 403.

Good news, verified: no secrets in git history; no privilege-escalation path (`isAdmin` is never settable from user input); no XSS sinks (`dangerouslySetInnerHTML` unused); build output and `export.md` are untracked.

---

## P0 — Critical

### P0-1 · Payment amount is client-controlled (financial loss)
`server/routes/orderRoutes.js:130` and `:157`

Two independent trust failures in the same flow:

- `POST /create-razorpay-order` takes `amount` straight from the request body. The server never looks up what the cart is actually worth.
- `POST /verify-payment` recomputes `totalAmount` from `items[].price` — **also** supplied by the client.

The HMAC signature check at `:168` is correct, but it only proves *this payment matches this Razorpay order*. It says nothing about whether the Razorpay order was created for the right amount. An attacker calls `create-razorpay-order` with `amount: 100` (₹1), pays it legitimately, then posts `verify-payment` with the real cart. Signature passes. Order is recorded `paid: true` at whatever `totalAmount` they chose.

`client/src/pages/Payment.tsx:49` shows the intended flow (`total * 100`), but nothing on the server enforces it.

**Fix:** Server-side price authority. On `create-razorpay-order`, accept only `[{itemId, quantity}]`, load each `Item` from Mongo, compute the amount from `Item.price`, and store the resulting `razorpay_order_id` → expected-amount mapping (a `PendingOrder` collection, or Razorpay's `notes` field). On `verify-payment`, after the signature check, re-fetch the Razorpay order and assert `order.amount === expectedAmount` and `order.status === 'paid'`. Never read `price` from the request body.

### P0-2 · Any authenticated user can read all orders (PII exposure)
`server/routes/orderRoutes.js:90`

```js
router.get("/", protect, async (req, res) => {
  const orders = await Order.find().populate("userId", "name email");
```

`protect` only checks that the JWT is valid — it does not check `isAdmin`. Every other route in this file that returns cross-user data uses `protect, adminProtect`. This one was missed. Any customer who registers can `GET /api/orders` and receive every order ever placed, with each customer's name and email joined in.

**Fix:** add `adminProtect`. One-word change; `client/src/components/admin/OrderManager.tsx:42` is the only caller and already sends an admin token, so nothing else breaks.

### P0-3 · Cash-on-Delivery is broken in production
`server/routes/orderRoutes.js:18` vs `client/src/pages/Payment.tsx:25`

`POST /api/orders` is guarded `protect, adminProtect`. `handleCOD` calls exactly that endpoint with a regular customer token. Every customer who clicks "Cash on Delivery" gets a 403 and the toast "Failed to place COD order." This is a live revenue leak — half the checkout options do not work.

Introduced by commit `6231995` ("conflicting auth middleware remmoved"), which appears to have applied `adminProtect` more broadly than intended.

**Fix:** drop `adminProtect` from this route (keep `protect`), and — critically — recompute `totalAmount` server-side from the DB here too, since it has the same P0-1 flaw. Note this route also trusts the `paid` flag from the body; force `paid: false` for the COD path.

---

## P1 — High

### P1-4 · No replay or duplicate-payment guard
`orderRoutes.js:157` — nothing records that a `razorpay_order_id` has already been redeemed. The same valid `{order_id, payment_id, signature}` triple can be POSTed repeatedly, creating unlimited orders and decrementing stock each time. **Fix:** unique index on `razorpayPaymentId`; reject if an order already exists for that payment.

### P1-5 · No rate limiting anywhere
No `express-rate-limit`, no lockout, no CAPTCHA. `POST /api/auth/login` accepts unlimited password guesses; `/register` accepts unlimited account creation; `/create-razorpay-order` can be spammed against your Razorpay quota. **Fix:** `express-rate-limit` globally (~100/15min/IP) with a tighter bucket on `/api/auth/*` (~10/15min) and the payment routes.

### P1-6 · Overselling — stock is never validated and decremented non-atomically
`orderRoutes.js:47`, `:73`, `:190` all do read-modify-write:
```js
product.stock = Math.max(0, product.stock - orderItem.quantity);
await product.save();
```
Two concurrent orders read the same `stock` and both write back the same decrement — one sale vanishes. Worse, **no route checks stock is available before accepting payment**, so you can sell 50 of an item with 3 in stock and take the money. `Math.max(0, …)` silently hides the negative rather than failing.

The client is no safeguard either: `MenuPage.tsx:110` checks stock on *add*, but the `+` button in `CartSidebar.tsx:79` has no cap at all.

**Fix:** atomic conditional update — `Item.findOneAndUpdate({_id, stock: {$gte: qty}}, {$inc: {stock: -qty}})` — and fail the order if it returns null. Validate availability *before* creating the Razorpay order.

### P1-7 · Unbounded file upload (DoS)
`itemRoutes.js:10` — `multer({ storage: memoryStorage() })` with **no `limits` and no `fileFilter`**. The `express.json({limit:'10mb'})` cap does not apply to `multipart/form-data`. A single large upload buffers entirely into RAM on a 512 MB Render instance. Admin-only, but a stolen admin token or a mistake takes the API down. **Fix:** `limits: { fileSize: 5*1024*1024, files: 1 }` plus a `fileFilter` restricted to `image/*`.

### P1-8 · Dependency vulnerabilities — 1 critical, 9 high (server)
`npm audit --omit=dev` on `server/`: **15 total (1 critical, 9 high, 3 moderate, 2 low)**. Client: 25 total (2 critical, 16 high).

Most consequential:
| Package | Severity | Why it matters here |
|---|---|---|
| `jws` 3.2.2 (via `jsonwebtoken` 9.0.2) | high | Improper HMAC signature verification — your entire auth model rests on this |
| `mongoose` 8.13.3 | high | Improper `$nor` sanitization → NoSQL injection; prototype pollution in update casting |
| `multer` 2.0.1 | high | Six separate DoS advisories — compounds P1-7 |
| `form-data` | **critical** | Unsafe random boundary; CRLF injection |
| `sharp` 0.34.2 | high | Inherited libvips CVEs, reached by every admin image upload |
| `path-to-regexp` | high | ReDoS in Express routing |

All are `fixAvailable` and non-major except `nodemailer` (→10.0.0) and `sharp` (→0.35.4). Both `nodemailer` and `axios` are **not imported anywhere on the server** — deleting them removes a large share of the surface for free.

### P1-9 · `server/config/db.js` cannot execute
Mixes `const mongoose = require('mongoose')` with `import dotenv from "dotenv"` in a `"type": "module"` package. It would throw `ReferenceError: require is not defined` on import. It survives only because nothing imports it — `server.js:38` connects inline. Dead, broken code that will detonate the moment someone wires it up. **Fix:** delete it, or convert fully to ESM.

---

## P2 — Medium

**P2-10 · No security headers, no error handler, no 404.** No `helmet`. No `app.use((err,req,res,next)=>…)`, so the CORS rejection thrown at `server.js:29` falls through to Express's default handler and returns an HTML stack-trace-shaped 500 instead of JSON. No 404 handler. **Fix:** add `helmet()`, a JSON 404, and a terminal error handler that logs server-side and returns a generic message.

**P2-11 · Internal error messages leaked to clients.** `auth.js:27`/`:47` and `itemRoutes.js:115`/`:124` return `err.message` verbatim — that surfaces Mongo index names, cast errors, and schema paths. Notably, a duplicate-email race returns the raw E11000 index error.

**P2-12 · `protect` calls `next()` inside its own `try`.** `middleware/auth.js:17` — any synchronous throw from a downstream handler is caught by the JWT `catch` and misreported as `401 Not authorized, token failed`, potentially after the response was already sent. **Fix:** move `next()` out of the `try`.

**P2-13 · JWT handling.** 7-day expiry, stored in `localStorage`, no refresh, no revocation, no logout-server-side. A stolen token is valid for a week with no way to kill it. `isAdmin` is baked into the token, so revoking admin in the DB does nothing until expiry.

**P2-14 · NoSQL injection surface on login.** `auth.js:36` passes the raw body value into `User.findOne({ email })`. Not an auth bypass on its own (bcrypt still has to match), but combined with the `mongoose` advisory in P1-8 it should not stand. **Fix:** validate/coerce all inputs — `zod` or `express-mongo-sanitize`.

**P2-15 · `VITE_API_BASE_URL` is defined but never used.** All 18 API call sites hardcode `https://serenity-gardens.onrender.com`. Both `.env.development` and `.env.production` are dead files. **Consequence: running the app locally reads and writes the live production database.** This is the single most likely way this audit's other findings turn into a real incident. **Fix:** one `src/lib/api.ts` axios instance on `import.meta.env.VITE_API_BASE_URL`; replace all 18 call sites.

**P2-16 · Timing-unsafe signature comparison.** `orderRoutes.js:172` uses `!==` on the HMAC. Use `crypto.timingSafeEqual`.

**P2-17 · Duplicated and misordered middleware.** `server.js:17-18` and `:39-40` register `express.json` and `express.urlencoded` twice each — every request is parsed twice. Body parsing also runs *before* CORS, so bodies from disallowed origins are parsed before rejection.

**P2-18 · `PORT` is hardcoded.** `server.js:14` — `const PORT = 5000` ignores `process.env.PORT`. It works on Render today via port detection, but it is fragile and will break on most other hosts. **Fix:** `process.env.PORT || 5000`.

**P2-19 · Mongo connection failure is swallowed.** `server.js:43` — `.catch(err => console.error(err))` logs and exits the promise chain; `app.listen` never runs and the process lingers with no server and no non-zero exit, so the platform never restarts it. **Fix:** `process.exit(1)` in the catch.

---

## P3 — Low / quality

- **P3-20 · Cart is not persisted.** `useCartStore.tsx` uses plain zustand with no `persist`. A refresh on `/payment` empties the cart → `total` becomes 0 → a ₹0 Razorpay order. **Fix:** `persist` middleware on `sessionStorage`.
- **P3-21 · Review submissions go nowhere.** `POST /api/reviews/submit` writes to Mongo, but there is **no GET route** and `Reviews.tsx` renders a hardcoded array. Every customer review ever submitted is invisible. Either build the read path or remove the form.
- **P3-22 · `reviewRoutes.js` has its own duplicate auth middleware** (`:10`) instead of importing `protect`. Same logic, second copy to keep in sync.
- **P3-23 · Admin page crashes on legacy orders.** `OrderManager.tsx:~110` calls `order.totalAmount.toFixed(2)`, but `totalAmount` is not `required` in the schema. One order without it throws and blanks the whole dashboard.
- **P3-24 · Register redirects to `/login` after storing a token** (`Register.tsx:38`) — the user is already authenticated. Should go to `/menu`.
- **P3-25 · `prompt()` for quantity.** `MenuPage.tsx:106` — blocking, unstyled, poor on mobile, blocked in some embedded contexts.
- **P3-26 · Hardcoded Razorpay prefill.** `Payment.tsx:81-85` sends `"Test User" / test@example.com / 9999999999` to a **live** payment gateway. Use the real user's details or omit the block.
- **P3-27 · Unused dependencies.** `nodemailer`, `axios` (server-side), and `crypto@1.0.1` — the last is a deprecated npm shim that shadows Node's builtin and should be removed outright.
- **P3-28 · `client/.env.*` is not gitignored.** Root `.gitignore` has `.env`, which does not match `.env.production` / `.env.development`. They are untracked today; one `git add .` commits them. Add `.env*` (with `!.env.example`).
- **P3-29 · Duplicate credentials.** Root `.env` duplicates the three Cloudinary values already in `server/.env`. Two copies to rotate.
- **P3-30 · `useLoader` leaks.** `hooks/useLoader.ts:20` — `setTimeout` is never cleared; unmounting mid-load sets state on a dead component.
- **P3-31 · Missing `useEffect` deps.** `App.tsx:48`, `MenuPage.tsx:52`, `MyProfile.tsx:49` all use `[]` with values captured from scope.
- **P3-32 · Catalogue requires login.** `GET /api/items` is behind `protect`, so nobody can browse products without an account. Likely deliberate, but it is a hard conversion barrier worth revisiting.
- **P3-33 · No tests, no CI, no error monitoring.** `npm test` exits 1. Nothing catches any of the above before deploy.

---

## Mitigation plan

Ordered so that nothing ships without a safe rollback, given the site is live.

### Phase 0 — Prerequisites (before touching code)
1. **Take a MongoDB Atlas snapshot.** Every later phase touches order/stock data.
2. **Reconcile now.** Query orders where `totalAmount` does not match the sum of `items[].price * quantity`, and cross-check against the Razorpay dashboard. P0-1 has been live — you need to know whether it was exploited before you close it.
3. **Fix P2-15 first** (`VITE_API_BASE_URL`) so you can test everything else against a staging DB instead of production. Nothing below should be verified against live data.
4. Stand up a staging Render service + a copy Atlas cluster pointed at Razorpay **test** keys.

### Phase 1 — Emergency (same day, low risk, high value)
Each is small and independently revertible:

| Fix | File | Risk |
|---|---|---|
| P0-2 — add `adminProtect` to `GET /api/orders` | `orderRoutes.js:90` | None — only caller is the admin dashboard |
| P0-3 — remove `adminProtect` from `POST /api/orders` | `orderRoutes.js:18` | None — restores intended behaviour |
| P2-18 — `process.env.PORT \|\| 5000` | `server.js:14` | None |
| P2-19 — `process.exit(1)` on Mongo failure | `server.js:43` | None |
| P1-7 — multer `limits` + `fileFilter` | `itemRoutes.js:10` | Low — test one admin image upload |
| P3-26 — remove the test-user prefill | `Payment.tsx:81` | None |

Deploy these together, verify a real COD order end to end, then continue.

### Phase 2 — Payment integrity (this week — the actual fix for P0-1)
Do this on staging with Razorpay test keys, as one reviewed change:

1. New `PendingOrder` model: `{ razorpayOrderId, userId, items:[{itemId, quantity}], expectedAmount, createdAt }` with a TTL index.
2. Rewrite `create-razorpay-order`: accept only `[{itemId, quantity}]` → load Items → verify stock → compute amount from `Item.price` → create the Razorpay order → persist the `PendingOrder`.
3. Rewrite `verify-payment`: verify signature with `timingSafeEqual` (P2-16) → look up the `PendingOrder` → **re-fetch the order from Razorpay's API and assert `amount` and `status`** → check `razorpayPaymentId` is unused (P1-4) → decrement stock atomically (P1-6) → create the Order from *server-side* prices.
4. Apply the same server-side pricing to the COD route.
5. Update `Payment.tsx` to send `[{itemId, quantity}]` instead of full cart objects with prices.
6. Add the unique index on `razorpayPaymentId` and a `required: true` on `totalAmount` (backfill legacy orders first — see P3-23).

Ship client and server together; the request shape changes.

### Phase 3 — Hardening (next sprint)
- `helmet`, `express-rate-limit`, global error handler + JSON 404 (P2-10, P1-5).
- `zod` validation on every route body; stop returning `err.message` (P2-11, P2-14).
- Fix `protect`'s `next()`-in-`try` (P2-12).
- De-duplicate middleware and move `cors()` above the body parsers (P2-17).
- Delete `server/config/db.js` (P1-9); drop `nodemailer`, `axios`, `crypto` (P3-27).
- Consolidate `reviewRoutes` onto `protect` (P3-22).

### Phase 4 — Dependencies (needs a staging soak)
- `npm audit fix` on the server first — everything except `nodemailer` and `sharp` is non-major.
- `sharp` 0.34→0.35 is a major bump: test admin image upload specifically.
- Drop `nodemailer` entirely rather than upgrading it (unused).
- Then the client. **Do not run `npm audit fix --force`** on either — it will pull breaking majors across React/Vite.

### Phase 5 — Product & resilience
- Cart persistence (P3-20), reviews read path (P3-21), replace `prompt()` (P3-25).
- `.gitignore` `.env*` and rotate the duplicated Cloudinary keys (P3-28, P3-29).
- Consider shorter JWT expiry + refresh tokens (P2-13).
- Add a `/health` endpoint, error monitoring (Sentry), and a minimal test suite over the payment path (P3-33).

---

## What I checked and found clean

- **No secrets in git history** — `git log -S` across all branches for `JWT_SECRET`, `MONGO_URI`, `api_secret`, `rzp_live` found only variable names in source, never values. `.env` and `server/.env` are correctly ignored.
- **No privilege escalation** — `register` explicitly picks `{name, email, password}`, so `isAdmin` cannot be mass-assigned, and no route ever writes it.
- **No XSS sinks** — `dangerouslySetInnerHTML` appears nowhere; React escapes all rendered review/product text.
- **Password handling is correct** — bcrypt with a generated salt, cost 10; login returns an identical message for unknown-email and wrong-password, so there is no user-enumeration oracle.
- **Build output is untracked** — `client/dist/` and the 25 MB `export.md` are not in git.
- **The Razorpay key in `Payment.tsx:60` is a key *ID*, not a secret** — public by design. Worth moving to an env var for consistency, but it is not a leak.
- **CORS allowlist is correctly restrictive** — no wildcard, `credentials: true` paired with an explicit origin list.
