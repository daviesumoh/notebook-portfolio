"use client"

import React, { useEffect } from "react"
import { Play } from "lucide-react"
import { MediaModalItem } from "../media-modal"
import { JOURNAL_BODY_TEXT_CLASS, JOURNAL_SUBHEADING_TEXT_CLASS } from "../types"
import { PROJECTS } from "@/lib/portfolio-config"

interface ProjectsPageProps {
  onOpenMedia: (media: MediaModalItem) => void
  onNavigateTab: (tab: any) => void
  highlightedItem?: string | null
}

/** Exact highlight keys (from DaveAI's tool catalog) -> project card ids. No fuzzy matching. */
const PROJECT_HIGHLIGHT_IDS: Record<string, string> = Object.fromEntries(
  PROJECTS.map((proj) => [proj.highlightKey, proj.id])
)

export default function ProjectsPage({ onOpenMedia, onNavigateTab, highlightedItem }: ProjectsPageProps) {
  useEffect(() => {
    if (highlightedItem) {
      const targetId = PROJECT_HIGHLIGHT_IDS[highlightedItem.toLowerCase()]
      if (targetId) {
        document.getElementById(`proj-${targetId}`)?.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [highlightedItem])

  const projects = PROJECTS

  return (
    <div className="h-full flex flex-col justify-between px-5 sm:px-8 lg:px-10 py-0 pr-5 sm:pr-10 lg:pr-12 relative select-none">
      {/* Main Content Area - Words Written Directly on Ruled Lines (NO BOXES) */}
      <div className="flex-1 overflow-y-auto pt-0 pb-0 notebook-scroll [direction:rtl] [&>*]:[direction:ltr] pl-3 pr-0">
        <div className="w-full">
          <div className="max-w-[545px]">
            {/* Title */}
            <h1 className="font-script text-4xl font-bold text-[#181824] h-[32px] !leading-[32px] mb-8 translate-y-[6px] tracking-tight">
              Projects
            </h1>

            {/* Projects List */}
            <div className="pb-6">
          {projects.map((proj) => {
            const isHighlighted = PROJECT_HIGHLIGHT_IDS[highlightedItem?.toLowerCase() ?? ""] === proj.id
            
            return (
              <div
                key={proj.id}
                id={`proj-${proj.id}`}
                className={`mb-8 last:mb-0 transition-all duration-500 rounded-lg ${
                  isHighlighted
                    ? "bg-[#FEF08A]/80 ring-2 ring-amber-400 px-2 -mx-2 shadow-sm relative animate-fadeIn"
                    : ""
                }`}
              >
                {/* Highlighter Marker Tag */}
                {isHighlighted && (
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-950 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-full w-fit mb-1 shadow-2xs">
                    <span>🖍️</span>
                    <span>HIGHLIGHTED BY DaveAI</span>
                  </div>
                )}

                {/* Header Row: Project Title (+ clickable GitHub icon) */}
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 min-h-[32px] translate-y-[5px]">
                  {proj.githubUrl ? (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 ${JOURNAL_SUBHEADING_TEXT_CLASS} font-normal text-[#181824] hover:text-[#2563EB] transition-colors group`}
                      aria-label={`${proj.title} GitHub repository`}
                    >
                      <span className="border-b border-dotted border-[#181824]/35 group-hover:border-[#2563EB] leading-[1.05]">
                        {proj.title}
                      </span>
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="w-[15px] h-[15px] text-[#181824]/75 group-hover:text-[#2563EB] transition-colors flex-shrink-0"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        />
                      </svg>
                    </a>
                  ) : (
                    <p className={`${JOURNAL_SUBHEADING_TEXT_CLASS} font-normal text-[#181824]`}>
                      {proj.title}
                    </p>
                  )}
                </div>

                {/* Tech Stack directly under the project title */}
                {proj.techStack && (
                  <p
                    title={`Frameworks: ${proj.techStack}`}
                    className="font-mono text-[10px] sm:text-[10.5px] uppercase tracking-wider text-[#717188] h-[32px] flex items-center translate-y-[6px] whitespace-nowrap"
                  >
                    {proj.techStack}
                  </p>
                )}

                {/* Narrative written on lines (matching Experience body size) */}
                {proj.description && (
                  <p className={`${JOURNAL_BODY_TEXT_CLASS} text-[#2D2D3F] max-w-[535px] [text-wrap:balance]`}>
                    {proj.description}
                  </p>
                )}

                {/* Video button on the line */}
                {proj.vimeoId && (
                  <div className="h-[32px] flex items-center translate-y-[6px]">
                    <button
                      onClick={() =>
                        onOpenMedia({
                          type: "vimeo",
                          src: proj.vimeoId!,
                          vimeoId: proj.vimeoId!,
                          title: proj.title,
                          description: proj.description || "",
                        })
                      }
                      className={`${JOURNAL_BODY_TEXT_CLASS} !translate-y-0 text-[#1E40AF] hover:text-black underline underline-offset-4 decoration-dotted decoration-[#1E40AF]/60 flex items-center gap-1.5 transition-colors`}
                    >
                      <Play size={12} className="fill-[#1E40AF]" />
                      <span>watch video demo</span>
                    </button>
                  </div>
                )}

              </div>
            )
          })}
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
