# Authentication — Implementation & Review Guide

## Overview

The InsureEnsure app uses **Firebase Authentication** (email/password + Google OAuth) as the identity provider, with a **Firestore profile layer** for extended user data and a **Node/Express backend** that issues HTTP-only session cookies via the **Firebase Admin SDK**. MongoDB is used only for non-auth feature data (recommendations, chat logs, reimbursement audits) and is unrelated to this guide.

The auth system has four independent layers of defense, each described in its own section below:
1. Client-side input validation
2. Client-side brute-force throttling
3. Server-side session cookies with revocation
4. Firestore security rules

---

## Architecture Diagram

```
Browser ── Firebase JS SDK ──► Firebase Auth (Google servers)
   │                                │
   │                                ▼
   │                        ID token (JWT, 1-hour TTL)
   │                                │
   ▼                                ▼
Express API ── verifyIdToken ──► Admin SDK
   │
   ├── createSessionCookie (14-day, HttpOnly, SameSite=Strict)
   ├── Firestore writes (users, sessions, login_attempts)
   └── verifyAuth middleware on all protected routes
```

Every feature API call (`/api/recommendations`, `/api/chatbot`, etc.) flows through `verifyAuth` middleware, which reads the `session` cookie, calls `verifySessionCookie(cookie, true)` (the `true` flag means "check revoked"), and sets `req.uid` on the request. **No route trusts `firebase_uid` from the request body anymore.**

---

## Firestore Data Model

### `users/{uid}` — profile document
| Field | Type | Purpose |
|---|---|---|
| `first_name`, `last_name` | string | From signup form |
| `email` | string (lowercased) | Normalized at signup |
| `contact_number` | string | Stored as `+91XXXXXXXXXX` |
| `dob` | string (YYYY-MM-DD) | Validated (age 1–120, not future) |
| `is_active` | boolean | Soft-delete flag. If `false`, user is signed out on next check. **Client cannot write this.** |
| `is_verified` | boolean | Initialized `false`; email-verification state lives on Firebase Auth's `emailVerified`. |
| `failed_login_attempts` | number | Incremented by server on failed login. **Client cannot write this.** |
| `last_login_at` | Timestamp | Updated by server on successful session creation. |
| `last_password_change` | Timestamp | Set at signup; updated by Change Password flow. |
| `created_at`, `updated_at` | Timestamp | Server-generated. |

### `users/{uid}/sessions/{sessionId}` — multi-device session log
| Field | Purpose |
|---|---|
| `created_at`, `last_seen` | Session lifecycle |
| `user_agent` | Truncated UA string (first 200 chars) |
| `ip_hash` | SHA-256 of IP, first 16 chars (no PII) |
| `is_revoked`, `revoked_at` | Revocation state |

Written only by Admin SDK on session creation; batch-revoked on logout / change-password / delete-account. Client has read-only access.

### `login_attempts/{docId}` — audit log
| Field | Purpose |
|---|---|
| `uid` | Null if email didn't resolve (don't leak existence) |
| `outcome` | `"success"` / `"failed_invalid_token"` / `"failed_wrong_credentials"` / `"failed_user_not_found"` |
| `ip_hash` | Hashed IP |
| `timestamp` | Server time |

Fully server-only. Clients cannot read or write.

---

## Auth Flows

### 1. Sign Up
1. Client validates all 7 fields in [`src/pages/SignUp.jsx`](src/pages/SignUp.jsx) using helpers from [`src/utils/validators.js`](src/utils/validators.js) (`validateName`, `validateEmail`, `isDisposableEmail`, `formatContactWithCountryCode`, `validateDOB`, `validatePassword`).
2. On submit → `createUserWithEmailAndPassword` → `updateProfile({displayName})` → `setDoc(users/{uid})` with all fields including `is_active:true`, `failed_login_attempts:0`.
3. `sendEmailVerification()` fires a verification email.
4. Success banner shown, navigate to `/home`.

