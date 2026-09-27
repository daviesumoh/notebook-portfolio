// DaveAI's tool catalog: the single source of truth for everything the assistant can
// navigate to, highlight, open, or link to in the portfolio.
//
// - The server (app/api/chat) turns this catalog into a strict JSON schema, so the model can only
//   emit IDs that really exist (no more free-text keywords that highlight the wrong thing).
// - The client (components/journal) resolves each ID to real UI behavior / media payloads.
// - The offline fallback (lib/davies-profile.ts) uses the aliases to map plain-language requests.
//
// This file must stay free of React / browser imports so it can run on the server and the client.

export const PAGE_TARGETS = [
  { id: "cover", label: "Cover page: hero, links, photo collage, Ask DaveAI note", aliases: ["cover", "home", "front page"] },
  { id: "about", label: "About page (p.01): bio, career path, skills, photos", aliases: ["about"] },
  { id: "experience", label: "Experience page (p.02): all five roles with demos and photos", aliases: ["experience"] },
  { id: "projects", label: "Projects page (p.03): the three projects", aliases: ["projects"] },
] as const

export const HIGHLIGHT_TARGETS = [
  { id: "elise", page: "experience", label: "EliseAI role (Product Solutions, VoiceAI & CRM)", aliases: ["elise", "eliseai", "apollo", "datadog", "postman"] },
  { id: "soda", page: "experience", label: "Soda Data role (Product Intern, anomaly detection)", aliases: ["soda", "airflow", "databricks", "anomaly", "prophet"] },
  { id: "mockq", page: "experience", label: "MockQ role (Co-Founder, VoiceAI interviewer)", aliases: ["mockq", "mock q", "interviewer"] },
  { id: "gitcloud", page: "experience", label: "GitCloud role (Co-Founder, student venture studio)", aliases: ["gitcloud", "venture studio"] },
  { id: "trimble", page: "experience", label: "Trimble Inc. role (Product Intern, POSPac Cloud)", aliases: ["trimble", "pospac", "geospatial"] },
  { id: "voiceai", page: "projects", label: "Project card: VoiceAI for Claude Code CLI", aliases: ["claude code", "voiceai for claude", "voice layer", "claude"] },
  { id: "crypto", page: "projects", label: "Project card: Crypto Fraud ML Model", aliases: ["crypto", "fraud", "coingauge", "revm", "onnx", "gbdt", "ethereum", "evm", "risk scoring", "risk analyzer", "wallet", "blockchain"] },
  { id: "phone", page: "projects", label: "Project card: Computer Use Phone Agent", aliases: ["phone agent", "computer use", "phone detector", "biometric"] },
  { id: "bio", page: "about", label: "About bio block (education, McMaster, who Davies is)", aliases: ["bio", "education", "mcmaster", "degree", "story"] },
  { id: "skills", page: "about", label: "About skills block (tech stack)", aliases: ["skills", "tech stack", "stack"] },
] as const

