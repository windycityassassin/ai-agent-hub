/**
 * Demo-mode canned data for the AI Agent Hub.
 *
 * When `import.meta.env.VITE_DEMO_MODE === "true"`, custom-fetch routes all
 * `/api/...` calls through `resolveDemoResponse` below instead of hitting the
 * Express server. The streaming chat endpoint is faked separately in
 * `chat-interface.tsx` (see `streamDemoReply`).
 *
 * Mutations are intentionally non-persistent — refreshing the page resets
 * everything to the seed below, so visitors see the same tour state.
 */

import type {
  AgentStats,
  AnthropicConversation,
  AnthropicConversationWithMessages,
  AnthropicMessage,
  HealthStatus,
} from "./generated/api.schemas";

// ---------------------------------------------------------------------------
// Seed conversations & messages
// ---------------------------------------------------------------------------

const DAY = 86_400_000;
const HOUR = 3_600_000;

const NOW = Date.now();
const iso = (offsetMs: number) => new Date(NOW - offsetMs).toISOString();

interface SeedConversation extends AnthropicConversation {
  messages: AnthropicMessage[];
}

const seedConversations: SeedConversation[] = [
  {
    id: 1,
    title: "Pricing for a 12-person QA team",
    agentType: "marketing",
    createdAt: iso(2 * HOUR),
    messages: [
      {
        id: 101,
        conversationId: 1,
        role: "user",
        content: "We have a 12-person QA team and want to evaluate TestPilot. What does pricing look like at our size?",
        createdAt: iso(2 * HOUR),
      },
      {
        id: 102,
        conversationId: 1,
        role: "assistant",
        content:
          "At 12 seats you sit comfortably in our Team tier ($49 per seat per month). That includes self-healing tests, KAIROS monitoring, project memory across runs, and multi-model assertion consensus. Volume discounts kick in at 25 seats. Want me to share a sample ROI breakdown for a team your size?",
        createdAt: iso(2 * HOUR - 5_000),
      },
      {
        id: 103,
        conversationId: 1,
        role: "user",
        content: "Yes, and tell me how this compares to running Playwright in CI with our own engineers.",
        createdAt: iso(2 * HOUR - 60_000),
      },
      {
        id: 104,
        conversationId: 1,
        role: "assistant",
        content:
          "Quick napkin math for a 12-person team: average engineer fully loaded at $180k. If TestPilot's self-healing tests remove ~6 hours per engineer per week of brittle-test maintenance, that's ~$50k saved per engineer per year vs. ~$7k/year in TestPilot license cost. KAIROS also catches selector drift overnight, so you see failures before the morning standup instead of after.",
        createdAt: iso(2 * HOUR - 65_000),
      },
    ],
  },
  {
    id: 2,
    title: "Selector keeps breaking on /checkout",
    agentType: "support",
    createdAt: iso(5 * HOUR),
    messages: [
      {
        id: 201,
        conversationId: 2,
        role: "user",
        content: "Our checkout test breaks every other deploy. The 'Place order' button selector keeps changing.",
        createdAt: iso(5 * HOUR),
      },
      {
        id: 202,
        conversationId: 2,
        role: "assistant",
        content:
          "Two things worth checking: (1) Are you on the latest self-heal model? Anything before 2026.03 uses brittle xpath fallbacks. (2) For checkout flows specifically, I'd recommend pinning the button by `data-testid` rather than text — promotional copy on that button changes a lot. If you can paste the failing trace ID I can confirm which heuristic our healer used.",
        createdAt: iso(5 * HOUR - 4_000),
      },
      {
        id: 203,
        conversationId: 2,
        role: "user",
        content: "Trace ID is k7f2a8c1. We can't add testid attrs easily, FE team is offshore.",
        createdAt: iso(5 * HOUR - 90_000),
      },
      {
        id: 204,
        conversationId: 2,
        role: "assistant",
        content:
          "Got it. For that trace the healer fell back to nth-of-type which is fragile. Quick fix: in the test, replace the locator with `page.getByRole('button', { name: /place order|complete purchase|pay now/i })`. The regex covers the three variants we've seen on your domain in the last 30 days. Long term I'd still push for data-testid — happy to draft an FE ticket.",
        createdAt: iso(5 * HOUR - 95_000),
      },
    ],
  },
  {
    id: 3,
    title: "Does TestPilot work with Cypress?",
    agentType: "marketing",
    createdAt: iso(1 * DAY),
    messages: [
      {
        id: 301,
        conversationId: 3,
        role: "user",
        content: "We're on Cypress, not Playwright. Does TestPilot still work?",
        createdAt: iso(1 * DAY),
      },
      {
        id: 302,
        conversationId: 3,
        role: "assistant",
        content:
          "Today we generate Playwright tests natively; Cypress support is in private beta (Q3 target). If you're open to it, most teams that migrate find Playwright handles modern SPAs better — and we offer a free migration audit that maps your existing Cypress suite to Playwright equivalents. Want me to set that up?",
        createdAt: iso(1 * DAY - 6_000),
      },
    ],
  },
  {
    id: 4,
    title: "KAIROS keeps flagging /login as flaky",
    agentType: "support",
    createdAt: iso(1 * DAY + 4 * HOUR),
    messages: [
      {
        id: 401,
        conversationId: 4,
        role: "user",
        content: "KAIROS marks our login test flaky 3-4 times a week but the test always passes when we rerun. Annoying.",
        createdAt: iso(1 * DAY + 4 * HOUR),
      },
      {
        id: 402,
        conversationId: 4,
        role: "assistant",
        content:
          "That signature usually means real instability, not noise — typically a 1-2 second auth race condition before the dashboard hydrates. Try adding `await page.waitForResponse(r => r.url().includes('/auth/session') && r.ok())` right after submit. If that doesn't fix it, the next thing to check is whether your auth provider rate-limits parallel requests from CI runners.",
        createdAt: iso(1 * DAY + 4 * HOUR - 8_000),
      },
    ],
  },
  {
    id: 5,
    title: "SOC 2 + data residency",
    agentType: "marketing",
    createdAt: iso(2 * DAY),
    messages: [
      {
        id: 501,
        conversationId: 5,
        role: "user",
        content: "Procurement is asking about SOC 2 and EU data residency.",
        createdAt: iso(2 * DAY),
      },
      {
        id: 502,
        conversationId: 5,
        role: "assistant",
        content:
          "Both covered. SOC 2 Type II report is available under NDA — happy to send a Drata link. EU data residency: dedicated EU tenant in eu-west-1 (Frankfurt). Test artifacts, project memory, and assertion traces stay in-region; LLM calls route to a regional Anthropic endpoint. DPA is signable in DocuSign in under 10 minutes. Want me to introduce you to our security lead?",
        createdAt: iso(2 * DAY - 12_000),
      },
    ],
  },
  {
    id: 6,
    title: "How does the project memory work?",
    agentType: "marketing",
    createdAt: iso(3 * DAY),
    messages: [
      {
        id: 601,
        conversationId: 6,
        role: "user",
        content: "What exactly is 'project memory'? Sounds like a buzzword.",
        createdAt: iso(3 * DAY),
      },
      {
        id: 602,
        conversationId: 6,
        role: "assistant",
        content:
          "Fair pushback. Concretely: every verified selector, every healed locator, every test that passed and why, gets persisted in Postgres tied to your project. Next test generation reads that history, so we don't re-discover that your nav uses `data-cy` while your forms use `aria-label`. After ~50 runs on a project, generation accuracy is measurably higher than fresh-cold-start (we publish the numbers in our docs).",
        createdAt: iso(3 * DAY - 4_000),
      },
    ],
  },
  {
    id: 7,
    title: "Stripe webhook test fails in CI only",
    agentType: "support",
    createdAt: iso(4 * DAY),
    messages: [
      {
        id: 701,
        conversationId: 7,
        role: "user",
        content: "Our Stripe webhook handler test passes locally but fails in GitHub Actions every time.",
        createdAt: iso(4 * DAY),
      },
      {
        id: 702,
        conversationId: 7,
        role: "assistant",
        content:
          "Classic — webhook signature verification needs the raw request body, but supertest or fetch in CI sometimes serializes the body before the verifier sees it. Check that your test sends `Buffer.from(JSON.stringify(payload))` and that your express middleware order has `express.raw({ type: 'application/json' })` mounted BEFORE `express.json()` on the webhook route. Want me to share a working snippet?",
        createdAt: iso(4 * DAY - 7_000),
      },
    ],
  },
  {
    id: 8,
    title: "Trial extension",
    agentType: "marketing",
    createdAt: iso(5 * DAY),
    messages: [
      {
        id: 801,
        conversationId: 8,
        role: "user",
        content: "Our 14-day trial expires Friday but we're mid-evaluation. Can we extend?",
        createdAt: iso(5 * DAY),
      },
      {
        id: 802,
        conversationId: 8,
        role: "assistant",
        content:
          "Yes — happy to push your trial to 30 days, no questions asked. I've flagged your account for the extension; you should see it reflected in the next hour. If you want a 45-minute call with one of our solutions engineers to accelerate the eval, I can also book that. What part of TestPilot do you want to spend most of the extended trial on?",
        createdAt: iso(5 * DAY - 5_000),
      },
    ],
  },
];

