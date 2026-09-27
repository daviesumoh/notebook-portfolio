// DaveAI Persona & Portfolio Knowledge Engine
// - Public portfolio facts come from `lib/portfolio-config.ts`.
// - Private personal Q&A traits are loaded from `process.env.DAVEAI_PERSONA_JSON` (in `.env.local` / Vercel),
//   falling back to `DEFAULT_PERSONA_PROFILE` when cloned as a public template.

import {
  buildToolCatalogPrompt,
  legacyToActions,
  matchLocalActionIntent,
  type PortfolioAction,
} from "./portfolio-actions"
import {
  ABOUT_CONFIG,
  DEFAULT_PERSONA_PROFILE,
  EXPERIENCES,
  OWNER_INFO,
  PROJECTS,
  type DaviesPersonalityProfile,
} from "./portfolio-config"

export type { DaviesPersonalityProfile }

/**
 * Loads the private persona from `DAVEAI_PERSONA_JSON` (server env / .env.local),
 * merging over `DEFAULT_PERSONA_PROFILE` so personal traits stay out of public Git.
 */
export function getPersonaProfile(): DaviesPersonalityProfile {
  const raw = typeof process !== "undefined" ? process.env?.DAVEAI_PERSONA_JSON : undefined
  if (!raw) return DEFAULT_PERSONA_PROFILE
  try {
    const parsed = JSON.parse(raw) as Partial<DaviesPersonalityProfile>
    return {
      ...DEFAULT_PERSONA_PROFILE,
      ...parsed,
      funFacts: Array.isArray(parsed.funFacts) ? parsed.funFacts : DEFAULT_PERSONA_PROFILE.funFacts,
    }
  } catch {
    return DEFAULT_PERSONA_PROFILE
  }
}

export const DAVIES_PROFILE: DaviesPersonalityProfile = getPersonaProfile()

/**
 * Generates the full dynamic DaveAI system prompt including:
 * 1. Live real-world date and time
 * 2. Portfolio knowledge base from `lib/portfolio-config.ts`
 * 3. Private personality traits from `getPersonaProfile()`
 * 4. "Main Character" redirection rules & guardrails
 */
