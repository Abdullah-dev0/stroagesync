# Storumi

A single Next.js application with Better Auth, Drizzle/PostgreSQL, and private R2 storage.

## Development

Run `pnpm install`, copy `.env.example` to `.env.local`, and fill in the credentials.
Run `pnpm dev` from the repository root. The website and API both use
`http://localhost:3000`. Set `BETTER_AUTH_URL` and `SITE_URL` to the same origin.

The migration preserves the database schema and existing migration history.
It does not require resetting the database. Existing users may need to sign in
again when moving from domain cookies to the new host-only cookies.

## Structure

- `app/`: pages, layouts, Server Actions, and Route Handlers.
- `components/ui/`: shared UI primitives.
- `lib/server/`: server-only authentication, storage service, database, and R2.
- `lib/validation/`: shared input and response schemas.
- `db/schema/` and `drizzle/`: database schema and migration history.

## Data access

Server Components call authenticated server-side data functions directly.
Dashboard mutations call Server Actions, which authenticate and validate input
before invoking the existing storage service. Expected errors are returned as
serializable results; unexpected errors use a generic message.

React Query retains the dashboard's client cache and uses session-authenticated
GET handlers for refetches:

- `/api/v1/storage/items`
- `/api/v1/storage/trash`
- `/api/v1/storage/items/:itemId/preview`
- `/api/v1/storage/items/:itemId/download`

These routes currently require a Better Auth session. API-key authentication,
external CRUD access, and Polar billing are future features, not enabled by this
migration. Better Auth is mounted at `/api/auth/[...all]`.

Uploads continue directly from the browser to R2 using short-lived signed URLs.
Keep the R2 bucket's CORS policy configured for the application origin.

## Commands

- `pnpm dev`: local development.
- `pnpm typecheck`: generate route types and check TypeScript.
- `pnpm lint`: ESLint.
- `pnpm build`: production Next.js build.
- `pnpm start`: serve the production build.
- `pnpm db:generate`: generate migrations from schema changes.
- `pnpm db:migrate`: apply existing migrations using `.env.local`.
- `pnpm db:studio`: inspect the database.

Run database changes deliberately; they are not part of application startup.

## Components

Run `pnpm dlx shadcn@latest add button` from the root.
Import primitives with `@/components/ui/button`. Design tokens are in
`app/globals.css`.

## Deployment

This project is a standard Next.js app. Configure your production environment with
`DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `SITE_URL`, and your
object-storage credentials before deploying.

The old Express and web Dockerfiles were removed because they depended on
the removed workspace packages. They remain recoverable through Git history.