export const MEDIA_TARGETS = [
  { id: "elise-demo", page: "experience", kind: "video", short: "the EliseAI Apollo demo", label: "EliseAI Apollo product demo video", aliases: ["elise", "eliseai", "apollo"] },
  { id: "soda-demo", page: "experience", kind: "video", short: "the Soda Contract Copilot demo", label: "Soda Data / SodaAI Contract Copilot demo video", aliases: ["soda", "sodaai", "copilot"] },
  { id: "mockq-demo", page: "experience", kind: "video", short: "the MockQ interviewer demo", label: "MockQ VoiceAI interviewer + live coding IDE demo video", aliases: ["mockq", "mock q"] },
  { id: "trimble-photo", page: "experience", kind: "image", short: "the Trimble POSPac screenshot", label: "Trimble POSPac UAV / PP-RTX geospatial monitor screenshot", aliases: ["trimble", "pospac"] },
  { id: "gitcloud-albums", page: "experience", kind: "album", short: "GitCloud's photo albums", label: "GitCloud photo albums gallery (shows all 7 albums; use this for generic 'gitcloud pictures')", aliases: ["gitcloud"] },
  { id: "gitcloud-google-hackathon", page: "experience", kind: "album", short: "the Google x GitCloud Hackathon album", label: "Album: Google x GitCloud Hackathon at Google Toronto", aliases: ["google hackathon", "google x gitcloud", "google toronto"] },
  { id: "gitcloud-startup-summit", page: "experience", kind: "album", short: "the GitCloud StartUp Summit album", label: "Album: GitCloud StartUp Summit panel", aliases: ["startup summit", "summit"] },
  { id: "gitcloud-shopify-panel", page: "experience", kind: "album", short: "the Shopify x GitCloud panel album", label: "Album: Shopify x GitCloud Panel", aliases: ["shopify"] },
  { id: "gitcloud-intuit-tour", page: "experience", kind: "album", short: "the Intuit x GitCloud album", label: "Album: Intuit x GitCloud office tour", aliases: ["intuit"] },
  { id: "gitcloud-gdg-hackathon", page: "experience", kind: "album", short: "the GDG x GitCloud Hackathon album", label: "Album: GDG x GitCloud Hackathon", aliases: ["gdg"] },
  { id: "gitcloud-deltahacks", page: "experience", kind: "album", short: "the DeltaHacks AI workshop album", label: "Album: DeltaHacks x GitCloud AI (Voice AI Agent) workshop at McMaster", aliases: ["deltahacks", "delta hacks"] },
  { id: "gitcloud-team", page: "experience", kind: "album", short: "the GitCloud team album", label: "Album: GitCloud executive team photos", aliases: ["gitcloud team", "the team", "exec team"] },
  { id: "photo-google-keynote", page: "cover", kind: "image", short: "the Google x GitCloud keynote photo", label: "Cover photo: Davies giving the Google x GitCloud keynote", aliases: ["google keynote", "keynote at google", "two projector"] },
  { id: "photo-judge-google", page: "cover", kind: "image", short: "the Google hackathon judging photo", label: "Cover photo: Davies judging at the Google Hackathon", aliases: ["judge at google", "judging at google"] },
  { id: "photo-trimble-internship", page: "cover", kind: "image", short: "the Trimble internship photo", label: "Cover photo: Davies at his Trimble internship", aliases: ["trimble internship", "trimble office"] },
  { id: "photo-startup-summit", page: "cover", kind: "image", short: "the StartUp Summit panel photo", label: "Cover photo: Davies as a panelist at StartUp Summit", aliases: ["panelist"] },
  { id: "photo-mcmaster-keynote", page: "cover", kind: "image", short: "the McMaster keynote photo", label: "Cover photo: Davies's keynote at McMaster University", aliases: ["mcmaster keynote", "mcmaster podium", "keynote at mcmaster"] },
  { id: "photo-davies-portrait", page: "cover", kind: "image", short: "Davies's portrait", label: "Cover photo: Davies's portrait (what Davies looks like)", aliases: ["portrait", "headshot", "look like"] },
  { id: "photo-deltahacks-workshop", page: "about", kind: "image", short: "the DeltaHacks workshop photo", label: "About photo: Davies teaching the GitCloud x DeltaHacks workshop", aliases: ["deltahacks workshop"] },
  { id: "photo-gdg-judge", page: "about", kind: "image", short: "the GDG hackathon judging photo", label: "About photo: Davies judging at the GDG Hackathon", aliases: ["judge at gdg", "gdg judge"] },
  { id: "photo-founder-panel", page: "about", kind: "image", short: "the founder panel Q&A photo", label: "About photo: Davies at a founder panel Q&A in Toronto", aliases: ["founder panel", "founder q&a", "q&a"] },
] as const

