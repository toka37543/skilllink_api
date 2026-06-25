# SkillLink API

Backend for **SkillLink**, a freelancing marketplace that connects clients with
freelancers/students. Built with **Express 5**, **MySQL** (via `mysql2`),
**Passport** (JWT auth), and **Joi** (validation).

> New to this codebase? Read [How the code is organised](#how-the-code-is-organised)
> first — it explains the folder layout and the one slightly-magic part
> (automatic route loading).

---

## Quick start

### 1. Prerequisites
- Node.js 18+
- A running MySQL server (8.x recommended)

### 2. Install
```bash
npm install
```

### 3. Configure
Copy `.env.example` to `.env` and fill in your MySQL credentials:
```bash
cp .env.example .env
```
```ini
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=skill_link_db

# The port the API listens on. The frontend and API_Docs.md assume 3003.
PORT=3003
# Used to build absolute URLs for uploaded files and the Swagger "server" entry.
API_URL=http://localhost:3003

JWT_SECRET=change_me
JWT_EXPIRES_IN=1d
```

> **Tip:** if MySQL refuses the connection with `ER_ACCESS_DENIED`, your `root`
> user may use an auth plugin that rejects password login. Create a dedicated
> user instead:
> ```sql
> CREATE USER 'skilllink'@'localhost' IDENTIFIED BY 'skilllink';
> GRANT ALL PRIVILEGES ON skill_link_db.* TO 'skilllink'@'localhost';
> ```
> and set `DB_USER=skilllink` / `DB_PASSWORD=skilllink` in `.env`.

### 4. Create the database schema
Run the migration script (recommended). It is idempotent — safe to run
repeatedly — and self-sufficient: it creates the database, applies the full base
schema from `init.sql` (all base tables), adds any missing columns to existing
tables, and creates the newer feature tables:
```bash
npm run migrate
```

Alternatively, you can apply the raw schema directly:
```bash
mysql -u root -p < init.sql
```

> If a previous `npm run migrate` failed partway through (e.g. with a foreign-key
> error because base tables were missing), just run `npm run migrate` again — it
> now creates the base tables first, so it will complete cleanly.

### 5. Run
```bash
node server.js
# Server is running on http://localhost:3003
```

Interactive API docs (Swagger UI): **http://localhost:3003/docs**
Human-readable docs: [`API_Docs.md`](API_Docs.md)

---

## How the code is organised

```
server.js                  # boots Express and AUTO-LOADS every file in routes/
lib/
  db.js                    # MySQL connection pool (reads .env)
  passport.js              # JWT + login strategies
  helpers.js               # JSON (de)serialisation helpers
  file-upload.js           # hand-rolled multipart parser for profile pictures
  swagger.js               # builds the OpenAPI spec from JSDoc annotations
middleware/
  auth.js                  # requireAuth (valid JWT) + requireRole('user'|'client')
routes/                    # thin route definitions (see auto-loading below)
controllers/               # request handling + validation, one per resource
models/                    # all SQL lives here, one class per table
payments/                  # pluggable payment gateway (mock for now)
docs/                      # Swagger annotations + OpenAPI snapshot
scripts/migrate.js         # idempotent schema migration
```

### Route auto-loading (the one bit of "magic")
`server.js` reads the `routes/` folder on startup:
- A **file** directly in `routes/` (e.g. `routes/chats.js`) is mounted at the
  root — its paths are absolute (`app.get('/chats', ...)`).
- A **folder** in `routes/` (e.g. `routes/user/`) mounts each file inside it
  **under the folder name as a prefix**. So `app.get('/profile', ...)` inside
  `routes/user/profile.js` becomes `GET /user/profile`.

So to add a freelancer endpoint, drop a file in `routes/user/` and define paths
relative to `/user`. No central route registry to update.

### The request → response flow
```
route  →  middleware (auth/role)  →  controller (validate + orchestrate)  →  model (SQL)
```
Controllers never write SQL directly; they call model classes in `models/`.
Models never deal with HTTP; they only run queries and return plain objects.

---

## Endpoints at a glance

| Area | Endpoints |
| --- | --- |
| Auth | `POST /auth/{login,register,forget-password,reset-password}` |
| Freelancer profile | `GET/PUT /user/profile`, `PUT /user/profile-picture`, phone OTP, `GET /user/profiles/:id` |
| Client profile | `GET/PUT /client/profile`, phone OTP |
| Jobs (client) | `POST/GET /client/jobs`, `GET /client/jobs/:id/offers`, `POST /client/offers/:id/accept` |
| Jobs (freelancer) | `GET /user/jobs`, **`GET /user/jobs/:id`**, `POST /user/jobs/:id/offers`, submit/approve completion |
| **Saved jobs** | `GET /user/saved-jobs`, `POST/DELETE /user/jobs/:id/save` (+ `/client/...`) |
| **Reports** | `GET/POST /user/reports` (+ `/client/reports`) |
| **Notifications** | `GET /notifications`, `PUT /notifications/:id/read` |
| Chat | `GET /chats`, tasks, attachments, **`GET/POST /chats/:id/messages`** |
| Payments | `GET /payments/wallet`, `POST /payments/top-up` (mock gateway) |

**Bold** = added recently to back frontend screens that previously used mock data.
Full request/response examples are in [`API_Docs.md`](API_Docs.md).

---

## Payments (mock gateway)

`POST /payments/top-up` runs every charge through `payments/mock-payment-gateway.js`
— **no real money moves**. The mock returns deterministic results so you can demo
both success and failure on purpose. Use these test credit cards:

| Card number          | Result                          |
| -------------------- | ------------------------------- |
| 4242 4242 4242 4242  | approved                        |
| 4000 0000 0000 0002  | declined (`card_declined`)      |
| 4000 0000 0000 9995  | declined (`insufficient_funds`) |
| 4000 0000 0000 0069  | declined (`expired_card`)       |
| (anything failing the Luhn check) | declined (`invalid_card`) |

Non-card methods (`vodafone`, `fawry`, `instapay`) are always approved.

To swap in a real provider later, implement the `PaymentGateway` interface
(`payments/payment-gateway.js`) and return it from `payments/index.js`. Nothing
else in the app changes.

### How money flows (escrow model)
1. A client tops up their **wallet** (`/payments/top-up`).
2. When the client **accepts an offer**, the offer amount is moved from the
   client's `balance` into `held_balance` (held in escrow — see `job_funds`).
3. When **both parties approve completion**, the held funds are released to the
   freelancer's wallet.

---

## Useful commands
```bash
npm run migrate     # create/upgrade the database schema (idempotent)
node server.js      # start the API
```