export const allConversations: AnthropicConversation[] = seedConversations.map(
  ({ messages: _messages, ...conv }) => conv,
);

export const conversationsByAgent: Record<string, AnthropicConversation[]> = {
  marketing: allConversations.filter((c) => c.agentType === "marketing"),
  support: allConversations.filter((c) => c.agentType === "support"),
};

const messagesById: Record<number, AnthropicMessage[]> = Object.fromEntries(
  seedConversations.map((c) => [c.id, c.messages]),
);

const conversationsById: Record<number, SeedConversation> = Object.fromEntries(
  seedConversations.map((c) => [c.id, c]),
);

const totalMessages = seedConversations.reduce(
  (sum, c) => sum + c.messages.length,
  0,
);

export const agentStats: AgentStats = {
  totalConversations: allConversations.length,
  marketingConversations: conversationsByAgent.marketing.length,
  supportConversations: conversationsByAgent.support.length,
  totalMessages,
};

const healthStatus: HealthStatus = { status: "ok (demo mode)" };

// ---------------------------------------------------------------------------
// In-memory mutation store
// ---------------------------------------------------------------------------
//
// Conversations created during the visitor's session are appended here so
// the conversations browser updates optimistically. We never persist beyond
// the page lifetime — the seed above is the source of truth on every load.

