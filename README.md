# Storumi

A single Next.js application with Better Auth, Drizzle/PostgreSQL, React Query,
and private R2 storage.

## Development

Run `pnpm install`, copy `.env.example` to `.env.local`, and fill in the
credentials. Run `pnpm dev` from the repository root.

The website and API both use `http://localhost:3000`. Set
`BETTER_AUTH_URL` and `SITE_URL` to the same origin.

## Structure

- `app/`: pages, layouts, Route Handlers, and application entry points.
- `components/features/`: feature-specific UI.
- `components/shared/`: shared application UI.
- `components/ui/`: reusable UI primitives.
- `lib/actions/`: Server Actions for mutations and user-triggered operations.
- `lib/api/`: browser-side API clients used by React Query.
- `lib/data/`: authenticated server-side read helpers.
- `lib/db/`: Drizzle client, schema, storage queries, and R2 client.
- `lib/validations/`: shared Zod schemas.
- `drizzle/`: database migration history.

## Data access

Server-rendered dashboard pages prefetch authenticated data into React Query and
hydrate the browser cache. Client-side refetches use session-authenticated GET
Route Handlers. Mutations use Server Actions.

Current storage read routes include:

- `/api/storage/items`
- `/api/storage/trash`
- `/api/storage/usage`
- `/api/storage/folders/:id`
- `/api/storage/items/:itemId/preview`

Better Auth is mounted at `/api/auth/[...all]`.

Uploads go directly from the browser to R2 using short-lived signed URLs. Keep
the R2 bucket CORS policy configured for the application origin.

## Commands

- `pnpm dev`: local Next.js development.
- `pnpm typecheck`: generate route types and check TypeScript.
- `pnpm lint`: ESLint.
- `pnpm build`: production Next.js build.
- `pnpm start`: serve the Next.js production build.
- `pnpm dev:vinext`: run the app with vinext locally.
- `pnpm build:vinext`: build the Cloudflare/vinext output.
- `pnpm start:vinext`: run the built Worker locally with Wrangler.
- `pnpm deploy:vinext`: deploy the vinext build to Cloudflare Workers.
- `pnpm db:generate`: generate migrations from schema changes.
- `pnpm db:migrate`: apply existing migrations using `.env.local`.
- `pnpm db:studio`: inspect the database.

Run database changes deliberately; they are not part of application startup.

## Components

Run `pnpm dlx shadcn@latest add button` from the root. Import primitives with
`@/components/ui/button`. Design tokens are in `app/globals.css`.

## Deployment

The production target is Cloudflare Workers through vinext. Configure
`DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `SITE_URL`, and
the R2 credentials before deploying.

Run `pnpm build:vinext` before `pnpm deploy:vinext`.
