"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { MediaModalItem } from "../media-modal"
import { JOURNAL_BODY_TEXT_CLASS, JOURNAL_SUBHEADING_TEXT_CLASS } from "../types"
import { ABOUT_CONFIG, ABOUT_PHOTOS, type AboutPhoto } from "@/lib/portfolio-config"

export { ABOUT_PHOTOS }

interface AboutPageProps {
  onOpenMedia: (media: MediaModalItem) => void
  onNavigateTab: (tab: any) => void
  highlightedItem?: string | null
}

interface DragBounds {
  left: number
  right: number
  top: number
  bottom: number
}

export default function AboutPage({ onOpenMedia, onNavigateTab, highlightedItem }: AboutPageProps) {
  const aboutRef = useRef<HTMLDivElement>(null)
  const desktopCardRefs = useRef<Array<HTMLDivElement | null>>([])
  const isDraggingPhotoRef = useRef(false)
  const [dragBounds, setDragBounds] = useState<DragBounds[]>([])

  // Measure drag bounds after the 3D flip animation finishes so rotateY(70deg) doesn't shrink bounds.
  useEffect(() => {
    const computeBounds = () => {
      const container = aboutRef.current
      if (!container) return
      const containerRect = container.getBoundingClientRect()
      if (containerRect.width < 100) return

      const nextBounds = ABOUT_PHOTOS.map((_, idx) => {
        const el = desktopCardRefs.current[idx]
        if (!el) return { left: -340, right: 90, top: -60, bottom: 260 }
        const r = el.getBoundingClientRect()
        return {
          left: Math.round(containerRect.left + 44 - r.left),
          right: Math.round(containerRect.right - 18 - r.right),
          top: Math.round(containerRect.top + 36 - r.top),
          bottom: Math.round(containerRect.bottom - 20 - r.bottom),
        }
      })
      setDragBounds(nextBounds)
    }

    const timer = setTimeout(computeBounds, 520)
    window.addEventListener("resize", computeBounds)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", computeBounds)
    }
  }, [])
  useEffect(() => {
    if (highlightedItem) {
      const hl = highlightedItem.toLowerCase()
      let targetId = "about-bio"
      if (hl.includes("skill") || hl.includes("tech") || hl.includes("stack") || hl.includes("python") || hl.includes("sql")) {
        targetId = "section-skills"
      } else if (hl.includes("education") || hl.includes("mcmaster") || hl.includes("school") || hl.includes("degree")) {
        targetId = "section-education"
      }
      const el = document.getElementById(targetId)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [highlightedItem])

  const hl = highlightedItem?.toLowerCase() || ""
  const isBioHighlighted = hl === "bio" || hl === "about" || hl === "story" || hl.includes("education") || hl.includes("mcmaster") || hl.includes("degree")
  const isSkillsHighlighted = hl.includes("skill") || hl.includes("tech") || hl.includes("stack") || hl.includes("python") || hl.includes("sql")

  const renderPhotoCard = (photo: AboutPhoto, idx: number, draggable: boolean) => (
    <motion.div
      key={`${draggable ? "desktop" : "mobile"}-${photo.src}`}
      ref={
        draggable
          ? (el) => {
              desktopCardRefs.current[idx] = el
            }
          : undefined
      }
      drag={draggable}
      dragConstraints={
        draggable ? (dragBounds[idx] ?? { left: -340, right: 90, top: -60, bottom: 260 }) : undefined
      }
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
      onClick={() => {
        if (isDraggingPhotoRef.current) return
        onOpenMedia({
          type: "image",
          src: photo.src,
          title: photo.title,
          description: photo.description,
        })
      }}
      className={`relative ${draggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}`}
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{
          repeat: Infinity,
          duration: 4.5,
          delay: idx * 0.45,
          ease: "easeInOut",
        }}
      >
        <motion.div
          initial={{ rotate: photo.rotate }}
          whileHover={{ rotate: 0, scale: 1.03 }}
          className="bg-white p-2 sm:p-2.5 pb-2.5 sm:pb-3 rounded-sm shadow-md border border-[#E4E4E7] w-[144px] sm:w-[158px] max-w-full hover:shadow-lg transition-shadow"
        >
          <div className={`scotch-tape -top-2.5 left-1/3 w-12 bg-white/70 ${photo.tapeClass}`} />
          <div className={`w-full ${photo.frameClass} bg-[#18181B] rounded-sm overflow-hidden`}>
            <img src={photo.src} alt={photo.alt} className={`w-full h-full ${photo.imgClass}`} />
          </div>
          <p className="font-script text-xs sm:text-sm text-center text-[#181824] mt-1.5 font-semibold leading-tight">
            {photo.caption}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  )

  return (
    <div
      ref={aboutRef}
      className="h-full flex flex-col justify-between px-5 sm:px-8 lg:px-10 py-0 pr-5 sm:pr-8 lg:pr-10 relative select-none"
    >
      {/* Main Content Area - Text scrolls independently on the left so dragged Polaroids never clip */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-4 lg:gap-6 max-w-[920px] overflow-y-auto md:overflow-visible pt-0 pb-0 notebook-scroll max-md:[direction:rtl] max-md:[&>*]:[direction:ltr] pl-3 md:pl-0">
        
        {/* Main Content Column */}
        <div className="min-w-0 flex-1 md:h-full md:overflow-y-auto pb-6 md:pb-16 notebook-scroll md:[direction:rtl] md:[&>*]:[direction:ltr] md:pl-3 md:pr-0">
          
          {/* Title in Calligraphic Ink */}
          <h1 className="font-script text-4xl font-bold text-[#181824] h-[32px] !leading-[32px] mb-8 translate-y-[6px] tracking-tight">
            About
          </h1>
            
            {/* 1. Bio & Story */}
            <div
              id="about-bio"
              className={`mb-8 transition-all duration-500 rounded-lg ${
                isBioHighlighted
                  ? "bg-[#FEF08A]/80 ring-2 ring-amber-400 px-2 -mx-2 shadow-sm relative animate-fadeIn"
                  : ""
              }`}
            >
              {isBioHighlighted && (
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-950 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-full w-fit mb-2 shadow-2xs">
                  <span>🖍️</span>
                  <span>HIGHLIGHTED BY DaveAI</span>
                </div>
              )}
              
              <h2 className={`${JOURNAL_SUBHEADING_TEXT_CLASS} font-bold text-[#181824] h-[32px] translate-y-[6px]`}>
                {ABOUT_CONFIG.greeting}
              </h2>

              {ABOUT_CONFIG.bioBullets.map((bullet) => (
                <p key={bullet} className={`${JOURNAL_BODY_TEXT_CLASS} text-[#2D2D3F] min-h-[32px]`}>
                  → {bullet}
                </p>
              ))}
            </div>

            {/* 2. Career Path Milestones */}
            <div className="mb-8">
              <h2 className={`${JOURNAL_SUBHEADING_TEXT_CLASS} font-bold text-[#181824] h-[32px] translate-y-[6px]`}>
                career path
              </h2>
              {ABOUT_CONFIG.careerPath.map((step) => (
                <p key={step} className={`${JOURNAL_BODY_TEXT_CLASS} text-[#2D2D3F] min-h-[32px]`}>
                  → {step}
                </p>
              ))}
            </div>

            {/* 3. Technical Skills */}
            <div
              id="section-skills"
              className={`mb-8 transition-all duration-500 rounded-lg ${
                isSkillsHighlighted
                  ? "bg-[#FEF08A]/80 ring-2 ring-amber-400 px-2 -mx-2 shadow-sm relative animate-fadeIn"
                  : ""
              }`}
            >
              {isSkillsHighlighted && (
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-950 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-full w-fit mb-2 shadow-2xs">
                  <span>🖍️</span>
                  <span>HIGHLIGHTED BY DaveAI</span>
                </div>
              )}

              <h2 className={`${JOURNAL_SUBHEADING_TEXT_CLASS} font-bold text-[#181824] h-[32px] translate-y-[6px]`}>
                skills
              </h2>

              <div>
                {ABOUT_CONFIG.skills.map((skill) => (
                  <p key={skill.label} className={`${JOURNAL_BODY_TEXT_CLASS} text-[#2D2D3F] min-h-[32px]`}>
                    <strong className="text-[#181824] font-semibold">{skill.label}:</strong> {skill.value}
                  </p>
                ))}
              </div>
            </div>

          {/* Compact horizontal Polaroid wrap below Skills on narrow (< md / < 768px) */}
          <div className="flex md:hidden flex-row flex-wrap justify-center gap-4 pt-2 pb-10">
            {ABOUT_PHOTOS.map((photo, idx) => renderPhotoCard(photo, idx, false))}
          </div>
        </div>

        {/* Desktop & Tablet Right Column (md+): Floating Polaroids beside About text */}
        <div className="hidden md:flex flex-col items-center gap-3.5 pt-[60px] lg:pt-[72px] w-[152px] lg:w-[168px] flex-shrink-0 relative z-30">
          {ABOUT_PHOTOS.map((photo, idx) => renderPhotoCard(photo, idx, true))}
        </div>

      </div>

    </div>
  )
}
