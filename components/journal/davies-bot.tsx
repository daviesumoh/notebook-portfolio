"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { Send, RotateCcw } from "lucide-react"
import { TabId, JOURNAL_BODY_TEXT_CLASS } from "./types"
import { getLocalPortfolioResponse } from "@/lib/davies-profile"
import {
  HIGHLIGHT_TARGETS,
  LINK_TARGETS,
  MEDIA_TARGETS,
  legacyToActions,
  sanitizeActions,
  type PortfolioAction,
} from "@/lib/portfolio-actions"

interface Message {
  id: string
  sender: "bot" | "user"
  text: string
  source?: string
  navTab?: TabId | null
  highlight?: string | null
  links?: { label: string; url: string }[]
}

interface DaviesBotProps {
  onNavigateTab?: (tab: TabId) => void
  onHighlightItem?: (item: string | null) => void
  onAction?: (tab?: TabId, highlight?: string) => void
  /** Runs DaveAI's tool calls (navigate, highlight, open_media, close_media) in the notebook. */
  onPortfolioActions?: (actions: PortfolioAction[]) => void
  initialQuery?: string
  initialQueryId?: number
  onClearInitialQuery?: () => void
  compact?: boolean
  highlightedItem?: string | null
  focusTrigger?: number
  shakeTrigger?: number
}