export function buildDaveAiSystemPrompt(): string {
  const profile = getPersonaProfile()
  const now = new Date()
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  const experienceSummary = EXPERIENCES.map(
    (exp, idx) =>
      `  ${idx + 1}. ${exp.headline} (${exp.period}): ${exp.narrative}${
        exp.media?.title ? ` Demo/Media: ${exp.media.title}.` : ""
      }`
  ).join("\n")

  const projectsSummary = PROJECTS.map(
    (proj, idx) =>
      `  ${idx + 1}. ${proj.title}${proj.techStack ? ` (${proj.techStack})` : ""}${
        proj.description ? `: ${proj.description}` : ""
      }${proj.githubUrl ? ` GitHub: ${proj.githubUrl}` : ""}`
  ).join("\n")

  const skillsSummary = ABOUT_CONFIG.skills
    .map((s) => `  - ${s.label}: ${s.value}`)
    .join("\n")

  return `You are DaveAI, the witty, sharp, and helpful AI field assistant embedded in ${OWNER_INFO.name}'s skeuomorphic spiral diary portfolio.
You speak in a warm, concise, handwritten diary tone (like ink notes written in notebook margins).
You represent ${OWNER_INFO.name} (${OWNER_INFO.role} with experience in ${OWNER_INFO.specialties.join(", ")}).

==================================================
LIVE TEMPORAL CONTEXT:
- Today's Date: ${dateStr}
- Current Local Time: ${timeStr}
- YOU ALWAYS KNOW TODAY'S DATE AND TIME. If asked what date or time it is, answer accurately with ${dateStr} and ${timeStr}, and playfully add: "It's ${dateStr}, but more importantly: it's ${OWNER_INFO.firstName}' time to shine!"
==================================================

PORTFOLIO KNOWLEDGE BASE (CURRENT SOURCE OF TRUTH):
- Who ${OWNER_INFO.firstName} is (Cover & About p.01): ${OWNER_INFO.role} based in ${OWNER_INFO.location}. ${ABOUT_CONFIG.bioBullets.join(". ")}.
- Work Experience (Experience p.02 — all roles include field demo videos/photos):
${experienceSummary}
- Projects (Projects p.03):
${projectsSummary}
- Speaking, Panels & Community Highlights (Cover & About photos):
  - Google x GitCloud Keynote & Judge at Google Hackathon (Google Toronto)
  - Panelist at StartUp Summit (with Stan, Chexy, Boardy, MaRS IAF, Northside VC & Polarity)
  - Keynote at McMaster University & GitCloud x DeltaHacks Voice AI workshop
  - Founder Q&A · Toronto & Judge at GDG Hackathon
- Skills & Tech Stack (About p.01):
${skillsSummary}
- Links & Contact (Cover):
  - LinkedIn: ${OWNER_INFO.links.linkedin}
  - Email / Resume PDF requests: ${OWNER_INFO.links.email}
  - Coffee chat (Calendly): ${OWNER_INFO.links.calendly}

==================================================
PERSONALITY, TASTES, SETUP & WORK STYLE (USE THIS PERSONA TO ANSWER SIMILAR/EXTRAPOLATED QUESTIONS ACCURATELY):
- Food, Drink & Cravings:
  * Favorite Food / Go-to Meal: ${profile.favoriteMeal}
  * Go-to Drink: ${profile.goToDrink} (does NOT default to coffee — prefers ${profile.goToDrink.toLowerCase()}!)
  * Sweet vs Savory: ${profile.flavorPreference}
  * Go-to Takeout / Late-night Spot: ${profile.lateNightSpot}
- Lifestyle, Media & Sports:
  * Music Taste: ${profile.musicTaste}
  * Schedule / Chronotype: ${profile.chronotype}
  * Movies & Shows: ${profile.favoriteMoviesAndShows}
  * Book & Podcast: ${profile.favoriteBookAndPodcast}
  * Workouts & Sports: ${profile.workoutsAndSports}
  * Favorite Sports Team: ${profile.favoriteSportsTeam}
  * Hobby Outside Tech: ${profile.topHobbyOutsideTech}
  * Pets: ${profile.pets}
  * Social Energy: ${profile.socialEnergy} | Friends call him: ${profile.friendDescriptor}
  * Favorite Destination / Trip: ${profile.favoriteTravelDestination}
  * Fashion / Vibe: ${profile.styleVibe}
  * Personal Motto: "${profile.motto}"
- Tech Stack, Tools & Builder Instincts:
  * Phone & OS: ${profile.phone}, ${profile.os} | Visual mode: ${profile.themeMode}
  * Primary IDE / AI Coding Tool: ${profile.primaryIdeAndAiTool}
  * Favorite Languages: ${profile.favoriteLanguage}
  * Favorite Product / Design Tool: ${profile.favoriteProductTool}
  * Company Stage Focus: ${profile.preferredCompanyStage} | Product he admires: ${profile.admiredProduct}
  * Product Building Style: ${profile.productApproach} | Superpower: ${profile.superpower}
  * Collaboration & Comms: Loves ${profile.collaborationStyle} and prefers a ${profile.communicationStyle} over endless docs
  * Biggest Software Peeve: ${profile.biggestProductPeeve}
  * Metrics Instinct: ${profile.metricsPhilosophy}

==================================================
CRITICAL BEHAVIORAL & GUARDRAIL RULES:

1. THE "MAIN CHARACTER" RULE (OFF-TOPIC REDIRECTION):
   - ${OWNER_INFO.firstName} is the undisputed MAIN CHARACTER of this portfolio.
   - If asked something unrelated to ${OWNER_INFO.firstName}, his career, his projects, or his tastes (e.g., general trivia, weather, random math, coding help, "what should I eat?"):
     * Do NOT act like a generic assistant. Bridge naturally and playfully back to ${OWNER_INFO.firstName} using what's relevant to their question (his tastes, tools, sports, work, or projects).

2. INDECENT, OUTLANDISH, OR INAPPROPRIATE QUESTIONS (NATURAL CONTEXTUAL REDIRECT):
   - NEVER answer indecent, vulgar, invasive, outlandish, derogatory, or inappropriate questions about ${OWNER_INFO.firstName} (do not invent private/NSFW claims or play along with absurd/disrespectful premises).
   - NEVER use a stiff, hardcoded, copy-pasted canned refusal sentence.
   - Decline smoothly and redirect **naturally in the context of what was asked**, steering the conversation politely back toward ${OWNER_INFO.firstName}' real story, products, specs, projects, or benign favorites.

3. PREDICTIVE PERSONALITY EXTRAPOLATION:
   - When asked new/unseen personal or preference questions (e.g., iOS vs Android, IDE choice, design sensibilities, sweet vs salty snack, tea vs coffee, work pace, weekend vibe, communication style, favorite team, etc.), extrapolate accurately from his verified traits above!

4. TONE & FORMAT:
   - Maximum 2-3 sentences. Crisp, witty, warm handwritten-diary tone.
   - Only cite portfolio facts consistent with what is actually on his site (do not mention Jira or outdated numbers).
   - You can physically flip pages and highlight keywords when discussing relevant topics!

PAGE CONTROLLER & MEDIA TOOLS:
${buildToolCatalogPrompt()}

OUTPUT FORMAT INSTRUCTIONS:
Always respond with a JSON object: { "reply": string, "actions": Action[] }.
- "reply": your brief handwritten-style diary response (max 2-3 sentences, direct and natural, no raw URLs).
- "actions": zero or more tool calls, each exactly { "tool": "<tool name>", "target": "<id from the lists above>" } (close_media takes no target).
`
}

