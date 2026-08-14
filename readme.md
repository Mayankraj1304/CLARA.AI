# PERPLEXITY

A simple Node.js backend for the PERPLEXITY project. This repository contains the server, models, controllers, routes, and basic services used during development.

**Project Overview**

- **Purpose:** Backend API for authentication, messaging, and chat models.
- **Stack:** Node.js, Express, (MongoDB or other DB configured in `src/config`), plain JavaScript.

**Repository Structure**

- **Backend/**: Main server code and source files.
  - `server.js` — server entry point.
  - `src/app.js` — Express app setup.
  - `src/config/` — configuration (database connections, env handling).
  - `src/controllers/` — request handlers (`auth.controller.js`).
  - `src/middleware/` — middleware functions (`auth.middleware.js`).
  - `src/models/` — data models (`user.model.js`, `chat.model.js`, `message.model.js`).
  - `src/routes/` — route definitions (`auth.routes.js`).
  - `src/services/` — helper services (`mail.service.js`).
  - `src/validators/` — request validators (`auth.validator.js`).

**Quick Start**

1. Install Node.js (v16+ recommended) and npm.
2. From the project root, navigate to the backend folder:

```bash
cd Backend
npm install
```

3. Provide environment variables (create a `.env` file in `Backend/`):

- `PORT` — port for the server (default: `3000`)
- `DATABASE_URL` — database connection string
- `JWT_SECRET` — secret for signing JWTs
- `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS` — optional mail settings

4. Start the server:

```bash
npm run dev
```

**API Notes**

- Authentication routes are in `src/routes/auth.routes.js` and handled by `src/controllers/auth.controller.js`.
- Typical endpoints (examples — confirm actual paths in `auth.routes.js`):
  - `POST /api/auth/register` — register a new user
  - `POST /api/auth/login` — authenticate and receive a token

**Development**

- Use `nodemon` for auto-reloading during development: `npm install -D nodemon` and add a `dev` script in `Backend/package.json`.
- Keep environment secrets out of source control. Add `Backend/.env` to `.gitignore`.

**Contributing**

- Open an issue or submit a pull request. Describe changes and add tests where appropriate.