export const LINK_TARGETS = [
  { id: "github-voiceai", label: "VoiceAI for Claude Code on GitHub", url: "https://github.com/daviesumoh/claude-code-voice-agent", aliases: ["repo", "repository", "source code", "github repo", "claude code github"] },
  { id: "github-crypto", label: "Crypto Fraud ML Model on GitHub", url: "https://github.com/daviesumoh/Crypto-Fraud-ML-Model-Coingauge", aliases: ["crypto github", "crypto repo", "fraud repo", "coingauge"] },
  { id: "github-profile", label: "Davies's GitHub profile", url: "https://github.com/daviesumoh", aliases: ["github"] },
  { id: "linkedin", label: "Davies's LinkedIn", url: "https://linkedin.com/in/daviesumoh", aliases: ["linkedin"] },
  { id: "email", label: "Email Davies", url: "mailto:daviesumoh000@gmail.com", aliases: ["email", "e-mail", "contact"] },
  { id: "resume", label: "Request Davies's resume (PDF) by email", url: "mailto:daviesumoh000@gmail.com?subject=Resume%20Request%20-%20Davies%20Umoh", aliases: ["resume", "cv"] },
  { id: "calendly", label: "Book a coffee chat with Davies", url: "https://calendly.com/daviesumoh000/sync", aliases: ["calendly", "coffee chat", "book a call"] },
] as const

export type PageId = (typeof PAGE_TARGETS)[number]["id"]
export type HighlightId = (typeof HIGHLIGHT_TARGETS)[number]["id"]
export type MediaId = (typeof MEDIA_TARGETS)[number]["id"]
export type LinkId = (typeof LINK_TARGETS)[number]["id"]

export type PortfolioAction =
  | { tool: "navigate"; target: PageId }
  | { tool: "highlight"; target: HighlightId }
  | { tool: "open_media"; target: MediaId }
  | { tool: "open_link"; target: LinkId }
  | { tool: "close_media" }

const PAGE_IDS = PAGE_TARGETS.map((t) => t.id) as string[]
const HIGHLIGHT_IDS = HIGHLIGHT_TARGETS.map((t) => t.id) as string[]
const MEDIA_IDS = MEDIA_TARGETS.map((t) => t.id) as string[]
const LINK_IDS = LINK_TARGETS.map((t) => t.id) as string[]

export const MAX_ACTIONS_PER_REPLY = 4

/**
 * Validates untrusted model/client output: drops unknown tools or targets instead of acting on them,
 * and keeps any highlight action synchronized with what the reply actually mentions.
 */
export function sanitizeActions(raw: unknown, reply?: string): PortfolioAction[] {
  if (!Array.isArray(raw)) return []
  const out: PortfolioAction[] = []
  for (const item of raw) {
    if (!item || typeof item !== "object") continue
    const { tool, target } = item as { tool?: unknown; target?: unknown }
    if (tool === "close_media") {
      out.push({ tool })
    } else if (tool === "navigate" && typeof target === "string" && PAGE_IDS.includes(target)) {
      out.push({ tool, target: target as PageId })
    } else if (tool === "highlight" && typeof target === "string" && HIGHLIGHT_IDS.includes(target)) {
      out.push({ tool, target: target as HighlightId })
    } else if (tool === "open_media" && typeof target === "string" && MEDIA_IDS.includes(target)) {
      out.push({ tool, target: target as MediaId })
    } else if (tool === "open_link" && typeof target === "string" && LINK_IDS.includes(target)) {
      out.push({ tool, target: target as LinkId })
    }
    if (out.length >= MAX_ACTIONS_PER_REPLY) break
  }

  if (reply && reply.trim()) {
    const lowerReply = reply.toLowerCase()
    const mentionedTargets = HIGHLIGHT_TARGETS.filter((t) =>
      t.aliases.some((alias) => lowerReply.includes(alias))
    )

    // 1. If a highlight action points to an item NOT mentioned in the reply, while exactly one item on that page IS mentioned, fix it.
    for (let i = 0; i < out.length; i++) {
      const act = out[i]
      if (act.tool === "highlight") {
        const currentTarget = HIGHLIGHT_TARGETS.find((t) => t.id === act.target)
        if (currentTarget && !mentionedTargets.some((m) => m.id === currentTarget.id)) {
          const onSamePage = mentionedTargets.filter((m) => m.page === currentTarget.page)
          if (onSamePage.length === 1) {
            out[i] = { tool: "highlight", target: onSamePage[0].id }
          }
        }
      }
    }

    // 2. If the model navigated to a page without a highlight, and the reply spotlights a single item on that page, highlight it.
    const hasHighlight = out.some((a) => a.tool === "highlight")
    if (!hasHighlight && out.length < MAX_ACTIONS_PER_REPLY) {
      const navAction = out.find((a) => a.tool === "navigate")
      if (navAction && navAction.tool === "navigate") {
        const onNavPage = mentionedTargets.filter((m) => m.page === navAction.target)
        if (onNavPage.length === 1) {
          out.push({ tool: "highlight", target: onNavPage[0].id })
        }
      }
    }
  }

  return out
}

