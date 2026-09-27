import { NextRequest, NextResponse } from "next/server"
import {
  buildDaveAiSystemPrompt,
  getLocalPortfolioResponse,
} from "@/lib/davies-profile"
import { buildResponseJsonSchema, sanitizeActions } from "@/lib/portfolio-actions"

interface ChatRequestBody {
  message: string
  history?: { role: "user" | "assistant"; content: string }[]
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequestBody
    const userMessage = body.message?.trim()

    if (!userMessage) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
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
      ...(body.history || []).map((h) => ({
        role: h.role,
        content: h.content,
      })),
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