### 2. Sign In (email/password)
1. [`src/pages/SignIn.jsx`](src/pages/SignIn.jsx) normalizes email, validates format, and checks client-side throttle (5 attempts / 5 min per email).
2. Calls `login()` in [`src/context/AuthContext.jsx`](src/context/AuthContext.jsx):
   - `signInWithEmailAndPassword`. On failure → POST `/api/auth/login-failed` (unauthenticated; server increments `failed_login_attempts` via Admin SDK lookup).
   - On success → `assertActive()` reads `users/{uid}`; if `is_active === false` signs out and throws `code:"account-disabled"`.
   - POST `/api/auth/session` with the idToken. Server:
     - Verifies the token (rejects if `auth_time > 5 min old`)
     - Issues 14-day HttpOnly session cookie
     - Writes `users/{uid}/sessions` record
     - Writes `login_attempts` success entry
     - Resets `failed_login_attempts:0`, updates `last_login_at`
3. Throttle cleared on success.

### 3. Google Sign-In
Same as #2 but via `signInWithPopup`. On first-time users, an `users/{uid}` doc is upserted from `displayName` / `email`. Existing users go through `assertActive()`.

### 4. Forgot Password
[`src/pages/ForgotPassword.jsx`](src/pages/ForgotPassword.jsx):
- Throttled (3 attempts / 10 min per email).
- `sendPasswordResetEmail` with `continueUrl = origin + "/signin?reset=1"`.
- **Always** displays a generic "If an account with that email exists…" message — no matter the outcome. User enumeration is blocked.
- Reset link lands on `/signin?reset=1`, which shows a green success banner.

### 5. Change Password
[`src/pages/ChangePassword.jsx`](src/pages/ChangePassword.jsx):
- `reauthenticateWithCredential(user, EmailAuthProvider.credential(email, currentPassword))` → `updatePassword(newPassword)`.
- Updates `last_password_change` in Firestore.
- POSTs `/api/auth/revoke` → Admin SDK calls `revokeRefreshTokens` + batch-marks all sessions `is_revoked:true`.
- Signs out locally and redirects to `/signin?reset=1`.

### 6. Resend Verification Email
From [`src/pages/Account.jsx`](src/pages/Account.jsx): `sendEmailVerification(auth.currentUser)` with a throttle of 2 attempts / 5 min.

### 7. Delete Account (soft-delete)
From the Account page's Danger Zone:
- Requires a confirmation step.
- `DELETE /api/auth/account` → Admin SDK sets `is_active:false`, calls `revokeRefreshTokens`, clears the session cookie.
- Client signs out and navigates to `/signin`. User's data is retained but access is blocked permanently.

### 8. Sign Out
`POST /api/auth/logout` → `revokeRefreshTokens` + batch-revoke sessions + clear cookie → `signOut(auth)`.

---

## Security Rules & Controls

### Validation (defense in depth — all client-side)
Located in [`src/utils/validators.js`](src/utils/validators.js):
- **Name**: `/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/` — no digits, no special characters.
- **Email**: regex + `normalizeEmail` (trim + lowercase) + disposable-domain blocklist (11 domains: mailinator, guerrillamail, tempmail, 10minutemail, yopmail, trashmail, fakeinbox, throwawaymail, etc.).
- **Contact**: Strips `+91`/`91` prefix, validates 10-digit Indian mobile format, returns `+91XXXXXXXXXX`.
- **DOB**: parseable, not in the future, age 1–120.
- **Password**: ≥ 8 characters AND at least one letter AND at least one digit.

### Client-side Throttle
[`src/utils/authThrottle.js`](src/utils/authThrottle.js) — sliding-window in-memory limiter:
- Sign In: 5 attempts / 5 min (per normalized email)
- Forgot Password: 3 attempts / 10 min (per email)
- Resend Verification: 2 attempts / 5 min (per uid)

This is UX-level only — it's clearable by reloading. Real protection is Firebase's server-side abuse throttling plus the `/api/auth/login-failed` rate limit (5 calls / 5 min per email) on the server.

### Session Cookies
- 14-day expiry (Firebase Admin SDK maximum; 30-day would require custom JWT).
- `HttpOnly` — JS cannot read the cookie.
- `Secure` in production.
- `SameSite=Strict` — not sent on cross-site requests.
- Revoked via `revokeRefreshTokens(uid)` + `verifySessionCookie(..., true)` on every request.

