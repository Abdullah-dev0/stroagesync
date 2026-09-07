<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Rules

Keep changes simple, focused, and consistent with the existing monorepo. Do not
add abstractions, dependencies, or defensive behavior unless the current task
requires them.

## Styling and UI

- Use Tailwind CSS for styling and follow the existing design tokens in
  `packages/ui/src/styles/globals.css`.
- Reuse components from `packages/ui` before creating app-specific duplicates.
- Keep reusable UI primitives in `packages/ui`; keep feature-specific components
  close to the app or route that uses them.
- Use the existing `cn` utility for conditional class names.
- Build responsive layouts mobile-first and support both light and dark themes.
- Preserve accessible semantics: use native elements where possible, associate
  labels with controls, keep keyboard navigation working, and provide visible
  focus states.
- Use Lucide icons consistently. Do not add another icon library without a clear
  need.
- Avoid inline styles and arbitrary values when an existing utility or design
  token fits.

## TypeScript

- Keep TypeScript strict. Do not weaken compiler options to make code pass.
- Avoid `any`. Use a specific type or `unknown`, then narrow it safely.
- Prefer inferred types when they are clear; add explicit types at public module
  boundaries and where inference is ambiguous.
- Reuse types generated or exported by libraries, schemas, and database models
  instead of maintaining duplicate shapes by hand.
- Use type-only imports when a value import is not required.
- Handle nullable and optional values explicitly. Do not use non-null assertions
  unless the invariant is guaranteed and obvious.
- Keep functions and components small and single-purpose, but do not create an
  abstraction used only once unless it materially improves clarity.
- Do not suppress TypeScript or ESLint errors without explaining why in a nearby
  comment.

## Security

- Treat every client-supplied value as untrusted. Validate request bodies, route
  parameters, query strings, filenames, file metadata, and webhook payloads on
  the server.
- Enforce authentication and resource ownership/permissions on the server for
  every protected operation. UI visibility is not authorization.
- Never expose secrets, database credentials, private storage keys, or internal
  tokens to client code. Read secrets from validated environment variables.
- Never commit `.env` files containing real credentials. Keep only safe example
  values in `.env.example`.
- Scope every file and folder database query to the authenticated user or an
  explicitly authorized share/workspace.
- For uploads, enforce size limits and allowed types server-side, generate safe
  storage keys, and never trust a user-provided path. Do not use the filename as
  a filesystem path.
- Use short-lived signed URLs or an authorized server endpoint for private file
  access. Do not make stored files public by default.
- Store passwords and authentication tokens only through the established auth
  library. Do not implement custom password hashing, session handling, or
  cryptography.
- Use parameterized database queries through Drizzle; never build SQL from raw
  user input.
- Do not log secrets, tokens, passwords, full authentication headers, or private
  file contents. Return safe error messages without leaking stack traces or
  internal details.
- Keep security middleware such as Helmet and the existing CORS policy enabled.
  Any relaxation must be narrow and justified by the task.

## Verification

- Do not automatically run lint, type-check, or build after a task. Ask first,
  unless verification is important because the change is high-risk or cannot be
  checked meaningfully another way.

## Important Rule 

- If you are unsure about a rule, ask for clarification before writing code.
- Do not write business logic; I will write it myself. This is the reason why i am Making this application you are allow to make design decisions.
