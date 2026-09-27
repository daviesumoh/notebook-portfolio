"use client"

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TabId, TABS } from "./types"
import StickyTabs from "./sticky-tabs"
import DaviesBot from "./davies-bot"
import CoverPage from "./pages/cover-page"
import AboutPage from "./pages/about-page"
import ExperiencePage from "./pages/experience-page"
import ProjectsPage from "./pages/projects-page"
import SkillsPage from "./pages/skills-page"
import MediaModal, { MediaModalItem } from "./media-modal"
import PageFlipDogEar from "./page-flip-dogear"
import { resolvePortfolioMedia } from "./portfolio-media"
import {
  HIGHLIGHT_TARGETS,
  MEDIA_TARGETS,
  type PortfolioAction,
} from "@/lib/portfolio-actions"

export default function NotebookShell() {
  const [activeTab, setActiveTab] = useState<TabId>("cover")
  const [direction, setDirection] = useState<number>(1) // 1 = forward, -1 = backward
  const [initialBotQuery, setInitialBotQuery] = useState<{ id: number; text: string } | null>(null)
  const [activeMedia, setActiveMedia] = useState<MediaModalItem | null>(null)
  const [isMobileBotOpen, setIsMobileBotOpen] = useState(false)
  const [pressedKey, setPressedKey] = useState<"left" | "right" | null>(null)
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null)
  const [shakeDaveAiTrigger, setShakeDaveAiTrigger] = useState<number>(0)
  const [focusBotTrigger, setFocusBotTrigger] = useState<number>(0)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const currentIndex = TABS.findIndex((t) => t.id === activeTab)
  const JOURNAL_PAGES = useMemo(() => TABS.filter((t) => t.id !== "daviesbot" && t.id !== "skills"), [])
  const pageIndex = JOURNAL_PAGES.findIndex((t) => t.id === activeTab)
  const lastScrollTime = useRef<number>(0)
  const lastOpenDiaryClickRef = useRef<number>(0)

  // Navigate to a specific tab with direction tracking
  const navigateToTab = useCallback(
    (newTab: TabId) => {
      setIsMobileBotOpen(false)
      if (newTab === "skills") {
        setHighlightedItem("skills")
        const aboutIndex = TABS.findIndex((t) => t.id === "about")
        if (aboutIndex !== -1 && aboutIndex !== currentIndex) {
          setDirection(aboutIndex > currentIndex ? 1 : -1)
          setActiveTab("about")
        }
        return
      }
      const newIndex = TABS.findIndex((t) => t.id === newTab)
      if (newIndex !== -1 && newIndex !== currentIndex) {
        setDirection(newIndex > currentIndex ? 1 : -1)
        setActiveTab(newTab)
      }
    },
    [currentIndex]
  )

  // Handle Tab Selection (Ask DaveAI should never redirect to a separate right-side page)
  const handleSelectTab = useCallback(
    (tab: TabId) => {
      if (tab === "daviesbot") {
        setShakeDaveAiTrigger((prev) => prev + 1)
        if (activeTab !== "cover") {
          setFocusBotTrigger((prev) => prev + 1)
          if (typeof window !== "undefined" && window.innerWidth < 1024) {
            setIsMobileBotOpen((prev) => !prev)
          }
        }
        return
      }
      navigateToTab(tab)
    },
    [activeTab, navigateToTab]
  )

  // Unified Bot Action Handler: Flip Page + Highlight Section
  const handleBotAction = useCallback(
    (tab?: TabId, highlight?: string) => {
      if (tab) {
        setActiveTab((prevTab) => {
          const targetIndex = TABS.findIndex((t) => t.id === tab)
          const curIndex = TABS.findIndex((t) => t.id === prevTab)
          if (targetIndex !== -1 && targetIndex !== curIndex) {
            setDirection(targetIndex > curIndex ? 1 : -1)
            return tab
          }
          return prevTab
        })
      }
      if (highlight) {
        setHighlightedItem(highlight.toLowerCase())
        // Auto-clear highlight after 9 seconds
        setTimeout(() => {
          setHighlightedItem((prev) => (prev === highlight.toLowerCase() ? null : prev))
        }, 9000)
      }
    },
    []
  )

  // DaveAI tool runner: flips pages, highlights items, opens videos / photos / albums, closes the viewer.
  // (open_link is rendered as a clickable link under the chat reply instead of auto-opening a tab.)
  const runPortfolioActions = useCallback(
    (actions: PortfolioAction[]) => {
      if (actions.some((a) => a.tool !== "open_link")) setIsMobileBotOpen(false)

      for (const action of actions) {
        if (action.tool === "navigate") {
          handleBotAction(action.target as TabId)
        } else if (action.tool === "highlight") {
          const target = HIGHLIGHT_TARGETS.find((t) => t.id === action.target)
          if (target) handleBotAction(target.page as TabId, target.id)
        } else if (action.tool === "open_media") {
          const target = MEDIA_TARGETS.find((t) => t.id === action.target)
          const item = resolvePortfolioMedia(action.target)
          if (target && item) {
            // Show the page the media belongs to, then open the viewer once the flip settles
            handleBotAction(target.page as TabId)
            setTimeout(() => setActiveMedia(item), 450)
          }
        } else if (action.tool === "close_media") {
          setActiveMedia(null)
        }
      }
    },
    [handleBotAction]
  )

  // Next page helper (navigates through the journal pages, looping back to About from the last page)
  const goToNextPage = useCallback(() => {
    const curIdx = JOURNAL_PAGES.findIndex((t) => t.id === activeTab)
    if (curIdx !== -1) {
      if (curIdx < JOURNAL_PAGES.length - 1) {
        setDirection(1)
        setActiveTab(JOURNAL_PAGES[curIdx + 1].id)
      } else {
        setDirection(1)
        setActiveTab("about")
      }
    }
  }, [activeTab, JOURNAL_PAGES])

  // Prev page helper (navigates through the journal pages)
  const goToPrevPage = useCallback(() => {
    const curIdx = JOURNAL_PAGES.findIndex((t) => t.id === activeTab)
    if (curIdx > 0) {
      setDirection(-1)
      setActiveTab(JOURNAL_PAGES[curIdx - 1].id)
    }
  }, [activeTab, JOURNAL_PAGES])

  // Keyboard navigation: Escape, ArrowLeft, ArrowRight, and 1-5 shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileBotOpen) {
        setIsMobileBotOpen(false)
        return
      }
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault()
        setPressedKey("left")
        goToPrevPage()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        setPressedKey("right")
        goToNextPage()
      } else if (e.key === "1") navigateToTab("cover")
      else if (e.key === "2") navigateToTab("about")
      else if (e.key === "3") navigateToTab("experience")
      else if (e.key === "4") navigateToTab("projects")
      else if (e.key === "5") handleSelectTab("daviesbot")
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        setPressedKey(null)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [goToNextPage, goToPrevPage, navigateToTab, handleSelectTab, isMobileBotOpen])

  // Mouse wheel scroll to flip pages
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Don't flip page if user is scrolling inside an element with internal scroll
      const target = e.target as HTMLElement
      const scrollableParent = target.closest(".notebook-scroll")
      if (scrollableParent) {
        const atTop = scrollableParent.scrollTop <= 0
        const atBottom =
          scrollableParent.scrollHeight - scrollableParent.scrollTop <=
          scrollableParent.clientHeight + 2
        // If not at boundaries, let the internal container scroll
        if (!atTop && !atBottom) return
      }

      const now = Date.now()
      if (now - lastScrollTime.current < 550) return // 550ms cooldown

      if (e.deltaY > 35) {
        lastScrollTime.current = now
        goToNextPage()
      } else if (e.deltaY < -35) {
        lastScrollTime.current = now
        goToPrevPage()
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: true })
    return () => window.removeEventListener("wheel", handleWheel)
  }, [goToNextPage, goToPrevPage])

  const handleOpenDiary = useCallback(
    (tab: TabId, initialQuery?: string) => {
      const now = Date.now()
      if (now - lastOpenDiaryClickRef.current < 600) return
      lastOpenDiaryClickRef.current = now

      navigateToTab(tab)
      if (initialQuery) {
        setInitialBotQuery({ id: now, text: initialQuery })
        if (typeof window !== "undefined" && window.innerWidth < 1024) {
          setIsMobileBotOpen(true)
        }
      }
    },
    [navigateToTab]
  )

  const handleClearInitialQuery = useCallback(() => {
    setInitialBotQuery(null)
  }, [])

  // 3D Page Flip Animation Variants (Pivots from the spiral spine)
  const flipVariants: any = {
    enter: (dir: number) => ({
      rotateY: dir > 0 ? 70 : -70,
      opacity: 0,
      scale: 0.98,
      transformOrigin: dir > 0 ? "left center" : "right center",
      boxShadow: dir > 0 ? "-25px 0 40px rgba(0,0,0,0.18)" : "25px 0 40px rgba(0,0,0,0.18)",
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      transformOrigin: "left center",
      boxShadow: "0 0 0 rgba(0,0,0,0)",
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: (dir: number) => ({
      rotateY: dir > 0 ? -70 : 70,
      opacity: 0,
      scale: 0.98,
      transformOrigin: dir > 0 ? "left center" : "right center",
      boxShadow: dir > 0 ? "25px 0 40px rgba(0,0,0,0.18)" : "-25px 0 40px rgba(0,0,0,0.18)",
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  const renderActiveContent = () => {
    switch (activeTab) {
      case "about":
        return <AboutPage onOpenMedia={setActiveMedia} onNavigateTab={navigateToTab} highlightedItem={highlightedItem} />
      case "experience":
        return <ExperiencePage onOpenMedia={setActiveMedia} onNavigateTab={navigateToTab} highlightedItem={highlightedItem} />
      case "projects":
        return <ProjectsPage onOpenMedia={setActiveMedia} onNavigateTab={navigateToTab} highlightedItem={highlightedItem} />
      case "skills":
        return <AboutPage onOpenMedia={setActiveMedia} onNavigateTab={navigateToTab} highlightedItem="skills" />
      default:
        return <ExperiencePage onOpenMedia={setActiveMedia} onNavigateTab={navigateToTab} highlightedItem={highlightedItem} />
    }
  }

  return (
    <div className="w-full h-full h-[100dvh] bg-[#EBE5D8] p-1.5 min-[480px]:py-2.5 min-[480px]:pl-2.5 min-[480px]:pr-[90px] sm:py-3 sm:pl-4 sm:pr-[100px] md:py-4 md:pl-6 md:pr-[106px] lg:py-5 lg:pl-12 lg:pr-[114px] xl:py-6 xl:pl-14 xl:pr-[118px] items-center justify-center font-script overflow-hidden selection:bg-[#FDE68A] selection:text-[#78350F] flex relative select-none">
      
      {/* ============================================================== */}
      {/* DESK-FRAMED NOTEBOOK LAYOUT (480px+ covers desktop, zoom-out & deep zoom-in) */}
      {/* ============================================================== */}
      <div className="hidden min-[480px]:flex w-full h-full max-w-[1440px] max-h-[890px] relative">
        {/* Sticky Bookmark Tabs — Tucked inside/behind the right page edge with labels cleanly outside */}
        <StickyTabs activeTab={activeTab} onSelectTab={handleSelectTab} />

        <div className="w-full h-full relative z-20 rounded-xl sm:rounded-2xl shadow-2xl border border-black/15 overflow-hidden [perspective:1800px]">
          {/* CASE 1: COVER VIEW */}
          {activeTab === "cover" ? (
            <motion.div
              key="cover"
              custom={direction}
              variants={flipVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full h-full bg-[#FAF7F0] relative flex overflow-hidden [transform-style:preserve-3d]"
            >
              {/* Left Spiral Spine */}
              <div className="w-[34px] sm:w-[46px] md:w-[58px] lg:w-[72px] h-full bg-[#F3EFE6] border-r border-black/10 relative flex flex-col justify-evenly items-center py-4 z-20 shadow-[inset_-3px_0_6px_rgba(0,0,0,0.06)] flex-shrink-0">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="ring-hole">
                    <div className="ring-wire-left" />
                  </div>
                ))}
              </div>

              {/* Cover Content */}
              <div className="flex-1 h-full overflow-hidden relative z-20">
                <CoverPage
                  onOpenDiary={handleOpenDiary}
                  onOpenMedia={setActiveMedia}
                  highlightedItem={highlightedItem}
                  shakeDaveAiTrigger={shakeDaveAiTrigger}
                />
              </div>
            </motion.div>
          ) : (
            /* CASE 2: OPEN NOTEBOOK (2-page spread on lg+, single framed page on zoomed-in sm/md) */
            <div className="w-full h-full flex relative overflow-hidden">
              {/* LEFT PAGE (lg+): DaviesBot Field Assistant Margin */}
              <div className="hidden lg:flex w-[35%] xl:w-[33%] h-full lined-pattern relative flex-col justify-between border-r border-[#E5E1D8] shadow-[inset_-6px_0_12px_rgba(0,0,0,0.03)]">
                <div className="red-margin left-[38px] xl:left-[44px]" />

                {/* Embedded Bot */}
                <div className="flex-1 h-full pl-12 xl:pl-14 pr-3.5 pt-0 pb-0 relative z-10 overflow-hidden">
                  {isDesktop && (
                    <DaviesBot
                      onNavigateTab={navigateToTab}
                      onHighlightItem={setHighlightedItem}
                      onAction={handleBotAction}
                      onPortfolioActions={runPortfolioActions}
                      initialQuery={initialBotQuery?.text}
                      initialQueryId={initialBotQuery?.id}
                      onClearInitialQuery={handleClearInitialQuery}
                      highlightedItem={highlightedItem}
                      focusTrigger={focusBotTrigger}
                      shakeTrigger={shakeDaveAiTrigger}
                    />
                  )}
                </div>
              </div>

              {/* CENTER SPIRAL SPINE (lg+) */}
              <div className="hidden lg:flex w-[52px] h-full bg-[#F0ECE2] border-x border-black/10 relative flex-col justify-evenly items-center py-4 z-20 shadow-[inset_0_0_12px_rgba(0,0,0,0.07)] flex-shrink-0">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="ring-hole">
                    <div className="ring-wire-center" />
                  </div>
                ))}
              </div>

              {/* LEFT SPIRAL SPINE (zoomed-in single-page view 480px-1023px) */}
              <div className="flex lg:hidden w-[34px] sm:w-[44px] md:w-[54px] h-full bg-[#F3EFE6] border-r border-black/10 relative flex-col justify-evenly items-center py-4 z-20 shadow-[inset_-3px_0_6px_rgba(0,0,0,0.06)] flex-shrink-0">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="ring-hole">
                    <div className="ring-wire-left" />
                  </div>
                ))}
              </div>

              {/* RIGHT PAGE: 3D Flip Page Container */}
              <div className="flex-1 h-full lined-pattern relative flex flex-col justify-between overflow-hidden shadow-[inset_6px_0_12px_rgba(0,0,0,0.03)] [perspective:1800px]">
                {/* Active Content Area */}
                <div className="flex-1 overflow-hidden relative">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={activeTab}
                      custom={direction}
                      variants={flipVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="w-full h-full [transform-style:preserve-3d]"
                    >
                      {renderActiveContent()}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Backward Arrow Navigation Hint (Bottom-Left) */}
                <div className="h-[34px] flex items-center px-5 sm:px-8 lg:px-10 flex-shrink-0 relative z-20 select-none">
                  <button
                    type="button"
                    onClick={goToPrevPage}
                    className="h-[32px] flex items-center gap-1 sm:gap-1.5 font-script text-sm sm:text-base text-[#181824] translate-y-[1px] hover:text-black cursor-pointer group transition-colors active:scale-95 whitespace-nowrap"
                    aria-label={`Flip backward to ${JOURNAL_PAGES[pageIndex - 1]?.label || "Cover"}`}
                    title={`Previous page: ${JOURNAL_PAGES[pageIndex - 1]?.label.toLowerCase() || "cover"} (or press ← Arrow)`}
                  >
                    <span className="hidden sm:inline opacity-75 group-hover:opacity-100">arrow key</span>
                    <kbd
                      className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded border shadow-xs transition-all leading-none ${
                        pressedKey === "left"
                          ? "bg-black text-white border-black scale-95"
                          : "bg-black/5 border-black/15 text-[#181824] group-hover:bg-black group-hover:text-white"
                      }`}
                    >
                      ←
                    </kbd>
                    <span className="font-semibold text-sm sm:text-base">
                      ({JOURNAL_PAGES[pageIndex - 1]?.label.toLowerCase() || "cover"})
                    </span>
                  </button>
                </div>

                {/* Forward Page Flip Dog-Ear (Bottom-Right Corner) */}
                <PageFlipDogEar
                  pageNum={(JOURNAL_PAGES[pageIndex + 1] || JOURNAL_PAGES[1])?.pageNum || "p.01"}
                  label={(JOURNAL_PAGES[pageIndex + 1] || JOURNAL_PAGES[1])?.label.toLowerCase()}
                  onClick={goToNextPage}
                  pressedKey={pressedKey}
                  ariaLabel={`Flip forward to ${(JOURNAL_PAGES[pageIndex + 1] || JOURNAL_PAGES[1])?.label}`}
                />
              </div>
            </div>
          )}

        </div>

        {/* Compact DaveAI Drawer */}
        <AnimatePresence>
          {isMobileBotOpen && !isDesktop && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileBotOpen(false)}
                aria-hidden="true"
                className="lg:hidden absolute inset-0 bg-black/25 rounded-xl sm:rounded-2xl z-40 cursor-pointer"
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 250 }}
                className="lg:hidden absolute inset-x-0 bottom-0 top-10 bg-[#FAF7F0] border-t-2 border-black/20 rounded-t-2xl rounded-b-xl sm:rounded-b-2xl shadow-2xl z-50 p-4 flex flex-col"
              >
                <div className="flex justify-between items-center pb-2.5 border-b border-black/10 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-xs font-bold text-black">
                      DaveAI Field Assistant
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileBotOpen(false)}
                    className="font-mono text-[11px] bg-[#181824] hover:bg-black text-white px-3 py-1 rounded-md font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Close</span>
                    <span>✕</span>
                  </button>
                </div>

                <div className="flex-1 overflow-hidden">
                  <DaviesBot
                    compact
                    onNavigateTab={(tab) => {
                      navigateToTab(tab)
                      setIsMobileBotOpen(false)
                    }}
                    onHighlightItem={setHighlightedItem}
                    onAction={(tab, hl) => {
                      handleBotAction(tab, hl)
                      if (tab) setIsMobileBotOpen(false)
                    }}
                    onPortfolioActions={runPortfolioActions}
                    initialQuery={initialBotQuery?.text}
                    initialQueryId={initialBotQuery?.id}
                    onClearInitialQuery={handleClearInitialQuery}
                    highlightedItem={highlightedItem}
                    focusTrigger={focusBotTrigger}
                    shakeTrigger={shakeDaveAiTrigger}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* ============================================================== */}
      {/* PORTRAIT PHONE NOTEBOOK LAYOUT (< 480px) */}
      {/* ============================================================== */}
      <div className={`flex min-[480px]:hidden flex-col w-full h-full rounded-xl shadow-xl border border-black/15 relative overflow-hidden ${
        activeTab === "cover" ? "bg-[#FAF7F0]" : "lined-pattern"
      }`}>
        
        {/* Top Spiral Wire Binding */}
        <div className="h-8 border-b bg-[#F3EFE6] border-black/10 flex justify-around items-center px-4 z-30 flex-shrink-0 shadow-sm">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="w-3.5 h-6 border-2 border-[#71717A] rounded-t-sm -mt-2 border-b-transparent shadow-sm"
            />
          ))}
        </div>

        {/* Red Margin Rule on Mobile (Ruled pages only, not unlined cover) */}
        {activeTab !== "cover" && (
          <div className="red-margin left-[38px]" />
        )}

        {/* Mobile Main Content Area */}
        <div className="flex-1 overflow-y-auto pl-6 sm:pl-10 pr-3 pb-24 pt-2 notebook-scroll [direction:rtl] [&>*]:[direction:ltr] relative z-10 [perspective:1200px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeTab}
              custom={direction}
              variants={flipVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full min-h-full [transform-style:preserve-3d]"
            >
              {activeTab === "cover" ? (
                <CoverPage
                  onOpenDiary={handleOpenDiary}
                  onOpenMedia={setActiveMedia}
                  highlightedItem={highlightedItem}
                  shakeDaveAiTrigger={shakeDaveAiTrigger}
                />
              ) : (
                renderActiveContent()
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating Mobile Bottom Bar with Horizontal Bookmark Tabs */}
        <div className="absolute bottom-0 left-0 right-0 backdrop-blur-md border-t border-black/15 bg-[#FAF7F0]/95 text-[#181824] px-3 py-2 flex items-center justify-between z-40 shadow-lg">
          <div className="flex-1 overflow-x-auto mr-2">
            <StickyTabs
              activeTab={activeTab}
              onSelectTab={handleSelectTab}
              orientation="horizontal"
            />
          </div>

          <button
            onClick={() => {
              if (activeTab === "cover") {
                setShakeDaveAiTrigger((prev) => prev + 1)
                return
              }
              setIsMobileBotOpen(!isMobileBotOpen)
            }}
            className="bg-[#181824] hover:bg-black text-white px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold flex items-center gap-1 shadow-sm whitespace-nowrap flex-shrink-0"
          >
            <span>🤖</span>
            <span>{isMobileBotOpen ? "Hide Bot" : "Ask Bot"}</span>
          </button>
        </div>

        {/* Slide-up Mobile DaviesBot Drawer */}
        <AnimatePresence>
          {isMobileBotOpen && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="absolute inset-x-0 bottom-14 top-12 bg-[#FAF7F0] border-t-2 border-black/20 rounded-t-2xl shadow-2xl z-50 p-4 flex flex-col"
            >
              <div className="flex justify-between items-center pb-2 border-b border-black/10 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-xs font-bold text-black">
                    DaveAI Field Assistant
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileBotOpen(false)}
                  className="font-mono text-[11px] bg-[#181824] hover:bg-black text-white px-3 py-1 rounded-md font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Close</span>
                  <span>✕</span>
                </button>
              </div>

              <div className="flex-1 overflow-hidden">
                {!isDesktop && (
                  <DaviesBot
                    compact
                    onNavigateTab={(tab) => {
                      navigateToTab(tab)
                      setIsMobileBotOpen(false)
                    }}
                    onHighlightItem={setHighlightedItem}
                    onAction={(tab, hl) => {
                      handleBotAction(tab, hl)
                      if (tab) setIsMobileBotOpen(false)
                    }}
                    onPortfolioActions={runPortfolioActions}
                    initialQuery={initialBotQuery?.text}
                    initialQueryId={initialBotQuery?.id}
                    onClearInitialQuery={handleClearInitialQuery}
                    highlightedItem={highlightedItem}
                    focusTrigger={focusBotTrigger}
                    shakeTrigger={shakeDaveAiTrigger}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Media Lightbox / Modal */}
      <MediaModal media={activeMedia} onClose={() => setActiveMedia(null)} />

    </div>
  )
}