### `is_active` Enforcement
Three checkpoints:
1. **On login**: `assertActive()` before session cookie is issued.
2. **On Google sign-in**: `assertActive()` if the user doc already exists.
3. **Mid-session**: `onAuthStateChanged` in [`src/context/AuthContext.jsx`](src/context/AuthContext.jsx) re-reads the user doc on each auth state event. If `is_active` flipped to `false`, client signs out immediately.

### Firestore Security Rules
[`firestore.rules`](firestore.rules):
```
match /users/{uid} {
  allow read: if request.auth != null && request.auth.uid == uid;
  allow create: if request.auth != null && request.auth.uid == uid;
  allow update: if request.auth != null
    && request.auth.uid == uid
    && !request.resource.data.diff(resource.data).affectedKeys()
        .hasAny(['is_active', 'failed_login_attempts']);
  allow delete: if false;

  match /sessions/{sessionId} {
    allow read: if request.auth != null && request.auth.uid == uid;
    allow write: if false;
  }
}

match /login_attempts/{docId} {
  allow read, write: if false;
}

match /{document=**} {
  allow read, write: if false;
}
```
Key protections:
- `is_active` and `failed_login_attempts` can only be written by the Admin SDK.
- `sessions` subcollection is owner-readable, server-writeable only.
- `login_attempts` is fully inaccessible to clients.
- All unmatched paths denied by default.

### Backend Authorization
[`server/middleware/verifyAuth.js`](server/middleware/verifyAuth.js):
- Reads `session` cookie.
- Calls `admin.auth().verifySessionCookie(cookie, true)` — the `true` enables revocation checking, so revoked tokens are rejected even before their 14-day expiry.
- Sets `req.uid` on success.
- On failure: clears cookie + 401.

Wired in [`server/index.js`](server/index.js):
- `/api/auth/*` is public (login/logout/session endpoints need to be reachable without a session).
- **All other** `/api/*` routes are wrapped in `verifyAuth`. No route reads `firebase_uid` from the body.

---

## Files Modified / Created

### Frontend
| File | What changed |
|---|---|
| [`src/firebase.js`](src/firebase.js) | Added Firestore export |
| [`src/utils/validators.js`](src/utils/validators.js) | Added name/password/DOB/email/contact helpers |
| [`src/utils/authThrottle.js`](src/utils/authThrottle.js) | **New** — sliding-window throttle |
| [`src/context/AuthContext.jsx`](src/context/AuthContext.jsx) | New signup/login/Google/logout/changePassword/resendVerification/deleteAccount logic; `assertActive`; `accountDisabled` flag |
| [`src/pages/SignUp.jsx`](src/pages/SignUp.jsx) | Full rewrite with per-field validation, 7 fields |
| [`src/pages/SignIn.jsx`](src/pages/SignIn.jsx) | Added throttle, `?reset=1` banner, `account-disabled` handling |
| [`src/pages/ForgotPassword.jsx`](src/pages/ForgotPassword.jsx) | Throttle + always-generic success message + `continueUrl` |
| [`src/pages/ChangePassword.jsx`](src/pages/ChangePassword.jsx) | **New** — reauth + update + revoke |
| [`src/pages/Account.jsx`](src/pages/Account.jsx) | **New** — profile, resend verification, change password, delete account |
| [`src/components/Navbar.jsx`](src/components/Navbar.jsx) | Added Account link + email verification banner |
| [`src/App.jsx`](src/App.jsx) | Added `/account` and `/change-password` protected routes |
| [`src/utils/api.js`](src/utils/api.js), [`chatApi.js`](src/utils/chatApi.js), [`documentChatApi.js`](src/utils/documentChatApi.js), [`reimbursementApi.js`](src/utils/reimbursementApi.js) | Removed `firebaseUid` params, added `credentials:'include'` |

### Backend
| File | What changed |
|---|---|
| [`server/config/firebaseAdmin.js`](server/config/firebaseAdmin.js) | **New** — Admin SDK initializer (base64 or JSON env var) |
| [`server/middleware/verifyAuth.js`](server/middleware/verifyAuth.js) | **New** — session cookie verification |
| [`server/routes/auth.js`](server/routes/auth.js) | **New** — `/session`, `/login-failed`, `/logout`, `/revoke`, `/account` |
| [`server/index.js`](server/index.js) | cookie-parser, CORS with credentials, `verifyAuth` on feature routes |
| [`server/middleware/rateLimiter.js`](server/middleware/rateLimiter.js) | Uses `req.uid` instead of body param |
| [`server/middleware/validateRecommendation.js`](server/middleware/validateRecommendation.js) | Removed `firebase_uid` check |
| [`server/routes/recommendation.js`](server/routes/recommendation.js), [`chatbot.js`](server/routes/chatbot.js), [`documentChat.js`](server/routes/documentChat.js), [`reimbursement.js`](server/routes/reimbursement.js) | All use `req.uid`; history endpoints no longer take `:uid` param |