interface InMemoryState {
  extraConversations: SeedConversation[];
  extraMessagesByConversation: Record<number, AnthropicMessage[]>;
  nextConversationId: number;
  nextMessageId: number;
}

const state: InMemoryState = {
  extraConversations: [],
  extraMessagesByConversation: {},
  nextConversationId: 1000,
  nextMessageId: 10000,
};

function allConversationsLive(): SeedConversation[] {
  return [...state.extraConversations, ...seedConversations];
}

function getConversation(id: number): SeedConversation | undefined {
  return conversationsById[id] ?? state.extraConversations.find((c) => c.id === id);
}

function getMessages(id: number): AnthropicMessage[] {
  const base = messagesById[id] ?? [];
  const extra = state.extraMessagesByConversation[id] ?? [];
  return [...base, ...extra];
}

// ---------------------------------------------------------------------------
// URL routing
// ---------------------------------------------------------------------------

const conversationByIdRe = /^\/api\/anthropic\/conversations\/(\d+)$/;
const messagesByIdRe = /^\/api\/anthropic\/conversations\/(\d+)\/messages$/;

export interface DemoResponse {
  status: number;
  body: unknown;
}

export function resolveDemoResponse(
  pathname: string,
  searchParams: URLSearchParams,
  method: string,
  body: unknown,
): DemoResponse | null {
  if (!pathname.startsWith("/api/")) return null;

  if (pathname === "/api/healthz" && method === "GET") {
    return { status: 200, body: healthStatus };
  }

  if (pathname === "/api/agents/stats" && method === "GET") {
    const live = allConversationsLive();
    return {
      status: 200,
      body: {
        totalConversations: live.length,
        marketingConversations: live.filter((c) => c.agentType === "marketing").length,
        supportConversations: live.filter((c) => c.agentType === "support").length,
        totalMessages:
          totalMessages +
          Object.values(state.extraMessagesByConversation).reduce(
            (s, m) => s + m.length,
            0,
          ),
      } as AgentStats,
    };
  }

  if (pathname === "/api/agents/recent-conversations" && method === "GET") {
    const live = allConversationsLive()
      .slice()
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      .slice(0, 10)
      .map(({ messages: _m, ...c }) => c);
    return { status: 200, body: live };
  }

  if (pathname === "/api/anthropic/conversations" && method === "GET") {
    const agentType = searchParams.get("agentType");
    const list = allConversationsLive().map(({ messages: _m, ...c }) => c);
    const filtered = agentType ? list.filter((c) => c.agentType === agentType) : list;
    return { status: 200, body: filtered };
  }

  if (pathname === "/api/anthropic/conversations" && method === "POST") {
    const payload = (body ?? {}) as { title?: string; agentType?: string };
    const created: SeedConversation = {
      id: state.nextConversationId++,
      title: payload.title ?? "New conversation",
      agentType: payload.agentType ?? "marketing",
      createdAt: new Date().toISOString(),
      messages: [],
    };
    state.extraConversations.unshift(created);
    state.extraMessagesByConversation[created.id] = [];
    const { messages: _m, ...returned } = created;
    return { status: 201, body: returned };
  }

  {
    const m = pathname.match(conversationByIdRe);
    if (m) {
      const id = Number(m[1]);
      if (method === "GET") {
        const conv = getConversation(id);
        if (!conv) {
          return { status: 404, body: { error: "Conversation not found" } };
        }
        const result: AnthropicConversationWithMessages = {
          id: conv.id,
          title: conv.title,
          agentType: conv.agentType,
          createdAt: conv.createdAt,
          messages: getMessages(conv.id),
        };
        return { status: 200, body: result };
      }
      if (method === "DELETE") {
        state.extraConversations = state.extraConversations.filter((c) => c.id !== id);
        delete state.extraMessagesByConversation[id];
        return { status: 204, body: null };
      }
    }
  }

  {
    const m = pathname.match(messagesByIdRe);
    if (m) {
      const id = Number(m[1]);
      if (method === "GET") {
        return { status: 200, body: getMessages(id) };
      }
      // POST to /messages is the SSE stream; chat-interface handles that
      // path itself in demo mode, so we just defer.
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Persistence helpers used by the streaming chat path
// ---------------------------------------------------------------------------

export function appendDemoMessage(
  conversationId: number,
  role: "user" | "assistant",
  content: string,
): AnthropicMessage {
  const msg: AnthropicMessage = {
    id: state.nextMessageId++,
    conversationId,
    role,
    content,
    createdAt: new Date().toISOString(),
  };
  state.extraMessagesByConversation[conversationId] = [
    ...(state.extraMessagesByConversation[conversationId] ?? []),
    msg,
  ];
  return msg;
}

// ---------------------------------------------------------------------------
// Canned chat reply generator for the SSE stream
// ---------------------------------------------------------------------------

function pickReply(agentType: string, prompt: string): string {
  const p = prompt.toLowerCase();

  if (agentType === "support") {
    if (/selector|locator|brittle|flaky/.test(p)) {
      return "If a selector is breaking under self-heal, the usual culprits are (1) dynamic ids, (2) text that varies by locale, or (3) nth-of-type fallbacks. Pin to `getByRole` with a regex name, or push the FE team for stable `data-testid` attributes. Drop a trace id and I can confirm which heuristic was used.";
    }
    if (/webhook|stripe|payment|signature/.test(p)) {
      return "Webhook signature verification needs the raw request body. Check that your test sends `Buffer.from(JSON.stringify(payload))` and that `express.raw({ type: 'application/json' })` is mounted before `express.json()` on the webhook route. That fixes ~90% of the CI-only webhook failures I see.";
    }
    if (/timeout|wait|race/.test(p)) {
      return "For timing-related flakes, prefer `waitForResponse` over `waitForTimeout`. Anchor to a real network event (e.g. the session call after login). Polling timeouts hide the underlying race condition rather than fixing it.";
    }
    return "Walk me through what you're seeing — which test, what the failure message is, and whether it reproduces locally. If you have a trace id from a recent run, drop that too; it'll let me see exactly which selector and which model version were used.";
  }

  // marketing
  if (/price|cost|plan|seat|tier|quote/.test(p)) {
    return "Quick pricing snapshot: Solo $19/mo, Team $49/seat/mo (kicks in at 5 seats), Enterprise custom (volume discounts from 25 seats, SOC 2 docs, dedicated SE). All plans include self-healing tests, KAIROS monitoring, project memory, and multi-model assertion consensus. Want me to mock up an annual ROI breakdown for a specific team size?";
  }
  if (/security|soc|gdpr|residency|compliance/.test(p)) {
    return "SOC 2 Type II is in place (Drata link on request, NDA needed). GDPR-compliant by default, EU data residency available via a dedicated Frankfurt tenant. DPA is signable in DocuSign in ~10 minutes. Happy to introduce you to our security lead if procurement wants to dig in further.";
  }
  if (/playwright|cypress|selenium|jest/.test(p)) {
    return "Native support today is Playwright. Cypress is in private beta (Q3 GA target). Selenium imports are read-only — we'll port assertions but new tests get generated in Playwright. We offer a free migration audit that maps an existing suite to Playwright equivalents — usually takes 24 hours.";
  }
  if (/trial|demo|evaluation|free/.test(p)) {
    return "14-day free trial, no card. If you're mid-evaluation when it expires we'll happily extend to 30 days, just ping support. For larger teams (10+ seats) we usually pair the trial with a 45-minute call with a solutions engineer who can scope the rollout. Want me to set that up?";
  }
  return "Happy to help — what part of TestPilot are you evaluating? Most folks come in asking about either self-healing, the KAIROS monitor, or pricing. Tell me which and I'll get into specifics.";
}

export function streamDemoReply(agentType: string, prompt: string): {
  reply: string;
  chunks: string[];
} {
  const reply = pickReply(agentType, prompt);
  // Split into ~12-char chunks so the stream feels like a real LLM stream
  const chunks: string[] = [];
  for (let i = 0; i < reply.length; i += 12) {
    chunks.push(reply.slice(i, i + 12));
  }
  return { reply, chunks };
}

export const DEMO_MODE: boolean =
  typeof import.meta !== "undefined" &&
  // @ts-ignore — import.meta.env is a Vite construct
  import.meta.env?.VITE_DEMO_MODE === "true";