export type LocalNavTab = "cover" | "about" | "experience" | "projects" | "skills"

export interface LocalPortfolioReply {
  reply: string
  navTab: LocalNavTab | null
  highlight: string | null
  actions: PortfolioAction[]
  chips: { label: string; action: string }[]
  source: string
}

const BAD_PATTERNS = [
  /\b(fuck|shit|bitch|asshole|bastard|dick|pussy|cunt|slut|whore)\b/i,
  /\b(kill|hate|nazi|racist|retard|idiot|stupid|trash)\b/i,
  /\b(offensive|attack|threat|harass|insult)\b/i,
]

export function isOffensiveOrInappropriate(text: string): boolean {
  return BAD_PATTERNS.some((pattern) => pattern.test(text))
}

/**
 * Offline engine shared by the server API fallback and the client fallback.
 * Media / link / viewer requests are resolved first through the shared tool catalog, then the
 * topic answers below, whose navTab/highlight pair is converted to tool-call actions.
 */
export function getLocalPortfolioResponse(query: string): LocalPortfolioReply {
  if (!isOffensiveOrInappropriate(query)) {
    const intent = matchLocalActionIntent(query)
    if (intent) {
      return {
        reply: intent.reply,
        actions: intent.actions,
        navTab: null,
        highlight: null,
        chips: [],
        source: "local-engine",
      }
    }
  }
  const topic = getLocalTopicResponse(query)
  return { ...topic, actions: legacyToActions(topic.navTab, topic.highlight) }
}

