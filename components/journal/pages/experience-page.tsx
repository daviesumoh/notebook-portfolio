"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { MediaModalItem } from "../media-modal"
import { JOURNAL_BODY_TEXT_CLASS, JOURNAL_SUBHEADING_TEXT_CLASS } from "../types"
import { EXPERIENCES, type ExperienceEntry } from "@/lib/portfolio-config"

export { EXPERIENCES }

interface DragBounds {
  left: number
  right: number
  top: number
  bottom: number
}

interface ExperiencePageProps {
  onOpenMedia: (media: MediaModalItem) => void
  onNavigateTab: (tab: any) => void
  highlightedItem?: string | null
}

export default function ExperiencePage({ onOpenMedia, onNavigateTab, highlightedItem }: ExperiencePageProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const thumbRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const isDraggingThumbRef = useRef(false)
  const nextZRef = useRef(30)
  const [dragBounds, setDragBounds] = useState<Record<string, DragBounds>>({})
  const [zOrders, setZOrders] = useState<Record<string, number>>({})

  useEffect(() => {
    if (highlightedItem) {
      const targetId = `exp-${highlightedItem.toLowerCase()}`
      const el = document.getElementById(targetId)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [highlightedItem])

  // Measure drag bounds after the 0.45s 3D page-flip settles so rotateY(70deg) doesn't clamp bounds.
  useEffect(() => {
    const computeBounds = () => {
      const scroller = scrollerRef.current
      const content = containerRef.current
      if (!scroller || !content) return
      const sRect = scroller.getBoundingClientRect()
      const cRect = content.getBoundingClientRect()
      if (sRect.width < 100) return

      const next: Record<string, DragBounds> = {}
      Object.entries(thumbRefs.current).forEach(([id, el]) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        next[id] = {
          left: Math.round(sRect.left + 8 - r.left),
          right: Math.max(0, Math.round(sRect.right - 4 - r.right)),
          top: Math.round(cRect.top - r.top),
          bottom: Math.max(0, Math.round(Math.max(cRect.bottom, sRect.bottom - 8) - r.bottom)),
        }
      })
      setDragBounds(next)
    }

    const timer = setTimeout(computeBounds, 520)
    const syncVideoPlayback = () => {
      const videos = document.querySelectorAll<HTMLVideoElement>("[data-exp-thumb-video='true']")
      videos.forEach((v) => {
        v.muted = true
        if (v.offsetParent === null) {
          v.pause()
        } else if (v.paused) {
          v.play().catch(() => {})
        }
      })
    }
    const videoTimer = setTimeout(syncVideoPlayback, 80)
    window.addEventListener("resize", computeBounds)
    window.addEventListener("resize", syncVideoPlayback)
    return () => {
      clearTimeout(timer)
      clearTimeout(videoTimer)
      window.removeEventListener("resize", computeBounds)
      window.removeEventListener("resize", syncVideoPlayback)
    }
  }, [])

  const experiences = EXPERIENCES

  const renderMediaThumb = (exp: ExperienceEntry, idx: number, isDesktop: boolean) => {
    if (!exp.media) return null
    const media = exp.media
    const cardLabel = media.cardTitle || media.title
    return (
      <motion.div
        ref={
          isDesktop
            ? (el) => {
                thumbRefs.current[exp.id] = el
              }
            : undefined
        }
        drag={isDesktop}
        dragConstraints={
          isDesktop ? (dragBounds[exp.id] ?? { left: -420, right: 0, top: -400, bottom: 260 }) : undefined
        }
        dragElastic={0.06}
        dragMomentum={false}
        whileDrag={isDesktop ? { scale: 1.06, zIndex: 50 } : undefined}
        onDragStart={() => {
          isDraggingThumbRef.current = true
          nextZRef.current += 1
          const z = nextZRef.current
          setZOrders((prev) => ({ ...prev, [exp.id]: z }))
        }}
        onDragEnd={() => {
          setTimeout(() => {
            isDraggingThumbRef.current = false
          }, 80)
        }}
        className={`flex-shrink-0 ${isDesktop ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}`}
      >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{
            repeat: Infinity,
            duration: 4.5,
            delay: idx * 0.45,
            ease: "easeInOut",
          }}
        >
          <motion.div
            initial={{ rotate: isDesktop ? (exp.thumbRotate ?? 0) : 0 }}
            whileHover={{ rotate: 0, scale: 1.04 }}
            className="group relative"
          >
            {media.type === "album" && (
              <>
                {[
                  {
                    src: "/photos/startup-summit.jpg",
                    alt: "GitCloud StartUp Summit preview",
                    baseClass: isDesktop
                      ? "rotate-[5.5deg] translate-x-[4px] translate-y-[4px] group-hover:rotate-[9deg] group-hover:translate-x-[7px] group-hover:translate-y-[6px]"
                      : "rotate-[5deg] translate-x-[4px] translate-y-[3px]",
                  },
                  {
                    src: "/photos/intuit-kickoff.jpg",
                    alt: "Intuit x GitCloud preview",
                    baseClass: isDesktop
                      ? "-rotate-[5deg] -translate-x-[4px] translate-y-[4px] group-hover:-rotate-[8.5deg] group-hover:-translate-x-[7px] group-hover:translate-y-[6px]"
                      : "-rotate-[4.5deg] -translate-x-[4px] translate-y-[3px]",
                  },
                ].map((underCard, uIdx) => (
                  <div
                    key={underCard.src}
                    aria-hidden="true"
                    style={{ zIndex: uIdx + 1 }}
                    className={`pointer-events-none absolute inset-0 rounded-xs bg-white p-1.5 pb-1.5 sm:pb-2 border border-black/15 shadow-sm transition-transform duration-300 ease-out ${underCard.baseClass}`}
                  >
                    <div
                      className={`w-full rounded-[2px] overflow-hidden bg-[#F8F5EE] ${
                        isDesktop
                          ? `${exp.thumbMediaClass || "h-[62px] lg:h-[78px]"}`
                          : "h-[58px]"
                      }`}
                    >
                      <img
                        src={underCard.src}
                        alt={underCard.alt}
                        className="w-full h-full object-cover opacity-90"
                      />
                    </div>
                  </div>
                ))}
              </>
            )}
            <button
              type="button"
              onClick={() => {
                if (isDraggingThumbRef.current) return
                onOpenMedia(media)
              }}
              aria-label={`View ${cardLabel}`}
              title={cardLabel}
              className={`relative z-10 rounded-xs bg-white p-1.5 pb-1.5 sm:pb-2 border border-black/15 shadow-sm hover:shadow-md transition-shadow flex-shrink-0 block ${
                isDesktop
                  ? `${exp.thumbWidthClass || "w-[102px] lg:w-[104px] min-[1400px]:w-[150px]"} cursor-grab active:cursor-grabbing`
                  : "w-[114px] cursor-pointer"
              }`}
            >
              <div
                className={`scotch-tape -top-2.5 ${
                  exp.id === "elise" ? "left-[36%] w-10" : "left-1/2 w-12"
                } -translate-x-1/2 bg-white/75 rotate-[-1deg]`}
              />
              <div
                className={`w-full rounded-[2px] overflow-hidden relative ${
                  isDesktop
                    ? `${exp.thumbMediaClass || "h-[62px] lg:h-[78px]"}`
                    : "h-[58px]"
                } ${media.type === "video" ? "bg-[#18181B]" : "bg-[#F8F5EE]"}`}
              >
              {media.type === "video" ? (
                <video
                  data-exp-thumb-video="true"
                  src={media.src}
                  preload="auto"
                  autoPlay
                  loop
                  muted
                  playsInline
                  onLoadedData={(e) => {
                    const v = e.currentTarget
                    v.muted = true
                    if (v.offsetParent === null) {
                      v.pause()
                      return
                    }
                    v.play().catch(() => {})
                  }}
                  className="w-full h-full object-cover pointer-events-none"
                />
              ) : (
                <img
                  src={media.src}
                  alt={media.title}
                  className={`w-full h-full pointer-events-none ${
                    media.src.endsWith(".avif") ? "object-contain p-0.5" : "object-cover"
                  }`}
                />
              )}
            </div>
            <span className="block font-script text-[10px] sm:text-[10.5px] min-[1500px]:text-[11px] text-center text-[#181824] mt-1 font-semibold leading-tight tracking-tight">
              {cardLabel}
            </span>
          </button>
          </motion.div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="h-full flex flex-col justify-between pl-4 sm:pl-6 lg:pl-7 pr-2 sm:pr-4 lg:pr-5 py-0 relative select-none">
      {/* Main Experience Stream - Scrollbar on Left side */}
      <div
        ref={scrollerRef}
        className="flex-1 overflow-y-auto pt-0 pb-0 notebook-scroll [direction:rtl] [&>*]:[direction:ltr] pl-3 pr-3 sm:pr-4"
      >
        
        {/* Page Title in Calligraphic Ink */}
        <h1 className="font-script text-4xl font-bold text-[#181824] h-[32px] !leading-[32px] mb-8 translate-y-[6px] tracking-tight">
          Experience
        </h1>

        {/* Roles List - NO CONTAINERS, Sitting on the Lines */}
        <div ref={containerRef} className="pb-12 min-[1400px]:pb-8">
          {experiences.map((exp, idx) => {
            const isHighlighted = highlightedItem?.toLowerCase() === exp.id
            const thumbZ = zOrders[exp.id]
            return (
              <div
                key={exp.id}
                id={`exp-${exp.id}`}
                style={thumbZ ? { zIndex: thumbZ } : undefined}
                className={`mb-7 sm:mb-8 last:mb-0 transition-all duration-500 rounded-lg relative sm:flex sm:items-start sm:justify-between sm:gap-3 lg:gap-4 ${
                  isHighlighted
                    ? "bg-[#FEF08A]/80 ring-2 ring-amber-400 px-2 -mx-2 shadow-sm animate-fadeIn"
                    : ""
                }`}
              >
                <div className="min-w-0 w-full sm:flex-1">
                  {/* Highlighter Marker Tag */}
                  {isHighlighted && (
                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-950 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-full w-fit mb-1 shadow-2xs">
                      <span>🖍️</span>
                      <span>HIGHLIGHTED BY DaveAI</span>
                    </div>
                  )}

                  {/* Header Row: Company Logo — Job Title on Left, Date & Location on Right */}
                  <div className="flex flex-wrap items-center justify-between gap-x-2 min-h-[32px] translate-y-[4px]">
                    <div className="flex items-center gap-2 min-w-0">
                      {exp.logo ? (
                        <div className="h-[28px] flex items-center justify-start gap-1.5 flex-shrink-0">
                          <img
                            src={exp.logo}
                            alt={exp.company}
                            style={{
                              height: exp.logoHeight || 18,
                              transform: exp.logoOffsetY ? `translateY(${exp.logoOffsetY}px)` : undefined,
                            }}
                            className="w-auto max-h-[28px] object-contain"
                          />
                          {exp.logoLabel && (
                            <span className={`${JOURNAL_SUBHEADING_TEXT_CLASS} font-normal text-[#181824] normal-case`}>
                              {exp.logoLabel}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div
                          style={{ backgroundColor: exp.iconBg }}
                          className="w-5 h-5 rounded-md overflow-hidden flex items-center justify-center flex-shrink-0 shadow-2xs"
                        >
                          <span className="text-white font-mono text-[9px] font-bold">
                            {exp.iconText}
                          </span>
                        </div>
                      )}
                      <span className={`${JOURNAL_SUBHEADING_TEXT_CLASS} font-normal text-[#181824]`}>
                        — {exp.role}
                      </span>
                    </div>

                    <span className="font-mono text-[10px] sm:text-[10.5px] uppercase tracking-wider text-[#717188] whitespace-nowrap">
                      {exp.period}
                    </span>
                  </div>

                  {/* Single narrative line written directly across the paper (Seb-style) */}
                  <p className={`${JOURNAL_BODY_TEXT_CLASS} text-[#2D2D3F]`}>
                    {exp.narrative}
                  </p>
                </div>

                {/* Right-gutter floating & movable media container from sm+ (640px+), anchored strictly inside scroller bounds so cards never clip */}
                {exp.media && (
                  <div
                    className={`hidden sm:flex flex-shrink-0 justify-end sm:h-0 overflow-visible ${
                      exp.id === "elise" ? "pt-3 lg:pt-5" : exp.id === "trimble" ? "pt-1 lg:pt-0 -mt-1" : "pt-2 lg:pt-3"
                    }`}
                  >
                    {renderMediaThumb(exp, idx, true)}
                  </div>
                )}

                {/* Ultra-narrow mobile inline media preview (< 640px) */}
                {exp.media && (
                  <div className="flex sm:hidden justify-end mt-2">
                    {renderMediaThumb(exp, idx, false)}
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>

    </div>
  )
}