export default function DaviesBot({
  onNavigateTab,
  onHighlightItem,
  onAction,
  onPortfolioActions,
  initialQuery,
  initialQueryId,
  onClearInitialQuery,
  compact = false,
  highlightedItem,
  focusTrigger = 0,
  shakeTrigger = 0,
}: DaviesBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hey, I'm DaveAI. Ask anything or tell me to flip pages & highlight.",
    },
  ])

  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [botSource, setBotSource] = useState<string>("gpt-4o-mini")
  const [lastAction, setLastAction] = useState<{ tab: string; highlight?: string | null; verb?: string } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Motion controls for shaking the DaveAI dock on user command
  const daveAiControls = useAnimation()
  const [isShaking, setIsShaking] = useState(false)

  const triggerShake = async () => {
    setIsShaking(true)
    inputRef.current?.focus()
    await daveAiControls.start({
      x: [0, -14, 14, -10, 10, -6, 6, -3, 3, 0],
      rotate: [-0.6, 3, -3, 2, -2, 1, -1, 0, -0.6],
      scale: [1, 1.04, 1.02, 1.04, 1.01, 1],
      transition: { duration: 0.65, ease: "easeInOut" },
    })
    setIsShaking(false)
  }

  useEffect(() => {
    if (shakeTrigger > 0) {
      triggerShake()
    }
  }, [shakeTrigger])

  useEffect(() => {
    if (focusTrigger > 0) {
      inputRef.current?.focus()
    }
  }, [focusTrigger])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const lastProcessedQueryIdRef = useRef<number | string | null>(null)
  const isSendingRef = useRef(false)
  const lastSentQueryRef = useRef<{ query: string; time: number } | null>(null)

  useEffect(() => {
    if (!initialQuery || !initialQuery.trim()) return

    const queryKey = initialQueryId !== undefined ? initialQueryId : initialQuery.trim()
    if (lastProcessedQueryIdRef.current === queryKey) {
      return
    }

    lastProcessedQueryIdRef.current = queryKey
    handleSend(initialQuery.trim())
    if (onClearInitialQuery) {
      onClearInitialQuery()
    }
  }, [initialQuery, initialQueryId, onClearInitialQuery])

  const triggerNavigationAndHighlight = (tab?: TabId | null, highlight?: string | null) => {
    if (onAction && (tab || highlight)) {
      onAction(tab || undefined, highlight || undefined)
    } else {
      if (tab && onNavigateTab) onNavigateTab(tab)
      if (highlight && onHighlightItem) onHighlightItem(highlight)
    }

    if (tab || highlight) {
      setLastAction({ tab: tab || "current page", highlight })
    }
  }

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim()
    if (!query) return

    // Prevent duplicate concurrent / rapid repeated submissions (from double-clicks or double-mounted components)
    const now = Date.now()
    if (
      isSendingRef.current ||
      (lastSentQueryRef.current &&
        lastSentQueryRef.current.query === query &&
        now - lastSentQueryRef.current.time < 1800)
    ) {
      return
    }

    isSendingRef.current = true
    lastSentQueryRef.current = { query, time: now }

    const userMessage: Message = {
      id: "user-" + Date.now(),
      sender: "user",
      text: query,
    }

    setMessages((prev) => [...prev, userMessage])
    if (!textToSend) setInput("")
    setIsTyping(true)

    // Handle slash commands immediately
    if (query.startsWith("/")) {
      const cmd = query.replace("/", "").trim().toLowerCase()
      if (cmd === "cover" || cmd === "about" || cmd === "experience" || cmd === "projects" || cmd === "skills") {
        triggerNavigationAndHighlight(cmd as TabId, null)
        addBotReply(`Flipping straight to /${cmd}...`, "command", cmd as TabId)
        isSendingRef.current = false
        return
      }
      if (cmd === "clear") {
        setMessages([
          {
            id: "cleared",
            sender: "bot",
            text: "Diary log reset. Ask anything, or try the slash commands below.",
          },
        ])
        setIsTyping(false)
        isSendingRef.current = false
        return
      }
    }

    try {
      // Build conversation history (last 4 turns)
      const history = messages.slice(-4).map((m) => ({
        role: (m.sender === "user" ? "user" : "assistant") as "user" | "assistant",
        content: m.text,
      }))

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, history }),
      })

      if (res.status === 429) {
        const wait = Number(res.headers.get("Retry-After")) || 30
        addBotReply(`Easy there, too many questions at once. Try again in about ${wait}s.`, "local", null, null, [])
        return
      }

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`)
      }

      const data = await res.json()
      const source = data.source || "gpt-4o-mini"
      setBotSource(source)

      // Run the model's tool calls (flip, highlight, open media / albums) and collect link buttons
      let actions = sanitizeActions(data.actions, data.reply)
      if (actions.length === 0 && (data.navTab || data.highlight)) {
        actions = legacyToActions(data.navTab, data.highlight)
      }
      const links = applyPortfolioActions(actions)

      addBotReply(data.reply, source, null, null, links)
    } catch (err) {
      console.warn("Falling back to client handler:", err)
      // Client-side fallback if network or API error occurs
      fallbackLocalAnswer(query)
    } finally {
      isSendingRef.current = false
    }
  }

  // Executes tool calls through the notebook shell and returns clickable links for open_link actions
  const applyPortfolioActions = (actions: PortfolioAction[]) => {
    if (actions.length === 0) return []
    onPortfolioActions?.(actions)

    let tab: string | undefined
    let highlight: string | undefined
    let verb = "highlighted"
    for (const action of actions) {
      if (action.tool === "navigate") {
        tab = action.target
      } else if (action.tool === "highlight") {
        const target = HIGHLIGHT_TARGETS.find((t) => t.id === action.target)
        tab = target?.page ?? tab
        highlight = action.target
        verb = "highlighted"
      } else if (action.tool === "open_media") {
        const target = MEDIA_TARGETS.find((t) => t.id === action.target)
        tab = target?.page ?? tab
        highlight = target?.short
        verb = "opened"
      }
    }
    if (tab || highlight) setLastAction({ tab: tab ?? "current page", highlight, verb })

    const links: { label: string; url: string }[] = []
    for (const action of actions) {
      if (action.tool !== "open_link") continue
      const link = LINK_TARGETS.find((t) => t.id === action.target)
      if (link) links.push({ label: link.label, url: link.url })
    }
    return links
  }

  const fallbackLocalAnswer = (query: string) => {
    const result = getLocalPortfolioResponse(query)
    const links = applyPortfolioActions(result.actions)
    addBotReply(result.reply, "local-fallback", null, null, links)
  }

  const addBotReply = (
    text: string,
    source?: string,
    navTab?: TabId | null,
    highlight?: string | null,
    links?: { label: string; url: string }[]
  ) => {
    setIsTyping(false)
    setMessages((prev) => [
      ...prev,
      {
        id: "bot-" + Date.now(),
        sender: "bot",
        text: text.replace(/\*\*/g, ""),
        source,
        navTab,
        highlight,
        links: links && links.length > 0 ? links : undefined,
      },
    ])
  }

  return (
    <div className="h-full flex flex-col justify-between select-none">
      {/* Messages Log - Written Directly on the Ruled Lines */}
      <div className="flex-1 overflow-y-auto pt-8 pb-0 space-y-0 notebook-scroll [direction:rtl] [&>*]:[direction:ltr] pl-3 pr-0">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-4 mb-8">
            {/* Sender Label in Left Column */}
            <span className="w-16 flex-shrink-0 font-mono text-[11px] tracking-wider text-[#717188] h-[32px] flex items-center translate-y-[6px] select-none">
              {msg.sender === "user" ? "YOU" : "DaveAI"}
            </span>

            {/* Ink text written directly along the lines with Experience body typography */}
            <div className="flex-1 min-w-0 space-y-0 [overflow-wrap:anywhere]">
              <p
                className={`${JOURNAL_BODY_TEXT_CLASS} tracking-wide ${
                  msg.sender === "user"
                    ? "text-[#1E40AF]" // Blue ink for user
                    : "text-[#181824]" // Dark ink for bot
                }`}
              >
                {msg.text}
              </p>
              {msg.links && (
                <div className="flex flex-wrap gap-x-4">
                  {msg.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target={link.url.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className={`${JOURNAL_BODY_TEXT_CLASS} text-[#1E40AF] underline decoration-dotted underline-offset-4 hover:text-black transition-colors`}
                    >
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-baseline gap-4 h-[32px] leading-[32px] translate-y-[6px]">
            <span className="w-16 flex-shrink-0 font-mono text-[11px] tracking-wider text-[#717188]">
              DaveAI
            </span>
            <span className={`${JOURNAL_BODY_TEXT_CLASS} !translate-y-0 text-[#717188] italic flex items-center gap-1.5`}>
              <span>writing note...</span>
              <span className="inline-block animate-bounce">🖋️</span>
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ============================================================== */}
      {/* PROMINENT STICKY NOTE CHAT DOCK (REQUESTED BY USER) */}
      {/* Tactile Canary Yellow Sticky Note with Scotch Tape & Pen Input */}
      {/* ============================================================== */}
      <motion.div
        animate={daveAiControls}
        initial={{ rotate: -0.6 }}
        whileHover={{ scale: 1.01, rotate: 0 }}
        className={`relative mt-2 p-3 w-full min-w-0 bg-[#FEF9C3] border border-amber-300/80 rounded-lg shadow-md select-none z-20 transition-all ${
          isShaking ? "ring-2 ring-amber-400 shadow-xl" : "hover:shadow-lg"
        }`}
      >
        
        {/* Semi-translucent Scotch Tape on Top Center */}
        <div className="scotch-tape -top-2.5 left-1/2 -translate-x-1/2 w-16 rotate-[-1deg]" />

        {/* Sticky Note Header: Title */}
        <div className="flex items-center justify-between pb-1.5 border-b border-amber-200/90 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">📌</span>
            <span className="font-mono text-[10px] font-bold text-amber-950 tracking-wider">
              Ask DaveAI anything about me!
            </span>
          </div>
          <button
            onClick={() => {
              setMessages([
                {
                  id: "reset",
                  sender: "bot",
                  text: "Diary log reset. Ask anything or tell me to flip pages & highlight.",
                },
              ])
              setLastAction(null)
            }}
            title="Reset diary log"
            aria-label="Reset diary log"
            className="p-0.5 rounded text-amber-800/75 hover:text-amber-950 transition-colors"
          >
            <RotateCcw size={11} />
          </button>
        </div>

        {/* Dynamic Page Flip & Highlight Notification Banner */}
        {lastAction && (
          <div className="mb-2 bg-white/90 border border-amber-300/90 rounded px-2.5 py-1 text-[11px] font-mono text-amber-900 flex items-center justify-between shadow-2xs animate-fadeIn">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="flex-shrink-0">📖</span>
              <span className="truncate">
                Flipped to <strong>{lastAction.tab}</strong>
                {lastAction.highlight && (
                  <> &amp; {lastAction.verb ?? "highlighted"} <mark className="bg-yellow-200/90 px-1 rounded font-bold">{lastAction.highlight}</mark></>
                )}
              </span>
            </div>
            <button
              onClick={() => setLastAction(null)}
              className="text-amber-700 hover:text-black text-[10px] ml-2 flex-shrink-0"
              title="Dismiss note"
            >
              ✕
            </button>
          </div>
        )}

        {/* Quick Question Sticky Flags */}
        <div className="flex flex-wrap items-center gap-1.5 py-0.5 mb-2">
          <span className="text-[9px] font-mono text-amber-800 uppercase tracking-wider flex-shrink-0 font-bold">
            QUICK -
          </span>
          {[
            { label: '"whats GitCloud?"', query: "whats GitCloud?" },
            { label: '"VoiceAI for Claude Code?"', query: "tell me about VoiceAI for Claude Code" },
            { label: '"Fun fact"', query: "give me a fun fact about Davies" },
            { label: '"Building MockQ?"', query: "tell me about Building MockQ" },
            { label: '"My Fav Food?"', query: "what is Davies' favorite food?" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => handleSend(item.query)}
              className="font-script text-xs bg-white/80 hover:bg-white text-amber-950 px-2 py-0.5 rounded border border-amber-300/70 shadow-2xs whitespace-nowrap transition-all active:scale-95"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Prominent Handwriting Pen Input Field */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="bg-white/95 border border-amber-300/90 rounded-md p-1.5 w-full min-w-0 flex items-center gap-1.5 sm:gap-2 shadow-inner overflow-hidden focus-within:ring-2 focus-within:ring-amber-400"
        >
          <span className="text-sm pl-1 select-none flex-shrink-0">🖋️</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ask or command (e.g. 'flip to projects & highlight crypto')..."
            className="flex-1 min-w-0 w-0 bg-transparent border-none text-base sm:text-lg font-script text-[#1E40AF] placeholder:text-amber-900/40 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-[#181824] hover:bg-black text-white px-2.5 py-1 rounded font-mono text-[11px] font-bold flex items-center gap-1 shadow-sm disabled:opacity-30 transition-all flex-shrink-0"
            aria-label="Send message"
          >
            <span>Send</span>
            <Send size={11} />
          </button>
        </form>

      </motion.div>

    </div>
  )
}