/** Maps the older {navTab, highlight} pair to the tool-call format. */
export function legacyToActions(navTab?: string | null, highlight?: string | null): PortfolioAction[] {
  const actions: PortfolioAction[] = []
  let page = navTab === "skills" ? "about" : navTab
  let hl = highlight === "education" ? "bio" : highlight
  if (navTab === "skills" && !hl) hl = "skills"
  if (page && PAGE_IDS.includes(page)) actions.push({ tool: "navigate", target: page as PageId })
  if (hl && HIGHLIGHT_IDS.includes(hl)) actions.push({ tool: "highlight", target: hl as HighlightId })
  return actions
}

/** Prompt section describing every tool and ID the model may use. */
export function buildToolCatalogPrompt(): string {
  const lines = (items: readonly { id: string; label: string }[]) =>
    items.map((t) => `    - "${t.id}": ${t.label}`).join("\n")

  return `PAGE CONTROLLER TOOLS (you physically operate this notebook through the "actions" array):
  Tools, in the order they should run:
  1. navigate(target): flip to a page. Targets:
${lines(PAGE_TARGETS)}
  2. highlight(target): flip to the item's page, scroll to it and mark it with a highlighter. Targets:
${lines(HIGHLIGHT_TARGETS)}
  3. open_media(target): open a demo video, photo, or photo album in a full-screen viewer. Targets:
${lines(MEDIA_TARGETS)}
  4. open_link(target): show a clickable link under your reply (never paste raw URLs into the reply text). Targets:
${lines(LINK_TARGETS)}
  5. close_media(): close any open photo / video / album viewer.

TOOL USE RULES:
  - Be exact. Use the tool + target that matches the item your reply is actually about. NEVER highlight an item your reply doesn't discuss.
  - "Show me pictures / photos / the album of GitCloud" => open_media "gitcloud-albums" (or the specific album, e.g. "gitcloud-deltahacks", when the user names the event).
  - "Show me the demo / video of X" => open_media for X's demo. "What does Davies look like?" => open_media "photo-davies-portrait".
  - When asked "show me Davies projects" (or about his projects), spotlight a concrete project in your reply (e.g. VoiceAI for Claude Code CLI) and highlight that exact item ("voiceai"), or if listing all three without spotlighting one, use navigate "projects" with no highlight. Whenever your reply spotlights a single item, always highlight that item so the highlight matches what you mentioned in chat.
  - Links / GitHub / LinkedIn / email / resume / booking => open_link.
  - If your reply says you opened, flipped to, or are showing something, you MUST include the matching action. If the user didn't ask for anything visual, use an empty actions array.
  - Use at most ${MAX_ACTIONS_PER_REPLY} actions; most replies need 0-2. Never invent IDs.`
}

