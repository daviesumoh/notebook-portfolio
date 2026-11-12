import { NextRequest, NextResponse } from "next/server"
import {
  buildDaveAiSystemPrompt,
  getLocalPortfolioResponse,
} from "@/lib/davies-profile"
import { buildResponseJsonSchema, sanitizeActions } from "@/lib/portfolio-actions"
import { getClientIp, rateLimit } from "@/lib/rate-limit"

const RATE_LIMIT_REQUESTS = 12
const RATE_LIMIT_WINDOW_MS = 60_000
const MAX_MESSAGE_CHARS = 500
const MAX_HISTORY_ITEMS = 6
const MAX_HISTORY_CHARS = 1000

type HistoryItem = { role: "user" | "assistant"; content: string }

// History comes from the client, so keep only well-formed user/assistant turns,
// cap how many we forward, and truncate each one.
function sanitizeHistory(history: unknown): HistoryItem[] {
  if (!Array.isArray(history)) return []
  return history
    .filter(
      (h): h is HistoryItem =>
        !!h &&
        (h.role === "user" || h.role === "assistant") &&
        typeof h.content === "string" &&
        h.content.trim().length > 0,
    )
    .slice(-MAX_HISTORY_ITEMS)
    .map((h) => ({ role: h.role, content: h.content.slice(0, MAX_HISTORY_CHARS) }))
}

interface ChatRequestBody {
  message: string
  history?: unknown
}

export async function POST(req: NextRequest) {
  const limit = rateLimit(getClientIp(req.headers), RATE_LIMIT_REQUESTS, RATE_LIMIT_WINDOW_MS)
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    )
  }

  try {
    const body = (await req.json()) as ChatRequestBody
    const userMessage = typeof body.message === "string" ? body.message.trim() : ""

    if (!userMessage) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    if (userMessage.length > MAX_MESSAGE_CHARS) {
      return NextResponse.json(
        { error: `Message is too long (max ${MAX_MESSAGE_CHARS} characters)` },
        { status: 400 },
      )
    }

    // Check for OpenAI API key; otherwise fall back to local portfolio engine (which also guards offensive inputs)
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json(getLocalPortfolioResponse(userMessage))
    }

    // 3. Dynamic system prompt with real-world date, time, persona & guardrails
    const dynamicSystemPrompt = buildDaveAiSystemPrompt()

    const messages = [
      { role: "system", content: dynamicSystemPrompt },
      ...sanitizeHistory(body.history),
      { role: "user", content: userMessage },
    ]

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.6,
        max_tokens: 400,
        // Strict schema: the model can only return known tools and real portfolio IDs
        response_format: { type: "json_schema", json_schema: buildResponseJsonSchema() },
      }),
    })

    if (!response.ok) {
      const detail = await response.text().catch(() => "")
      console.warn("OpenAI API call failed with status:", response.status, detail.slice(0, 400))
      return NextResponse.json(getLocalPortfolioResponse(userMessage))
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json(getLocalPortfolioResponse(userMessage))
    }

    try {
      const parsed = JSON.parse(content)
      const replyText = parsed.reply || "Note recorded in diary."
      return NextResponse.json({
        reply: replyText,
        actions: sanitizeActions(parsed.actions, replyText),
        source: "gpt-4o-mini",
      })
    } catch {
      return NextResponse.json(getLocalPortfolioResponse(userMessage))
    }
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(getLocalPortfolioResponse("who are you"), { status: 200 })
  }
}
