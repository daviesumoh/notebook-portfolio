"use client"

import React from "react"
import { TABS, TabId } from "./types"
import { motion } from "framer-motion"

interface StickyTabsProps {
  activeTab: TabId
  onSelectTab: (tab: TabId) => void
  orientation?: "vertical" | "horizontal"
}

export default function StickyTabs({
  activeTab,
  onSelectTab,
  orientation = "vertical",
}: StickyTabsProps) {
  const visibleTabs = TABS.filter((tab) => tab.id !== activeTab)

  if (orientation === "horizontal") {
    return (
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            style={{
              backgroundColor: tab.color,
              color: tab.textColor,
            }}
            className="px-2 py-0.5 rounded-t-md font-mono text-[9.5px] font-bold flex items-center gap-1 shadow-sm opacity-90 hover:opacity-100 transition-all whitespace-nowrap !leading-none"
          >
            <span>{tab.label}</span>
            {tab.pageNum && (
              <span className="text-[8px] opacity-75 font-normal">
                ({tab.pageNum})
              </span>
            )}
          </button>
        ))}
      </div>
    )
  }

  return (
    <nav
      aria-label="Diary Page Tabs"
      className="absolute left-full -ml-3 top-5 sm:top-6 flex flex-col items-start gap-1 sm:gap-1.5 z-10 select-none pointer-events-auto"
    >
      {visibleTabs.map((tab) => (
        <motion.button
          key={tab.id}
          onClick={() => onSelectTab(tab.id)}
          style={{
            backgroundColor: tab.color,
            color: tab.textColor,
          }}
          initial={false}
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group relative h-[22px] sm:h-[25px] lg:h-[26px] py-0.5 pl-[16px] sm:pl-[18px] pr-2 sm:pr-2.5 rounded-r-md rounded-l-none font-mono text-[8px] sm:text-[8.5px] lg:text-[9.5px] font-bold uppercase tracking-[0.02em] sm:tracking-[0.04em] flex items-center gap-1 shadow-[3px_2px_6px_rgba(0,0,0,0.14),inset_6px_0_8px_-4px_rgba(0,0,0,0.18)] border-r border-y border-black/15 transition-shadow !leading-none opacity-95 hover:opacity-100 cursor-pointer"
        >
          <span
            className={`font-semibold whitespace-nowrap ${
              tab.id === "daviesbot" ? "normal-case tracking-normal" : ""
            }`}
          >
            {tab.label}
          </span>
          {tab.pageNum && (
            <span className="text-[7.5px] sm:text-[8px] opacity-70 font-normal lowercase whitespace-nowrap">
              {tab.pageNum}
            </span>
          )}
        </motion.button>
      ))}
    </nav>
  )
}