### Config / Rules
- [`firestore.rules`](firestore.rules) — **New**, deployed to `insureensure-11f33`
- [`firebase.json`](firebase.json) — **New**, points the CLI at the rules file
- [`.firebaserc`](.firebaserc) — **New**, names the default project

---

## Deployment Checklist

Before running the app in any new environment:

1. **Service account key** — Firebase Console → Project Settings → Service Accounts → Generate new private key. Base64 encode it (`base64 -i serviceAccountKey.json | tr -d '\n'`) and store in `server/.env` as `FIREBASE_SERVICE_ACCOUNT_BASE64`.
2. **Firestore rules** — deploy via `npx firebase-tools deploy --only firestore:rules`.
3. **MongoDB Atlas** — whitelist the server's IP in Network Access.
4. **Frontend `.env`** — `VITE_FIREBASE_*` keys (already documented in `CLAUDE.md`).
5. **`ALLOWED_ORIGINS`** — set in `server/.env` for production (comma-separated list). Defaults to localhost.

---

## Pending Features

These were in the original spec but are **not yet implemented**. Items that Firebase already covers internally (password hashing, reset-token TTL, token rotation, CAPTCHA-equivalent abuse throttling, custom JWT) are excluded per request.

### 1. `is_verified` Firestore sync
When a user clicks the verification link, Firebase Auth sets `user.emailVerified = true`, but the Firestore `users/{uid}.is_verified` field stays `false` forever. The field is currently unused anywhere in the app, but any future server-side logic checking it would be wrong.
**Fix**: in `/api/auth/session`, read `decoded.email_verified` and update the Firestore doc. Roughly 3 lines in [`server/routes/auth.js`](server/routes/auth.js).

### 2. Multi-device sessions UI
The backend already writes every session to `users/{uid}/sessions` with UA, IP hash, and revocation state. There is no UI yet. The Account page should show a "Active sessions" table with a "Sign out this device" button per row, plus a "Sign out everywhere" button.
**Fix**: new `<Sessions />` component on the Account page. Reads from Firestore directly (rules already allow owner-read). New `POST /api/auth/revoke-session` endpoint taking `sessionId` → revokes just that session.

### 3. Signup email-existence leak
When a user tries to sign up with an existing email, Firebase returns `auth/email-already-in-use` and the current SignUp page surfaces it. This reveals whether an address is registered.
**Fix**: in [`src/pages/SignUp.jsx`](src/pages/SignUp.jsx), catch that specific error code and display the same success message as a valid signup ("Verification email sent — check your inbox"). Silently swallow the error. The legitimate user gets a password reset flow; the attacker learns nothing.

### 4. 30-day session duration
The original spec asked for 30-day sessions. Firebase Admin SDK's `createSessionCookie` has a **hard 14-day maximum**. The only way to exceed this is to abandon Firebase sessions and issue custom JWTs yourself, which would mean reimplementing revocation, refresh, and security from scratch.
**Recommendation**: accept 14 days or flag this tradeoff for product discussion.

---

## Known Limitations / Caveats for Reviewers

- **Client-side throttle resets on reload.** Firebase's server-side abuse throttling is the authoritative barrier; the client throttle is UX polish.
- **`ip_hash` is session-scoped, not deterministic across visits** — it's a SHA-256 prefix of `req.ip`. Don't use it for long-term user tracking.
- **`login_attempts` grows unbounded.** If the app scales, add a TTL or periodic cleanup (either Cloud Function scheduled or manual).
- **Google users see no Change Password option**, and bypass the email verification banner — the UI checks `providerData` for `google.com`.
- **Soft-delete is one-way from the UI.** Reactivating a deleted account requires flipping `is_active:true` directly in Firestore (or via a future admin tool).
