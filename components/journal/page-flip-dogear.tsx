"use client"

import React from "react"
import { motion } from "framer-motion"

interface PageFlipDogEarProps {
  pageNum: string // e.g. "p.02", "cover", "p.01"
  label: string // e.g. "experience", "cover", "about", "projects"
  onClick: () => void
  pressedKey?: "left" | "right" | null
  ariaLabel?: string
  bottomOffset?: number
}

export default function PageFlipDogEar({
  pageNum,
  label,
  onClick,
  pressedKey,
  ariaLabel,
  bottomOffset = 0,
}: PageFlipDogEarProps) {
  const cleanKey = `forward-${pageNum.replace(/[^a-zA-Z0-9]/g, "")}`
  const filterId = `fold-shadow-${cleanKey}`
  const flapGradId = `flap-grad-${cleanKey}`
  const underGradId = `under-grad-${cleanKey}`
  const isKeyPressed = pressedKey === "right"

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="absolute bottom-0 right-0 z-30 flex items-end gap-2 pointer-events-none group select-none"
      aria-label={ariaLabel || `Flip forward to ${label}`}
      title={`Next page: ${label} (or press → Arrow)`}
    >
      {/* Handwritten Arrow Hint snapped onto the last complete ruled line */}
      <div
        style={{ marginBottom: bottomOffset }}
        className="pointer-events-auto cursor-pointer h-[32px] flex items-center gap-1 sm:gap-1.5 font-script text-sm sm:text-base text-[#181824] translate-y-[1px] group-hover:text-black transition-colors pr-1 whitespace-nowrap"
      >
        <span className="hidden sm:inline opacity-75 group-hover:opacity-100">arrow key</span>
        <kbd
          className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded border shadow-xs transition-all leading-none ${
            isKeyPressed
              ? "bg-black text-white border-black scale-95"
              : "bg-black/5 border-black/15 text-[#181824] group-hover:bg-black group-hover:text-white"
          }`}
        >
          →
        </kbd>
        <span className="font-semibold text-sm sm:text-base">({label})</span>
      </div>

      {/* Curled Paper Dog-Ear Corner */}
      <div className="pointer-events-auto cursor-pointer w-16 h-16 sm:w-24 sm:h-24 flex-shrink-0 relative">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-md">
          <defs>
            <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="-3" dy="-3" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.22" />
            </filter>
            <linearGradient id={flapGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#FAF7F0" />
              <stop offset="70%" stopColor="#ECE4D0" />
              <stop offset="100%" stopColor="#D8CDAE" />
            </linearGradient>
            <linearGradient id={underGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FAF7F0" />
              <stop offset="100%" stopColor="#ECE6D8" />
            </linearGradient>
          </defs>

          {/* Revealed paper underneath (bottom-right triangle) */}
          <polygon points="0,100 100,0 100,100" fill={`url(#${underGradId})`} />
          <line x1="72" y1="28" x2="100" y2="28" stroke="rgba(59, 130, 246, 0.25)" strokeWidth="1.2" />
          <line x1="44" y1="56" x2="100" y2="56" stroke="rgba(59, 130, 246, 0.25)" strokeWidth="1.2" />
          <line x1="16" y1="84" x2="100" y2="84" stroke="rgba(59, 130, 246, 0.25)" strokeWidth="1.2" />

          {/* Revealed target page number */}
          <text
            x="70"
            y="93"
            fill="#78716C"
            fontSize={pageNum.length > 3 ? "8.5" : "10"}
            fontFamily="JetBrains Mono, monospace"
            fontWeight="700"
            textAnchor="middle"
          >
            {pageNum}
          </text>

          {/* Folded paper flap */}
          <polygon
            points="0,100 100,0 0,0"
            fill={`url(#${flapGradId})`}
            filter={`url(#${filterId})`}
            stroke="#D0C6AF"
            strokeWidth="0.8"
            className="group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform duration-200"
          />
          <line x1="0" y1="100" x2="100" y2="0" stroke="#C2B8A3" strokeWidth="1.4" />
        </svg>
      </div>
    </motion.button>
  )
}
