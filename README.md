# ai-agent-hub

AI Agent Hub for **TestPilot AI**. Two Claude-backed agents (a marketing
sales rep and a 24/7 customer support specialist), a command-center
dashboard with live conversation stats, a full conversation browser, and
streaming chat over Server-Sent Events.

pnpm workspace monorepo, scaffolded on Replit.

**Live demo (frontend only, tour mode):**
https://windycityassassin.github.io/ai-agent-hub/

The live link is the React shell with the API stubbed; the live agents
require running the Express API server with an Anthropic key (see
"Run locally" below).

## Pages

- `/` — Command Center: total conversations, message counts per agent
- `/marketing` — Marketing agent chat
- `/support` — Customer Support agent chat
- `/conversations` — Filterable history with detail view

## Architecture

```
artifacts/
  agent-hub/         # Vite + React + Wouter + TanStack Query frontend
  api-server/        # Express 5 API server
lib/
  api-spec/          # OpenAPI 3.1 spec, Orval codegen config
  api-zod/           # Generated Zod schemas (from OpenAPI)
  api-client-react/  # Generated React Query hooks (from OpenAPI)
  db/                # Drizzle ORM schema + Postgres pool
  integrations-anthropic-ai/  # Claude client + batch utilities
scripts/             # Workspace utility scripts
```

API surface (mounted at `/api`):

- `GET /api/healthz`
- `GET /api/anthropic/conversations` (filter by `agentType`)
- `POST /api/anthropic/conversations`
- `GET /api/anthropic/conversations/:id`
- `DELETE /api/anthropic/conversations/:id`
- `GET /api/anthropic/conversations/:id/messages`
- `POST /api/anthropic/conversations/:id/messages` — SSE streaming reply
- `GET /api/agents/stats`
- `GET /api/agents/recent-conversations`

## Stack

- Node 24, pnpm workspaces, TypeScript 5.9 (composite project refs)
- Express 5, Postgres, Drizzle ORM, `drizzle-zod`
- Anthropic Claude (via Replit AI Integrations: no API key in client)
- Orval for OpenAPI → Zod + React Query codegen
- esbuild for the API server bundle
- Vite + React 18 + Wouter for the frontend
- shadcn-ui + Tailwind + Radix

## Run locally

```bash
pnpm install

# API server (needs DATABASE_URL + Anthropic via Replit env or ANTHROPIC_API_KEY)
pnpm --filter @workspace/api-server run dev

# Frontend (Vite dev server)
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/agent-hub run dev
```

## Build

```bash
# Full monorepo
PORT=3000 BASE_PATH=/ pnpm run build

# Just the frontend, for GitHub Pages subpath
PORT=3000 BASE_PATH=/ai-agent-hub/ pnpm --filter @workspace/agent-hub run build
# Output: artifacts/agent-hub/dist/public/
```

## Codegen and DB

```bash
pnpm --filter @workspace/api-spec run codegen
pnpm --filter @workspace/db run push
```