/** Strict JSON schema so the model can only return known tools and IDs. */
export function buildResponseJsonSchema() {
  const target = (tool: string, ids: string[]) => ({
    type: "object",
    additionalProperties: false,
    required: ["tool", "target"],
    properties: {
      tool: { type: "string", enum: [tool] },
      target: { type: "string", enum: ids },
    },
  })

  return {
    name: "daveai_response",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      required: ["reply", "actions"],
      properties: {
        reply: { type: "string" },
        actions: {
          type: "array",
          items: {
            anyOf: [
              target("navigate", PAGE_IDS),
              target("highlight", HIGHLIGHT_IDS),
              target("open_media", MEDIA_IDS),
              target("open_link", LINK_IDS),
              {
                type: "object",
                additionalProperties: false,
                required: ["tool"],
                properties: { tool: { type: "string", enum: ["close_media"] } },
              },
            ],
          },
        },
      },
    },
  }
}

// ---------------------------------------------------------------------------
// Offline intent matching (used when there is no API key or the API fails)
// ---------------------------------------------------------------------------

interface Aliased {
  id: string
  aliases: readonly string[]
}

/** Returns the target whose longest alias appears in the text (ties go to the first listed). */
function bestMatch<T extends Aliased>(lower: string, items: readonly T[]): T | null {
  let best: T | null = null
  let bestLen = 0
  for (const item of items) {
    for (const alias of item.aliases) {
      if (lower.includes(alias) && alias.length > bestLen) {
        best = item
        bestLen = alias.length
      }
    }
  }
  return best
}

const WANTS_PICTURES = /\b(pictures?|photos?|pics?|images?|albums?|galler(?:y|ies)|snapshots?|look like)\b/
const WANTS_VIDEO = /\b(demos?|videos?|watch|clips?|recordings?|footage)\b/
const WANTS_LINK = /\b(github|repo|repository|source code|linkedin|e-?mail|calendly|coffee chat|book a call|resume|cv)\b/
const WANTS_CLOSE = /\b(close|dismiss|exit|hide)\b.*\b(album|modal|photo|picture|video|gallery|viewer|this|it)\b/

export interface LocalActionReply {
  reply: string
  actions: PortfolioAction[]
}

/** Plain-language requests to open media, links, or close the viewer. Returns null when nothing matched. */
export function matchLocalActionIntent(query: string): LocalActionReply | null {
  const lower = query.toLowerCase()

  if (WANTS_CLOSE.test(lower)) {
    return { reply: "Closing that viewer and returning to the notebook.", actions: [{ tool: "close_media" }] }
  }

  if (WANTS_PICTURES.test(lower)) {
    const photoTargets = MEDIA_TARGETS.filter((t) => t.kind === "album" || t.kind === "image")
    // Specific events first (longest alias wins), then the generic GitCloud gallery
    const match = bestMatch(lower, photoTargets)
    if (match) {
      return {
        reply: `Opening ${match.short} for you!`,
        actions: [{ tool: "open_media", target: match.id }],
      }
    }
    // Generic "show me pictures": Davies himself if the question is about him, otherwise the biggest gallery
    if (/\b(davies|him|his|you|your|yourself)\b/.test(lower) && !lower.includes("gitcloud")) {
      return {
        reply: "Here's Davies's portrait from the cover!",
        actions: [{ tool: "open_media", target: "photo-davies-portrait" }],
      }
    }
    return {
      reply: "Opening GitCloud's photo albums, the biggest photo collection in this notebook!",
      actions: [{ tool: "open_media", target: "gitcloud-albums" }],
    }
  }

  if (WANTS_VIDEO.test(lower)) {
    const videoTargets = MEDIA_TARGETS.filter((t) => t.kind === "video")
    const match = bestMatch(lower, videoTargets)
    if (match) {
      return {
        reply: `Playing ${match.short} now.`,
        actions: [{ tool: "open_media", target: match.id }],
      }
    }
    return {
      reply: "The demo videos live on the Experience page: EliseAI's Apollo, Soda's Contract Copilot, and MockQ's VoiceAI interviewer. Tell me which one to play!",
      actions: [{ tool: "navigate", target: "experience" }],
    }
  }

  if (WANTS_LINK.test(lower)) {
    const match = bestMatch(lower, LINK_TARGETS)
    if (match) {
      return {
        reply: `Here's the link: ${match.label}.`,
        actions: [{ tool: "open_link", target: match.id }],
      }
    }
  }

  return null
}
