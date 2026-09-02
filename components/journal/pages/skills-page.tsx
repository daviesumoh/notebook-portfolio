"use client"

import React, { useEffect } from "react"

interface SkillsPageProps {
  onNavigateTab: (tab: any) => void
  highlightedItem?: string | null
}

export default function SkillsPage({ onNavigateTab, highlightedItem }: SkillsPageProps) {
  useEffect(() => {
    if (highlightedItem) {
      const hl = highlightedItem.toLowerCase()
      const targetId = hl.includes("education") || hl.includes("mcmaster") || hl.includes("school")
        ? "section-education"
        : "section-skills"
      const el = document.getElementById(targetId)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [highlightedItem])

  const hl = highlightedItem?.toLowerCase() || ""
  const isSkillsHighlighted = hl.includes("skill") || hl.includes("tech") || hl.includes("stack")
  const isEduHighlighted = hl.includes("education") || hl.includes("mcmaster") || hl.includes("school") || hl.includes("degree")
  return (
    <div className="h-full flex flex-col justify-between px-5 sm:px-8 lg:px-10 py-0 pr-5 sm:pr-10 lg:pr-12 relative select-none">
      {/* Main Content Area - Words Written Directly on Ruled Lines (NO BOXES) */}
      <div className="flex-1 overflow-y-auto pt-8 pb-0 space-y-0 notebook-scroll [direction:rtl] [&>*]:[direction:ltr] pl-3 pr-0">
        
        {/* Title */}
        <h1 className="font-script text-4xl font-bold text-[#181824] h-[32px] !leading-[32px] mb-8 translate-y-[6px] tracking-tight">
          skills &amp; education
        </h1>

        {/* Technical Skills */}
        <div
          id="section-skills"
          className={`space-y-0 mb-8 transition-all duration-500 rounded-lg ${
            isSkillsHighlighted
              ? "bg-[#FEF08A]/80 ring-2 ring-amber-400 p-2 shadow-sm relative animate-fadeIn"
              : ""
          }`}
        >
          {isSkillsHighlighted && (
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-950 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-full w-fit mb-1 shadow-2xs">
              <span>🖍️</span>
              <span>HIGHLIGHTED BY DaveAI</span>
            </div>
          )}

          <p className="font-script text-xl font-light text-[#2D2D3F] !leading-[32px] translate-y-[6px]">
            <strong className="text-[#181824] font-normal">Programming:</strong> Python, SQL, TypeScript, JavaScript
          </p>

          <p className="font-script text-xl font-light text-[#2D2D3F] !leading-[32px] translate-y-[6px]">
            <strong className="text-[#181824] font-normal">ML &amp; Data Infra:</strong> PostgreSQL, PyTorch, Databricks, Docker
          </p>

          <p className="font-script text-xl font-light text-[#2D2D3F] !leading-[32px] translate-y-[6px]">
            <strong className="text-[#181824] font-normal">Product &amp; Analytics:</strong> Figma, PostHog, Mixpanel
          </p>

          <p className="font-script text-xl font-light text-[#2D2D3F] !leading-[32px] translate-y-[6px]">
            <strong className="text-[#181824] font-normal">Cloud &amp; Protocols:</strong> AWS &amp; GCP
          </p>
        </div>

        {/* Academic Education */}
        <div
          id="section-education"
          className={`space-y-0 mb-8 transition-all duration-500 rounded-lg ${
            isEduHighlighted
              ? "bg-[#FEF08A]/80 ring-2 ring-amber-400 p-2 shadow-sm relative animate-fadeIn"
              : ""
          }`}
        >
          {isEduHighlighted && (
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-950 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-full w-fit mb-1 shadow-2xs">
              <span>🖍️</span>
              <span>HIGHLIGHTED BY DaveAI</span>
            </div>
          )}

          <p className="font-script text-2xl font-normal text-[#181824] min-h-[32px] !leading-[32px] translate-y-[6px]">
            McMaster University — BASc in Engineering
          </p>

          <p className="font-mono text-xs text-[#717188] h-[32px] flex items-center translate-y-[6px]">
            Hamilton, ON · Graduated: June 2026 (Co-op)
          </p>

          <p className="font-script text-xl font-light text-[#2D2D3F] !leading-[32px] translate-y-[6px]">
            ★ Honors Level 3 Scholarship &amp; Top 10 McMasterU Cornerstone Engineering Project
          </p>

          <p className="font-script text-xl font-light text-[#2D2D3F] !leading-[32px] translate-y-[6px]">
            ↳ McMaster AI Society, National Society of Black Engineers, Engineers Without Borders
          </p>
        </div>

      </div>

    </div>
  )
}