function getLocalTopicResponse(query: string): Omit<LocalPortfolioReply, "actions"> {
  const profile = getPersonaProfile()
  const lower = query.toLowerCase()
  const now = new Date()
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  if (isOffensiveOrInappropriate(query)) {
    return {
      reply: `Easy there — I'm going to steer this notebook back toward calmer ink! Ask me about ${OWNER_INFO.firstName}' builds at EliseAI, MockQ, or his favorite hobbies and hot takes on software instead.`,
      navTab: null,
      highlight: null,
      chips: [
        { label: `about ${OWNER_INFO.firstName}`, action: `ask:tell me about ${OWNER_INFO.firstName}` },
        { label: "VoiceAI project", action: "ask:tell me about VoiceAI for Claude Code" },
        { label: "MockQ", action: "ask:tell me about MockQ" },
      ],
      source: "local-engine",
    }
  }

  if (lower.includes("coffee chat") || lower.includes("calendly") || lower.includes("schedule") || lower.includes("book a call") || lower.includes("resume") || lower.includes("contact") || lower.includes("email") || lower.includes("hire") || lower.includes("linkedin")) {
    return {
      reply: `${OWNER_INFO.firstName} loves hopping on a ${profile.communicationStyle.toLowerCase()} — you can book a coffee chat via Calendly, email ${OWNER_INFO.links.email} (for outreach or resume PDFs), or connect on LinkedIn!`,
      navTab: "cover",
      highlight: null,
      chips: [
        { label: "coffee chat", action: `link:${OWNER_INFO.links.calendly}` },
        { label: "linkedin", action: `link:${OWNER_INFO.links.linkedin}` },
        { label: "email", action: `link:mailto:${OWNER_INFO.links.email}` },
      ],
      source: "local-engine",
    }
  }

  if (lower.includes("date") || lower.includes("today") || lower.includes("day is it") || lower.includes("year is it")) {
    return {
      reply: `Today is ${dateStr} — and whether it's late night or afternoon, this ${profile.chronotype.toLowerCase()} builder is probably deep in specs or metrics! Ask about EliseAI, Soda Data, or MockQ.`,
      navTab: null,
      highlight: null,
      chips: [
        { label: "EliseAI", action: "ask:tell me about EliseAI" },
        { label: "MockQ", action: "ask:tell me about MockQ" },
        { label: "Projects", action: "nav:projects" },
      ],
      source: "local-engine",
    }
  }

  if (lower.includes("what time") || lower.includes("clock") || lower === "time") {
    return {
      reply: `It's ${timeStr} — peak ${profile.chronotype.toLowerCase()} hours in ${OWNER_INFO.firstName}' book! Ask about his VoiceAI work, MockQ, or his favorite late-night takeout (${profile.lateNightSpot}).`,
      navTab: null,
      highlight: null,
      chips: [
        { label: "Experience", action: "nav:experience" },
        { label: "About", action: "nav:about" },
        { label: "Projects", action: "nav:projects" },
      ],
      source: "local-engine",
    }
  }

  if (lower.includes("eat") || lower.includes("food") || lower.includes("lunch") || lower.includes("dinner") || lower.includes("hungry") || lower.includes("breakfast") || lower.includes("meal") || lower.includes("sweet") || lower.includes("snack")) {
    return {
      reply: `${OWNER_INFO.firstName} leans ${profile.flavorPreference.toLowerCase()} and his #1 go-to meal is ${profile.favoriteMeal} (with ${profile.lateNightSpot} as his late-night takeout pick)!`,
      navTab: null,
      highlight: null,
      chips: [
        { label: "go-to drink", action: `ask:what does ${OWNER_INFO.firstName} drink?` },
        { label: "music & hobbies", action: `ask:what does ${OWNER_INFO.firstName} do outside tech?` },
        { label: "Experience", action: "nav:experience" },
      ],
      source: "local-engine",
    }
  }

  if (lower.includes("coffee") || lower.includes("drink") || lower.includes("boba") || lower.includes("tea") || lower.includes("juice")) {
    return {
      reply: `Skip the espresso — ${OWNER_INFO.firstName}' go-to drink is ${profile.goToDrink}! Fits his ${profile.flavorPreference.toLowerCase()}-tooth vibe while reviewing specs or metrics.`,
      navTab: null,
      highlight: null,
      chips: [
        { label: "music taste", action: `ask:what music does ${OWNER_INFO.firstName} listen to?` },
        { label: "book coffee chat", action: `link:${OWNER_INFO.links.calendly}` },
      ],
      source: "local-engine",
    }
  }

  if (lower.includes("music") || lower.includes("playlist") || lower.includes("song") || lower.includes("listen") || lower.includes("rnb") || lower.includes("hip hop")) {
    return {
      reply: `${OWNER_INFO.firstName} jams to ${profile.musicTaste} while doing late-night ${profile.collaborationStyle.toLowerCase()} in ${profile.themeMode}.`,
      navTab: null,
      highlight: null,
      chips: [
        { label: "coding setup", action: `ask:what tools does ${OWNER_INFO.firstName} use?` },
        { label: "Projects", action: "nav:projects" },
      ],
      source: "local-engine",
    }
  }

  if (lower.includes("movie") || lower.includes("show") || lower.includes("book") || lower.includes("podcast") || lower.includes("read") || lower.includes("watch")) {
    return {
      reply: `Favorite screen picks: ${profile.favoriteMoviesAndShows}. On the reading & audio side: ${profile.favoriteBookAndPodcast}.`,
      navTab: null,
      highlight: null,
      chips: [
        { label: "sports & hobbies", action: `ask:what are ${OWNER_INFO.firstName}' hobbies and favorite team?` },
        { label: "About", action: "nav:about" },
      ],
      source: "local-engine",
    }
  }

  if (lower.includes("sport") || lower.includes("soccer") || lower.includes("gym") || lower.includes("workout") || lower.includes("hobby") || lower.includes("hobbies") || lower.includes("outside") || lower.includes("free time") || lower.includes("team")) {
    return {
      reply: `Outside of shipping software, ${OWNER_INFO.firstName} loves ${profile.topHobbyOutsideTech}, hits ${profile.workoutsAndSports}, and backs ${profile.favoriteSportsTeam}!`,
      navTab: "about",
      highlight: "bio",
      chips: [
        { label: "fun fact", action: `ask:give me a fun fact about ${OWNER_INFO.firstName}` },
        { label: "Experience", action: "nav:experience" },
      ],
      source: "local-engine",
    }
  }

  if (lower.includes("iphone") || lower.includes("android") || (lower.includes("phone") && !lower.includes("agent")) || lower.includes("mac") || lower.includes("windows") || lower.includes("linux") || lower.includes("ide") || lower.includes("cursor") || lower.includes("antigravity") || lower.includes("mobbin") || lower.includes("dark mode") || lower.includes("rust") || lower.includes("tool")) {
    return {
      reply: `${OWNER_INFO.firstName} runs ${profile.themeMode} on ${profile.os} + ${profile.phone}, builds in ${profile.primaryIdeAndAiTool} (${profile.favoriteLanguage}), pulls UI inspiration on ${profile.favoriteProductTool}, and dislikes ${profile.biggestProductPeeve.toLowerCase()}.`,
      navTab: "about",
      highlight: "skills",
      chips: [
        { label: "product style", action: `ask:how does ${OWNER_INFO.firstName} build products?` },
        { label: "Projects", action: "nav:projects" },
      ],
      source: "local-engine",
    }
  }

  if (lower.includes("spec") || lower.includes("metric") || lower.includes("stage") || lower.includes("scale") || lower.includes("scaling") || lower.includes("peeve") || lower.includes("superpower") || lower.includes("work style") || lower.includes("communicate")) {
    return {
      reply: `${OWNER_INFO.firstName} thrives at ${profile.preferredCompanyStage} stage via ${profile.collaborationStyle}, ${profile.communicationStyle.toLowerCase()}s, and ${profile.productApproach.toLowerCase()} (superpower: ${profile.superpower}). Metrics philosophy: ${profile.metricsPhilosophy}.`,
      navTab: "experience",
      highlight: "elise",
      chips: [
        { label: "Soda Data", action: "ask:tell me about Soda Data" },
        { label: "Skills", action: "nav:skills" },
      ],
      source: "local-engine",
    }
  }

  if (lower.includes("dog") || lower.includes("cat") || lower.includes("pet") || lower.includes("travel") || lower.includes("city") || lower.includes("extrovert") || lower.includes("introvert") || lower.includes("outfit") || lower.includes("fashion") || lower.includes("motto")) {
    return {
      reply: `${OWNER_INFO.firstName} is an ${profile.friendDescriptor.toLowerCase()} ${profile.socialEnergy.toLowerCase()} with a ${profile.styleVibe.toLowerCase()} vibe, a love for ${profile.pets.toLowerCase()}, and ${profile.favoriteTravelDestination} at the top of his travel list. His personal motto? "${profile.motto}."`,
      navTab: "about",
      highlight: "bio",
      chips: [
        { label: "favorite food", action: `ask:what is ${OWNER_INFO.firstName}' favorite food?` },
        { label: "Experience", action: "nav:experience" },
      ],
      source: "local-engine",
    }
  }

  if (lower.includes("fun fact") || lower.includes("fact about")) {
    return {
      reply: `Fun fact: ${profile.funFacts[0] || `${OWNER_INFO.firstName} co-founded GitCloud (300+ builders) and MockQ ($42k dev funding)!`}`,
      navTab: "about",
      highlight: "bio",
      chips: [
        { label: "whats GitCloud?", action: "ask:whats GitCloud?" },
        { label: "Building MockQ?", action: "ask:tell me about Building MockQ" },
      ],
      source: "local-engine",
    }
  }

  if (lower.includes("elise") || lower.includes("datadog") || lower.includes("postman") || lower.includes("apollo")) {
    return {
      reply: "At EliseAI (Jun 2026–Present, Product Solutions — VoiceAI & CRM), Davies built debugging automation in Postman & DataDog to isolate root causes on recurring platform bugs, cutting user-reported production incidents by 14%. Flipped to Experience (p.02)!",
      navTab: "experience",
      highlight: "elise",
      chips: [
        { label: "Soda Data", action: "ask:tell me about Soda Data" },
        { label: "MockQ", action: "ask:tell me about MockQ" },
      ],
      source: "local-engine",
    }
  }

  if (lower.includes("soda") || lower.includes("airflow") || lower.includes("databricks") || lower.includes("anomaly") || lower.includes("prophet") || lower.includes("contract")) {
    return {
      reply: "At Soda Data (Sep 2025–Apr 2026, Product Intern), Davies scaled automated anomaly detection across 1B+ rows with Airflow & Databricks, cutting false-positives by 70% compared to Meta's Prophet (plus his SodaAI contract copilot demo is on page 2!).",
      navTab: "experience",
      highlight: "soda",
      chips: [
        { label: "MockQ", action: "ask:tell me about MockQ" },
        { label: "GitCloud", action: "ask:whats GitCloud?" },
      ],
      source: "local-engine",
    }
  }

  if (lower.includes("mockq") || lower.includes("interview") || lower.includes("funding")) {
    return {
      reply: "MockQ (Sep 2025–Jul 2026, Co-Founder) is a real-time VoiceAI interviewer synchronizing AI voice and a live coding IDE for technical interviews, securing $42k in Dev Funding. Check out the highlighted demo video on Experience (p.02)!",
      navTab: "experience",
      highlight: "mockq",
      chips: [
        { label: "what about GitCloud?", action: "ask:whats GitCloud?" },
        { label: "Skills", action: "nav:skills" },
      ],
      source: "local-engine",
    }
  }

  if (lower.includes("gitcloud") || lower.includes("studio") || lower.includes("community") || lower.includes("deltahacks") || lower.includes("summit") || lower.includes("keynote") || lower.includes("judge") || lower.includes("hackathon") || lower.includes("workshop") || lower.includes("panel")) {
    return {
      reply: "Davies co-founded GitCloud (Apr 2025–May 2026), a student venture studio incubating 300+ builders across Toronto & McMaster — partnering with Google, Intuit, Shopify, DeltaHacks, Boardy, Stan, and VCs for hackathons, keynotes, and StartUp Summit panels. Flipped to page 2!",
      navTab: "experience",
      highlight: "gitcloud",
      chips: [
        { label: "Projects", action: "nav:projects" },
        { label: "About", action: "nav:about" },
      ],
      source: "local-engine",
    }
  }

  if (lower.includes("trimble") || lower.includes("pospac") || lower.includes("geospatial") || lower.includes("embedded")) {
    return {
      reply: "At Trimble Inc. (May 2024–May 2025, Product Intern), Davies defined PRDs for POSPac Cloud geospatial data processing, boosting cloud speeds by 27% via REST API integrations. Highlighted on Experience (p.02)!",
      navTab: "experience",
      highlight: "trimble",
      chips: [
        { label: "EliseAI", action: "ask:tell me about EliseAI" },
        { label: "Projects", action: "nav:projects" },
      ],
      source: "local-engine",
    }
  }

  if (lower.includes("claude") || lower.includes("swift") || lower.includes("cli") || lower.includes("macos")) {
    return {
      reply: "VoiceAI for Claude Code CLI is a low-latency conversational voice layer for the Claude Code app and CLI on macOS with real-time speech input and output (Swift · Node.js · TypeScript). Check out Projects (p.03) & the GitHub repo link!",
      navTab: "projects",
      highlight: "voiceai",
      chips: [
        { label: "GitHub repo", action: "link:https://github.com/daviesumoh/claude-code-voice-agent" },
        { label: "MockQ VoiceAI", action: "ask:tell me about MockQ" },
      ],
      source: "local-engine",
    }
  }

  if (lower.includes("project") || lower.includes("crypto") || lower.includes("fraud") || lower.includes("revm") || lower.includes("onnx") || lower.includes("risk") || lower.includes("phone") || lower.includes("computer use") || lower.includes("agent")) {
    let highlightProj = "voiceai"
    if (lower.includes("crypto") || lower.includes("fraud") || lower.includes("revm") || lower.includes("onnx") || lower.includes("ethereum") || lower.includes("risk") || lower.includes("wallet") || lower.includes("blockchain")) {
      highlightProj = "crypto"
    } else if (lower.includes("phone") || lower.includes("computer") || lower.includes("agent")) {
      highlightProj = "phone"
    }
    return {
      reply: `Turning to Projects (p.03): ${PROJECTS.map((p) => `${p.title}${p.techStack ? ` (${p.techStack})` : ""}`).join(", ")}!`,
      navTab: "projects",
      highlight: highlightProj,
      chips: [
        { label: "VoiceAI GitHub", action: "link:https://github.com/daviesumoh/claude-code-voice-agent" },
        { label: "Skills", action: "nav:skills" },
      ],
      source: "local-engine",
    }
  }

  if (lower.includes("experience") || lower.includes("work") || lower.includes("career") || lower.includes("role") || lower.includes("job") || lower.includes("data infra")) {
    return {
      reply: "Davies has experience in ML, Data infra & VoiceAI across EliseAI (Product Solutions, VoiceAI & CRM), Soda Data (Product Intern, 1B+ rows anomaly detection), MockQ (Co-Founder, $42k dev funding), GitCloud (Co-Founder, 300+ builders), and Trimble Inc. (Product Intern, POSPac Cloud). Flipped to Experience (p.02)!",
      navTab: "experience",
      highlight: "elise",
      chips: [
        { label: "EliseAI", action: "ask:tell me about EliseAI" },
        { label: "Soda Data", action: "ask:tell me about Soda Data" },
        { label: "MockQ", action: "ask:tell me about MockQ" },
      ],
      source: "local-engine",
    }
  }

  if (lower.includes("voiceai") || lower.includes("voice ai") || lower.includes("voice")) {
    return {
      reply: "Davies builds VoiceAI products across his work — currently in VoiceAI & CRM at EliseAI, previously co-founding MockQ's real-time VoiceAI coding interviewer ($42k funding), and shipping VoiceAI for Claude Code CLI on macOS (Swift · Node.js · TypeScript).",
      navTab: "experience",
      highlight: "mockq",
      chips: [
        { label: "VoiceAI for Claude Code", action: "ask:tell me about VoiceAI for Claude Code" },
        { label: "EliseAI", action: "ask:tell me about EliseAI" },
      ],
      source: "local-engine",
    }
  }

  if (lower.includes("school") || lower.includes("university") || lower.includes("mcmaster") || lower.includes("education") || lower.includes("degree")) {
    return {
      reply: "Davies holds a B.Engineering from McMaster University with experience in ML, Data infra & VoiceAI (and hosted workshops & keynotes at McMaster with GitCloud x DeltaHacks). Turning to About (p.01)!",
      navTab: "about",
      highlight: "bio",
      chips: [
        { label: "Skills", action: "nav:skills" },
        { label: "Projects", action: "nav:projects" },
      ],
      source: "local-engine",
    }
  }

  if (lower.includes("skill") || lower.includes("stack") || lower.includes("tech") || lower.includes("python") || lower.includes("sql") || lower.includes("typescript") || lower.includes("pytorch")) {
    return {
      reply: `Davies' toolkit spans ${ABOUT_CONFIG.skills.map((s) => `${s.label} (${s.value})`).join(", ")}. Highlighted Skills on About (p.01)!`,
      navTab: "about",
      highlight: "skills",
      chips: [
        { label: "Projects", action: "nav:projects" },
        { label: "Experience", action: "nav:experience" },
      ],
      source: "local-engine",
    }
  }

  if (lower.includes("who are you") || lower.includes("about") || lower.includes("bio") || lower.includes("story") || lower.includes("background") || lower.includes("davies")) {
    return {
      reply: "Davies is a B.Engineering graduate from McMaster University based in Toronto with experience in ML, Data infra & VoiceAI — currently Product Solutions at EliseAI and co-founder of MockQ ($42k funding) & GitCloud (300+ builders). Turning to About (p.01)!",
      navTab: "about",
      highlight: "bio",
      chips: [
        { label: "Experience (p.02)", action: "nav:experience" },
        { label: "Projects (p.03)", action: "nav:projects" },
      ],
      source: "local-engine",
    }
  }

  if (lower.includes("cover") || lower.includes("home")) {
    return {
      reply: "Flipping back to the Cover page — drag any Polaroid around or click a sticky note to explore!",
      navTab: "cover",
      highlight: null,
      chips: [
        { label: "About (p.01)", action: "nav:about" },
        { label: "Experience (p.02)", action: "nav:experience" },
      ],
      source: "local-engine",
    }
  }

  return {
    reply: `Let's stick to talking about ${OWNER_INFO.firstName} here — he's the main character! Ask about his experience at EliseAI, Soda Data, MockQ, GitCloud, Trimble, or his projects.`,
    navTab: null,
    highlight: null,
    chips: [
      { label: "Soda Data", action: "ask:tell me about Soda Data" },
      { label: "MockQ", action: "ask:tell me about MockQ" },
      { label: "Projects", action: "nav:projects" },
      { label: "Skills", action: "nav:skills" },
    ],
    source: "local-engine",
  }
}
