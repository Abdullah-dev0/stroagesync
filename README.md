# StorageSync

StorageSync is a pnpm and Turborepo monorepo containing a Next.js web app,
an Express API, and shared UI packages.

## Getting started

Install dependencies from the repository root:

```bash
pnpm install
```

Copy `apps/server/.env.example` to `apps/server/.env.local` and provide the
required database and authentication values. Then start all applications:

```bash
pnpm dev
```

- Web: `http://localhost:3000`
- API: `http://localhost:4000`

## Database

Generate migrations after changing the Drizzle schema:

```bash
pnpm --filter server db:generate
```

Apply the current schema directly to the configured database:

```bash
pnpm --filter server db:push
```

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button";
```
