"use client"

import React, { useState, useEffect, useLayoutEffect, useRef } from "react"
import Link from "next/link"
import { motion, useAnimation } from "framer-motion"
import { TabId } from "../types"
import { MediaModalItem } from "../media-modal"
import {
  COVER_PHOTOS,
  DAVIES_PORTRAIT_SRC,
  MCMASTER_TALK_PHOTO,
  OWNER_INFO,
  type ScrapbookPhoto,
} from "@/lib/portfolio-config"

export { COVER_PHOTOS, DAVIES_PORTRAIT_SRC, MCMASTER_TALK_PHOTO }

interface CoverPageProps {
  onOpenDiary: (tab: TabId, initialQuery?: string) => void
  onOpenMedia?: (media: MediaModalItem) => void
  highlightedItem?: string | null
  shakeDaveAiTrigger?: number
}

interface DragBounds {
  left: number
  right: number
  top: number
  bottom: number
}

const SPECIALTIES = OWNER_INFO.specialties

export default function CoverPage({
  onOpenDiary,
  onOpenMedia,
  highlightedItem,
  shakeDaveAiTrigger = 0,
}: CoverPageProps) {
  const coverRef = useRef<HTMLDivElement>(null)
  const isDraggingPhotoRef = useRef(false)
  const dragItemRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [coverSize, setCoverSize] = useState<{ width: number; height: number } | null>(null)
  const [dragBounds, setDragBounds] = useState<Record<string, DragBounds>>({})
  const isMockqHighlighted = highlightedItem?.toLowerCase() === "mockq"
  const isSodaHighlighted = highlightedItem?.toLowerCase() === "soda"

  // Track Cover container layout dimensions (unaffected by 3D flip rotateY) for smooth zoom scaling
  useLayoutEffect(() => {
    const el = coverRef.current
    if (!el) return
    const updateSize = () => {
      const width = el.clientWidth
      const height = el.clientHeight
      if (width > 0 && height > 0) {
        setCoverSize((prev) =>
          prev && prev.width === width && prev.height === height ? prev : { width, height }
        )
      }
    }
    updateSize()
    const observer = new ResizeObserver(updateSize)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const desktopScale = coverSize
    ? Math.min(Math.max(Math.min(coverSize.width / 1210, coverSize.height / 850), 0.63), 1.08)
    : 0.92

  const flowScale = coverSize
    ? Math.min(Math.max(Math.min(coverSize.width / 1060, coverSize.height / 820), 0.52), 0.74)
    : 0.64

  // Measure relative drag bounds after the 0.45s 3D page-flip settles so rotateY(70deg) never catapults cards
  useEffect(() => {
    const computeBounds = () => {
      const container = coverRef.current
      if (!container) return
      const cRect = container.getBoundingClientRect()
      if (cRect.width < 100) return
      const effectiveBottom = Math.max(
        cRect.bottom,
        cRect.top + container.scrollHeight - container.scrollTop
      )

      const next: Record<string, DragBounds> = {}
      Object.entries(dragItemRefs.current).forEach(([key, el]) => {
        if (!el || el.offsetParent === null) return
        const r = el.getBoundingClientRect()
        if (r.width < 10) return

        const matrix = new DOMMatrix(getComputedStyle(el).transform)
        const restLeft = r.left - matrix.m41
        const restRight = r.right - matrix.m41
        const restTop = r.top - matrix.m42
        const restBottom = r.bottom - matrix.m42

        const isDavies = key.endsWith("davies-realia")
        const scale = key.startsWith("desktop-") ? desktopScale : flowScale
        const leftPad = isDavies ? Math.round(92 * scale) : 8
        const rightPad = isDavies ? Math.round(32 * scale) : 8
        const topPad = isDavies ? Math.round(20 * scale) : 8
        const bottomPad = isDavies ? Math.round(48 * scale) : 8

        next[key] = {
          left: Math.min(0, Math.round(cRect.left + leftPad - restLeft)),
          right: Math.max(0, Math.round(cRect.right - rightPad - restRight)),
          top: Math.min(0, Math.round(cRect.top + topPad - restTop)),
          bottom: Math.max(0, Math.round(effectiveBottom - bottomPad - restBottom)),
        }
      })
      setDragBounds(next)
    }

    const flipTimer = setTimeout(computeBounds, 540)
    window.addEventListener("resize", computeBounds)
    return () => {
      clearTimeout(flipTimer)
      window.removeEventListener("resize", computeBounds)
    }
  }, [coverSize, desktopScale, flowScale])

  // Controls for shaking the DaveAI note on the cover
  const daveAiControls = useAnimation()
  const [isShaking, setIsShaking] = useState(false)

  // Typewriter state for rotating specialties without typing cursor
  const [specialtyIndex, setSpecialtyIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(SPECIALTIES[0].length)
  const [isDeleting, setIsDeleting] = useState(false)

  // Live Toronto Date & Time stamp for cover
  const [torontoDate, setTorontoDate] = useState<string>("Nov 10")
  const [torontoTime, setTorontoTime] = useState<string>("1:18 PM")

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      setTorontoDate(
        now.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          timeZone: "America/Toronto",
        })
      )
      setTorontoTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          timeZone: "America/Toronto",
        })
      )
    }
    updateDateTime()
    const timer = setInterval(updateDateTime, 10000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const currentWord = SPECIALTIES[specialtyIndex]

    if (isDeleting && subIndex === 0) {
      setIsDeleting(false)
      setSpecialtyIndex((prev) => (prev + 1) % SPECIALTIES.length)
      return
    }

    if (!isDeleting && subIndex === currentWord.length) {
      const timeout = setTimeout(() => {
        setIsDeleting(true)
      }, 2200)
      return () => clearTimeout(timeout)
    }

    const delay = isDeleting ? 38 : 65
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1))
    }, delay)

    return () => clearTimeout(timeout)
  }, [subIndex, isDeleting, specialtyIndex])

  const triggerShake = async () => {
    setIsShaking(true)
    await daveAiControls.start({
      x: [0, -14, 14, -10, 10, -6, 6, -3, 3, 0],
      rotate: [-0.6, 3, -3, 2, -2, 1, -1, 0, -0.6],
      scale: [1, 1.04, 1.02, 1.04, 1.01, 1],
      transition: { duration: 0.65, ease: "easeInOut" },
    })
    setIsShaking(false)
  }

  // Trigger shake when parent requests it (e.g. user clicked "Ask DaveAI" tab or shortcut)
  useEffect(() => {
    if (shakeDaveAiTrigger > 0) {
      triggerShake()
    }
  }, [shakeDaveAiTrigger])

  const renderScrapbookPolaroid = (
    photo: ScrapbookPhoto,
    dragKey: string,
    scale: number,
    positionClass = "relative",
    positionStyle?: React.CSSProperties,
    draggable = true,
    floatDelay = 0
  ) => {
    const scaledWidth = Math.round(photo.cardWidth * scale)
    const scaledHeight = Math.round(photo.cardHeight * scale)
    const defaultBounds: DragBounds = dragKey.startsWith("desktop-")
      ? { left: -90, right: 650, top: -80, bottom: 260 }
      : { left: -160, right: 260, top: -180, bottom: 160 }

    return (
      <motion.div
        key={dragKey}
        ref={(el) => {
          if (draggable) dragItemRefs.current[dragKey] = el
        }}
        drag={draggable}
        dragConstraints={draggable ? (dragBounds[dragKey] ?? defaultBounds) : undefined}
        dragElastic={0.06}
        dragMomentum={false}
        whileDrag={draggable ? { scale: 1.05, zIndex: 50 } : undefined}
        onDragStart={() => {
          isDraggingPhotoRef.current = true
        }}
        onDragEnd={() => {
          setTimeout(() => {
            isDraggingPhotoRef.current = false
          }, 80)
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (isDraggingPhotoRef.current) return
          onOpenMedia?.({
            type: "image",
            src: photo.src,
            title: photo.title,
            description: photo.description,
          })
        }}
        style={{
          width: scaledWidth,
          height: scaledHeight,
          ...positionStyle,
        }}
        className={`pointer-events-auto flex-shrink-0 ${
          draggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
        } ${positionClass}`}
      >
        <div
          style={{
            width: photo.cardWidth,
            height: photo.cardHeight,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <motion.div
            animate={draggable ? { y: [0, -5, 0] } : undefined}
            transition={
              draggable
                ? {
                    repeat: Infinity,
                    duration: 4.5,
                    delay: floatDelay,
                    ease: "easeInOut",
                  }
                : undefined
            }
          >
            <motion.div
              initial={{ rotate: photo.rotate }}
              whileHover={{ rotate: 0, scale: 1.04 }}
              style={{ width: photo.cardWidth }}
              className="bg-white p-2 pb-3 rounded-xs shadow-lg border border-black/10 transition-shadow hover:shadow-xl"
            >
              <div className="scotch-tape -top-2 left-1/3 w-12 bg-white/75 rotate-[-1deg]" />
              <div className="w-full bg-[#18181B] rounded-xs overflow-hidden">
                <img src={photo.src} alt={photo.alt} className={photo.imgClass} />
              </div>
              <p className="font-script text-sm text-center text-[#181824] mt-1 font-semibold leading-tight">
                {photo.caption}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  /** Renders the draggable Davies Umoh Polaroid + layered sticky notes scaled cleanly without CSS scale on the drag node. */
  const renderDaviesRealia = (
    dragKey: string,
    scale: number,
    positionClass: string,
    positionStyle?: React.CSSProperties
  ) => {
    const baseWidth = 185
    const baseHeight = 361
    const defaultBounds: DragBounds = dragKey.startsWith("desktop-")
      ? { left: -620, right: 24, top: -90, bottom: 220 }
      : { left: -240, right: 40, top: -180, bottom: 120 }

    return (
      <motion.div
        key={dragKey}
        ref={(el) => {
          dragItemRefs.current[dragKey] = el
        }}
        drag
        dragConstraints={dragBounds[dragKey] ?? defaultBounds}
        dragElastic={0.06}
        dragMomentum={false}
        whileDrag={{ scale: 1.03, zIndex: 50 }}
        onDragStart={() => {
          isDraggingPhotoRef.current = true
        }}
        onDragEnd={() => {
          setTimeout(() => {
            isDraggingPhotoRef.current = false
          }, 80)
        }}
        style={{
          width: Math.round(baseWidth * scale),
          height: Math.round(baseHeight * scale),
          ...positionStyle,
        }}
        className={`cursor-grab active:cursor-grabbing select-none flex-shrink-0 ${positionClass}`}
      >
        <div
          style={{
            width: baseWidth,
            height: baseHeight,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {/* Gentle Idle Floating Motion */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{
              repeat: Infinity,
              duration: 4.5,
              ease: "easeInOut",
            }}
            className="flex flex-col items-center justify-center"
          >
            {/* Top Taped Note (shipping note) */}
            <motion.div
              initial={{ rotate: -2 }}
              whileHover={{ rotate: 0, scale: 1.02 }}
              className="w-[185px] bg-[#FFFDF9] border border-[#E7E3D8] shadow-sm p-2.5 rounded-xs relative z-40 mb-2.5 transition-transform duration-200"
            >
              <div className="scotch-tape -top-2.5 left-1/3 w-14 rotate-[-1deg]" />
              <p className="font-script text-xs text-[#78716C] mb-0.5">now shipping:</p>
              <p className="font-script text-base font-bold text-[#1A1A2E] leading-tight">
                EliseAI
              </p>
              <p className="text-[11px] font-script text-[#57534E] mt-0.5 leading-tight">
                VoiceAI &amp; CRM
              </p>
            </motion.div>

            {/* Polaroid Photo of Davies + Sticky Notes */}
            <div className="relative flex justify-center items-center mt-1">
              {/* Yellow Sticky Note: MockQ with $42k in Dev Funding */}
              <motion.div
                initial={{ rotate: -5 }}
                whileHover={{ rotate: 0, scale: 1.05 }}
                className={`absolute -top-6 -left-[64px] w-[140px] bg-[#FEF08A] p-2.5 rounded-xs shadow-md z-30 cursor-pointer border border-[#FACC15]/40 transition-all duration-200 ${
                  isMockqHighlighted ? "ring-3 ring-amber-500 scale-105 shadow-xl" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  if (isDraggingPhotoRef.current) return
                  onOpenDiary("experience", "tell me about MockQ")
                }}
              >
                <div className="scotch-tape -top-2 left-1/4 w-10 rotate-[-2deg]" />
                <p className="font-mono text-[9px] uppercase tracking-wider text-[#854D0E] font-bold">
                  BUILDING
                </p>
                <p className="font-script text-base font-bold text-[#422006] mt-0.5 leading-tight">
                  MockQ AI
                </p>
                <p className="text-[10px] text-[#713F12] mt-0.5 font-script leading-tight">
                  $42k in Dev Funding
                </p>
              </motion.div>

              {/* Crisp Polaroid Frame */}
              <motion.div
                initial={{ rotate: 3 }}
                whileHover={{ rotate: 0, scale: 1.02 }}
                className="bg-white p-2.5 pb-4 rounded-xs shadow-xl border border-black/10 w-[185px] relative z-20 transition-transform duration-200"
              >
                <div className="scotch-tape -top-2.5 left-1/4 w-16 bg-white/70 border-white/50 rotate-1" />
                <div className="w-full h-[175px] bg-[#27272A] rounded-xs overflow-hidden relative">
                  <img
                    src={DAVIES_PORTRAIT_SRC}
                    alt="Davies Umoh"
                    className="w-full h-full object-cover pointer-events-none"
                  />
                </div>
                <p className="font-script text-xl text-center text-[#181824] mt-1 font-semibold pointer-events-none">
                  Davies Umoh
                </p>
                <p className="font-mono text-[9px] text-center text-[#78716C] tracking-wider uppercase pointer-events-none">
                  Toronto, CA
                </p>
              </motion.div>

              {/* McMaster Talk Polaroid layered on top at bottom-left of Davies Umoh picture */}
              {renderScrapbookPolaroid(
                MCMASTER_TALK_PHOTO,
                `${dragKey}-mcmaster`,
                1,
                "absolute top-[64%] -left-[88px] z-30",
                undefined,
                false
              )}

              {/* Cyan Sticky Note: Soda Data */}
              <motion.div
                initial={{ rotate: 6 }}
                whileHover={{ rotate: 0, scale: 1.05 }}
                className={`absolute top-[85%] -right-8 w-[140px] bg-[#CFFAFE] p-2.5 rounded-xs shadow-md z-30 cursor-pointer border border-[#7DD3FC]/40 transition-all duration-200 ${
                  isSodaHighlighted ? "ring-3 ring-cyan-500 scale-105 shadow-xl" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  if (isDraggingPhotoRef.current) return
                  onOpenDiary("experience", "tell me about Soda Data")
                }}
              >
                <div className="scotch-tape -top-2 right-1/4 w-9 rotate-2" />
                <p className="font-mono text-[9px] uppercase tracking-wider text-[#0E7490] font-bold">
                  HIGHLIGHT
                </p>
                <p className="font-script text-base text-[#164E63] mt-0.5 leading-tight font-bold">
                  Soda Data
                </p>
                <p className="text-[10px] text-[#155E75] mt-0.5 font-script leading-tight">
                  1B+ rows analyzed
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  return (
    <div
      ref={coverRef}
      className="w-full h-full min-h-full flex flex-col justify-between pt-5 sm:pt-6 lg:pt-6 pl-6 sm:pl-10 lg:pl-14 pr-5 sm:pr-10 lg:pr-14 min-[1400px]:pr-16 relative select-none text-[#1A1A2E] bg-[#FAF7F0] overflow-visible min-[480px]:overflow-y-auto notebook-scroll min-[480px]:[direction:rtl] min-[480px]:[&>*]:[direction:ltr] lg:[direction:ltr] lg:overflow-hidden pb-28 min-[480px]:pb-6 lg:pb-8"
    >
      
      {/* Subtle Architectural / Drafting Background Geometry */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.035]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="cover-grid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke="#1A1A2E" strokeWidth="1" />
            <circle cx="0" cy="0" r="1.5" fill="#1A1A2E" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cover-grid)" />
        <circle cx="85%" cy="30%" r="220" fill="none" stroke="#1A1A2E" strokeWidth="1" strokeDasharray="4 6" />
        <circle cx="15%" cy="75%" r="180" fill="none" stroke="#1A1A2E" strokeWidth="1" strokeDasharray="3 5" />
      </svg>

      {/* ============================================================== */}
      {/* TOP HEADER ROW: Date, Live Time & Location */}
      {/* ============================================================== */}
      <div className="flex items-center justify-between gap-3 w-full relative z-10 max-w-[96%]">
        
        {/* Left: Handwritten Date, Live Toronto Time & Location */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span
            suppressHydrationWarning
            className="font-script text-base sm:text-xl text-[#1A1A2E] font-normal tracking-wide"
          >
            {torontoDate}
          </span>
          <span className="text-[#94A3B8] font-script text-sm sm:text-lg">·</span>
          <span
            suppressHydrationWarning
            className="font-script text-sm sm:text-lg text-[#475569] font-normal tracking-wide"
          >
            {torontoTime} · TORONTO, CA
          </span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MAIN CENTER HERO AREA: Title & Links (Properly Centered) */}
      {/* ============================================================== */}
      <div className="w-full my-0.5 sm:my-1 lg:my-auto py-1 sm:py-2 lg:py-6 relative z-10 flex flex-col items-center justify-center text-center">
        
        {/* Main Title: Diary | of | Davies Umoh on 3 different rows */}
        <h1 className="font-script text-[#1A1A2E] tracking-tight flex flex-col items-center my-0.5 sm:my-1 select-none">
          <span className="text-[40px] sm:text-[42px] md:text-[46px] lg:text-[46px] xl:text-[66px] min-[1400px]:text-[78px] font-normal leading-[1]">
            Diary
          </span>
          <span className="text-xl sm:text-2xl lg:text-[24px] xl:text-[34px] min-[1400px]:text-[38px] font-light text-[#64748B] leading-[1.08] my-0.5">
            of
          </span>
          <span className="text-[40px] sm:text-[42px] md:text-[48px] lg:text-[48px] xl:text-[68px] min-[1400px]:text-[82px] font-normal leading-[1] whitespace-normal lg:whitespace-nowrap">
            {OWNER_INFO.name}
          </span>
        </h1>

        {/* Role Subtitle */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-0.5 sm:pt-1">
          <span className="font-script text-xl sm:text-2xl lg:text-xl xl:text-[26px] min-[1400px]:text-3xl text-[#1E293B] font-medium">
            {OWNER_INFO.role}
          </span>
          <span className="font-mono text-sm text-[#94A3B8]">·</span>
          <span className="font-script text-base sm:text-lg lg:text-base xl:text-xl min-[1400px]:text-2xl text-[#475569] min-h-[28px] inline-flex items-center">
            {SPECIALTIES[specialtyIndex].substring(0, subIndex) || "\u00A0"}
          </span>
        </div>

        {/* Unified Links on One Line: linkedin, email, resume, coffee chat */}
        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 pt-1 sm:pt-1.5 text-xs sm:text-[13px] lg:text-[13px] xl:text-[14.5px] font-script">
          <Link
            href={OWNER_INFO.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2563EB] hover:text-[#1D4ED8] underline underline-offset-4 decoration-dotted transition-colors"
          >
            linkedin ↗
          </Link>
          <span className="text-[#CBD5E1] font-mono text-xs">·</span>
          <a
            href={`mailto:${OWNER_INFO.links.email}`}
            className="text-[#2563EB] hover:text-[#1D4ED8] underline underline-offset-4 decoration-dotted transition-colors"
          >
            email ↗
          </a>
          <span className="text-[#CBD5E1] font-mono text-xs">·</span>
          <a
            href={OWNER_INFO.links.resumeMailto}
            className="text-[#2563EB] hover:text-[#1D4ED8] underline underline-offset-4 decoration-dotted transition-colors"
          >
            resume (pdf) ↗
          </a>
          <span className="text-[#CBD5E1] font-mono text-xs">·</span>
          <a
            href={OWNER_INFO.links.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2563EB] hover:text-[#1D4ED8] underline underline-offset-4 decoration-dotted transition-colors"
          >
            coffee chat ↗
          </a>
        </div>

      </div>

      {/* ============================================================== */}
      {/* LEFT SCRAPBOOK COLLAGE: Projectors, Founder Huddle, Trimble & Summit */}
      {/* ============================================================== */}
      <div
        className="hidden lg:block absolute z-20 select-none pointer-events-none"
        style={{
          left: Math.round(14 * desktopScale),
          top: "9.5%",
          width: Math.round(375 * desktopScale),
          height: Math.round(480 * desktopScale),
        }}
      >
        {COVER_PHOTOS.map((photo, idx) =>
          renderScrapbookPolaroid(
            photo,
            `desktop-${photo.id}`,
            desktopScale,
            "absolute",
            {
              left: Math.round(photo.desktopPos.left * desktopScale),
              top: Math.round(photo.desktopPos.top * desktopScale),
              zIndex: photo.desktopPos.zIndex,
            },
            true,
            idx * 0.45
          )
        )}
      </div>

      {/* ============================================================== */}
      {/* DRAGGABLE & FLOATING REALIA (Desktop lg+ raised slightly higher) */}
      {/* ============================================================== */}
      {renderDaviesRealia(
        "desktop-davies-realia",
        desktopScale,
        "hidden lg:block absolute z-20",
        {
          right: Math.round(44 * desktopScale),
          top: "15.5%",
        }
      )}

      {/* Mobile & Zoomed-In Scrapbook Pairing (smoothly scaled by coverSize) */}
      <div className="flex lg:hidden flex-col min-[640px]:flex-row items-center justify-center gap-5 min-[640px]:gap-10 md:gap-14 mt-1 mb-4 pb-2 relative z-20">
        {/* Mobile & Zoomed-In Scrapbook Grid */}
        <div className="grid grid-cols-2 items-center justify-items-center gap-2.5 sm:gap-3.5 relative z-20 select-none flex-shrink-0">
          {COVER_PHOTOS.map((photo, idx) =>
            renderScrapbookPolaroid(
              photo,
              `flow-${photo.id}`,
              flowScale,
              "relative",
              undefined,
              true,
              idx * 0.45
            )
          )}
        </div>

        {/* Mobile & Zoomed-In Davies Umoh Polaroid + Notes Stack */}
        <div
          style={{
            marginLeft: Math.round(56 * flowScale),
            marginRight: Math.round(18 * flowScale),
          }}
        >
          {renderDaviesRealia(
            "flow-davies-realia",
            flowScale,
            "relative z-20 mt-1"
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* BOTTOM ACTION BAR: DaveAI Sticky Note */}
      {/* ============================================================== */}
      <div className="pt-2 pb-1 relative z-10 max-w-full sm:max-w-[92%]">
        
        {/* DaveAI Sticky Note - ~20% scaled down canary yellow note */}
        <motion.div
          animate={daveAiControls}
          initial={{ rotate: -0.6 }}
          whileHover={{ scale: 1.01, rotate: 0 }}
          className={`relative p-2 sm:p-2.5 bg-[#FEF9C3] border border-amber-300/80 rounded-lg shadow-md select-none w-full max-w-[460px] lg:max-w-[400px] xl:max-w-[542px] z-20 transition-all ${
            isShaking ? "ring-2 ring-amber-400 shadow-xl" : "hover:shadow-lg"
          }`}
        >
          {/* Semi-translucent Scotch Tape on Top Center */}
          <div className="scotch-tape -top-2 left-1/2 -translate-x-1/2 w-12 rotate-[-1deg]" />

          {/* Sticky Note Header: Title */}
          <div className="flex items-center justify-between pb-1 border-b border-amber-200/90 mb-1.5">
            <div className="flex items-center gap-1">
              <span className="text-[11px]">📌</span>
              <span className="font-mono text-[9.5px] font-bold text-amber-950 tracking-wider">
                Ask DaveAI anything about me!
              </span>
            </div>
          </div>

          {/* Quick Question Sticky Flags */}
          <div className="flex flex-wrap items-center gap-1 py-0 mb-1.5">
            <span className="text-[8px] font-mono text-amber-800 uppercase tracking-wider flex-shrink-0 font-bold">
              QUICK -
            </span>
            {[
              { label: '"whats GitCloud?"', tab: "experience" as TabId, query: "whats GitCloud?" },
              { label: '"VoiceAI for Claude Code?"', tab: "projects" as TabId, query: "tell me about VoiceAI for Claude Code" },
              { label: '"Fun fact"', tab: "about" as TabId, query: "give me a fun fact about Davies" },
              { label: '"Building MockQ?"', tab: "experience" as TabId, query: "tell me about Building MockQ" },
              { label: '"My Fav Food?"', tab: "about" as TabId, query: "what is Davies' favorite food?" },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onOpenDiary(item.tab, item.query)
                }}
                className="font-script text-[10px] leading-tight bg-white/80 hover:bg-white text-amber-950 px-1.5 py-[1px] rounded border border-amber-300/70 shadow-2xs whitespace-nowrap transition-all active:scale-95"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Prominent Handwriting Pen Input Field */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const inputEl = e.currentTarget.elements.namedItem("coverQuery") as HTMLInputElement
              if (inputEl?.value?.trim()) {
                onOpenDiary("experience", inputEl.value.trim())
              }
            }}
            className="bg-white/95 border border-amber-300/90 rounded-md p-1 w-full min-w-0 flex items-center gap-1.5 shadow-inner overflow-hidden focus-within:ring-2 focus-within:ring-amber-400"
          >
            <span className="text-xs pl-1 select-none flex-shrink-0">🖋️</span>
            <input
              name="coverQuery"
              type="text"
              placeholder="ask or command (e.g. 'tell me about Davies' background')..."
              className="flex-1 min-w-0 w-0 bg-transparent border-none text-sm sm:text-[15px] font-script text-[#1E40AF] placeholder:text-amber-900/40 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#181824] hover:bg-black text-white px-2 py-0.5 rounded font-mono text-[10px] font-bold flex items-center gap-1 shadow-sm transition-all flex-shrink-0"
            >
              <span>Send</span>
              <span>⌲</span>
            </button>
          </form>
        </motion.div>
      </div>

      {/* ============================================================== */}
      {/* LARGE REALISTIC FOLDED CORNER (PEEL / FLIP CUE) */}
      {/* ============================================================== */}
      <motion.div
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onOpenDiary("about")}
        className="absolute bottom-0 right-0 w-28 h-28 sm:w-32 sm:h-32 z-30 cursor-pointer group"
      >
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full overflow-visible drop-shadow-md"
        >
          <defs>
            {/* Shadow cast by folded flap onto revealed page */}
            <filter id="fold-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="-4" dy="-4" stdDeviation="4.5" floodColor="#000000" floodOpacity="0.25" />
            </filter>
            {/* Backside of folded flap gradient */}
            <linearGradient id="flap-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#FAF7F0" />
              <stop offset="70%" stopColor="#ECE4D0" />
              <stop offset="100%" stopColor="#D8CDAE" />
            </linearGradient>
            {/* Exposed notebook paper underneath */}
            <linearGradient id="under-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FAF7F0" />
              <stop offset="100%" stopColor="#ECE6D8" />
            </linearGradient>
          </defs>

          {/* 1. Revealed Page Underneath (Bottom-right triangle) */}
          <polygon
            points="0,120 120,0 120,120"
            fill="url(#under-gradient)"
          />
          {/* Horizontal blue rule lines matching the pages inside */}
          <line x1="88" y1="32" x2="120" y2="32" stroke="rgba(59, 130, 246, 0.25)" strokeWidth="1.2" />
          <line x1="56" y1="64" x2="120" y2="64" stroke="rgba(59, 130, 246, 0.25)" strokeWidth="1.2" />
          <line x1="24" y1="96" x2="120" y2="96" stroke="rgba(59, 130, 246, 0.25)" strokeWidth="1.2" />
          <text x="88" y="112" fill="#78716C" fontSize="11" fontFamily="JetBrains Mono, monospace" fontWeight="700" textAnchor="middle">
            p.01
          </text>

          {/* 2. Folded Paper Flap (Top-left triangle curled over diagonal crease) */}
          <polygon
            points="0,120 120,0 0,0"
            fill="url(#flap-gradient)"
            filter="url(#fold-shadow)"
            stroke="#D0C6AF"
            strokeWidth="0.8"
            className="group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform duration-200"
          />

          {/* Diagonal crease line */}
          <line x1="0" y1="120" x2="120" y2="0" stroke="#C2B8A3" strokeWidth="1.5" />

          {/* 3. FLIP Text and Arrow on Folded Flap */}
          <g className="group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform duration-200">
            <text
              x="24"
              y="38"
              fill="#1A1A2E"
              fontSize="12"
              fontFamily="JetBrains Mono, monospace"
              fontWeight="700"
              letterSpacing="0.06em"
            >
              FLIP ↗
            </text>
          </g>
        </svg>
      </motion.div>

    </div>
  )
}

