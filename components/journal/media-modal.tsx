"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ChevronLeft, ChevronRight, Layers, X } from "lucide-react"

export interface MediaAlbumItem {
  src: string
  caption: string
  description?: string
  objectPosition?: string
}

export interface MediaAlbum {
  id: string
  title: string
  description?: string
  items: MediaAlbumItem[]
}

export interface MediaModalItem {
  type: "video" | "image" | "vimeo" | "album"
  src: string
  title: string
  cardTitle?: string
  description?: string
  vimeoId?: string
  albums?: MediaAlbum[]
  /** Opens an album's photo grid directly instead of the album gallery (used by DaveAI). */
  initialAlbumId?: string
}

interface MediaModalProps {
  media: MediaModalItem | null
  onClose: () => void
}

function getSpiralTransform(layerIndex: number) {
  if (layerIndex === 0) return { rotate: 0, x: 0, y: 0 }
  const dir = layerIndex % 2 === 1 ? -1 : 1
  const step = Math.min(layerIndex, 6)
  return {
    rotate: dir * (3 + step * 1.35),
    x: dir * (4 + step * 2.2),
    y: Math.min(layerIndex, 5) * 2.5,
  }
}

function getExpandedCardLayoutClass(count: number): { card: string; imgBox: string } {
  if (count <= 3) {
    return {
      card: "w-[195px] sm:w-[225px]",
      imgBox: "h-[210px] sm:h-[245px]",
    }
  }
  if (count === 5) {
    return {
      card: "w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)]",
      imgBox: "h-[155px] sm:h-[175px]",
    }
  }
  return {
    card: "w-[calc(50%-8px)] sm:w-[calc(25%-12px)]",
    imgBox: "h-[155px] sm:h-[175px]",
  }
}

export default function MediaModal({ media, onClose }: MediaModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
  const [hoveredAlbumId, setHoveredAlbumId] = useState<string | null>(null)

  const albums = media?.type === "album" && media.albums ? media.albums : []
  const activeAlbum = selectedAlbumId
    ? albums.find((album) => album.id === selectedAlbumId) ?? null
    : null
  const activePhoto =
    activeAlbum && selectedPhotoIndex !== null && activeAlbum.items[selectedPhotoIndex]
      ? activeAlbum.items[selectedPhotoIndex]
      : null

  useEffect(() => {
    const initialAlbum =
      media?.initialAlbumId && media.albums?.some((a) => a.id === media.initialAlbumId)
        ? media.initialAlbumId
        : null
    setSelectedAlbumId(initialAlbum)
    setSelectedPhotoIndex(null)
    setHoveredAlbumId(null)
  }, [media])

  useEffect(() => {
    const albumLen = activeAlbum?.items.length ?? 0
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        if (selectedPhotoIndex !== null) {
          setSelectedPhotoIndex(null)
        } else if (selectedAlbumId !== null) {
          setSelectedAlbumId(null)
        } else {
          onClose()
        }
      } else if (e.key === "ArrowRight" && selectedPhotoIndex !== null && albumLen > 1) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        setSelectedPhotoIndex((prev) => (prev === null ? null : (prev + 1) % albumLen))
      } else if (e.key === "ArrowLeft" && selectedPhotoIndex !== null && albumLen > 1) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        setSelectedPhotoIndex((prev) =>
          prev === null ? null : (prev - 1 + albumLen) % albumLen
        )
      }
    }

    if (media) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown, true)
      if (media.type === "video" && videoRef.current) {
        videoRef.current.muted = false
        videoRef.current.volume = 1
        videoRef.current.play().catch(() => {})
      }
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown, true)
    }
  }, [media, onClose, selectedAlbumId, selectedPhotoIndex, activeAlbum])

  const headerBadge = activePhoto
    ? activeAlbum?.title.toUpperCase()
    : activeAlbum
      ? `${activeAlbum.items.length} ${activeAlbum.items.length === 1 ? "PHOTO" : "PHOTOS"}`
      : media?.type === "album"
        ? "ALBUMS"
        : media?.type.toUpperCase()

  const headerTitle = activePhoto
    ? activePhoto.caption
    : activeAlbum
      ? activeAlbum.title
      : media?.title

  const headerDescription = activePhoto
    ? activePhoto.description
    : activeAlbum
      ? activeAlbum.description
      : media?.description

  const footerText = activePhoto
    ? "Press ESC to return to album"
    : activeAlbum
      ? "Click any photo to zoom · Press ESC for all albums"
      : media?.type === "album"
        ? "Click a spiral deck to fan out its photos"
        : "Press ESC to return to diary"

  return (
    <AnimatePresence>
      {media && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)] flex flex-col bg-[#FAF7F0] rounded-2xl border border-black/15 shadow-2xl overflow-hidden ${
              media.type === "album" ? "max-w-[1100px] p-3.5 sm:p-6" : "max-w-3xl p-4 sm:p-6"
            }`}
          >
            {/* Paper tape on top of the modal */}
            <div className="scotch-tape -top-2.5 left-1/2 -translate-x-1/2 w-32 rotate-[-1deg]" />

            {/* Modal Header */}
            <div className="flex-shrink-0 flex justify-between items-start gap-3 mb-2.5 sm:mb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  {activePhoto && activeAlbum ? (
                    <button
                      type="button"
                      onClick={() => setSelectedPhotoIndex(null)}
                      className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[#181824] bg-black/10 hover:bg-black/15 px-2 py-0.5 rounded transition-colors cursor-pointer"
                    >
                      <ArrowLeft size={11} />
                      <span>{activeAlbum.title}</span>
                    </button>
                  ) : (
                    activeAlbum && (
                      <button
                        type="button"
                        onClick={() => setSelectedAlbumId(null)}
                        className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[#181824] bg-black/10 hover:bg-black/15 px-2 py-0.5 rounded transition-colors cursor-pointer"
                      >
                        <ArrowLeft size={11} />
                        <span>All albums</span>
                      </button>
                    )
                  )}
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#71717A] bg-black/5 px-2 py-0.5 rounded">
                    FIELD EVIDENCE · {headerBadge}
                  </span>
                </div>
                <h3 className="font-script text-2xl sm:text-3xl font-bold text-[#181824] mt-0.5 sm:mt-1 leading-tight">
                  {headerTitle}
                </h3>
                {headerDescription && (
                  <p className="text-xs text-[#52525B] mt-0.5 max-w-3xl">
                    {headerDescription}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-black/10 text-[#71717A] hover:text-black transition-colors flex-shrink-0"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            {media.type === "album" && !activePhoto ? (
              <AnimatePresence mode="wait">
                {!activeAlbum ? (
                  /* Level 1: Gallery of Album Spiral Decks */
                  <motion.div
                    key="album-spiral-gallery"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.18 }}
                    className="flex-1 min-h-0 overflow-y-auto notebook-scroll [direction:rtl] [&>*]:[direction:ltr] pl-6 pr-5 pt-3 pb-5"
                  >
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-5">
                      {albums.map((album) => {
                        const isHovered = hoveredAlbumId === album.id
                        const reversedItems = [...album.items].reverse()
                        const total = album.items.length
                        return (
                          <button
                            key={album.id}
                            type="button"
                            onClick={() => {
                              setSelectedAlbumId(album.id)
                              setSelectedPhotoIndex(null)
                            }}
                            onMouseEnter={() => setHoveredAlbumId(album.id)}
                            onMouseLeave={() => setHoveredAlbumId(null)}
                            className="group relative w-[212px] sm:w-[218px] text-left cursor-pointer focus:outline-none"
                            aria-label={`Open ${album.title} (${total} photos)`}
                          >
                            {/* Spiral Stack Container */}
                            <div className="relative w-full h-[168px]">
                              {reversedItems.map((item, revIdx) => {
                                const layerIdx = total - 1 - revIdx
                                const base = getSpiralTransform(layerIdx)
                                const spread = isHovered ? 1.38 : 1
                                const targetRotate = base.rotate * spread
                                const targetX = base.x * spread
                                const targetY =
                                  layerIdx === 0 && isHovered ? -5 : base.y * (isHovered ? 1.25 : 1)
                                return (
                                  <motion.div
                                    key={`${album.id}-stack-${layerIdx}`}
                                    animate={{
                                      rotate: targetRotate,
                                      x: targetX,
                                      y: targetY,
                                      scale: layerIdx === 0 && isHovered ? 1.03 : 1,
                                    }}
                                    transition={{ type: "spring", stiffness: 280, damping: 22 }}
                                    style={{ zIndex: revIdx + 1 }}
                                    className="absolute inset-0 rounded-xs bg-white p-1.5 pb-1.5 border border-black/15 shadow-sm group-hover:shadow-md flex flex-col justify-between"
                                  >
                                    {layerIdx === 0 && (
                                      <div className="scotch-tape -top-2 left-1/2 -translate-x-1/2 w-12 bg-white/80 rotate-[-1deg]" />
                                    )}
                                    <div className="w-full h-[114px] rounded-[2px] overflow-hidden bg-[#F3EFE6] flex items-center justify-center">
                                      <img
                                        src={item.src}
                                        alt={layerIdx === 0 ? album.title : item.caption}
                                        className="w-full h-full object-contain"
                                      />
                                    </div>
                                    {layerIdx === 0 && (
                                      <div className="flex items-center justify-between gap-1.5 mt-1 px-0.5 min-h-[28px]">
                                        <span className="font-script text-[12px] font-bold text-[#181824] leading-[1.15]">
                                          {album.title}
                                        </span>
                                        <span className="inline-flex items-center gap-0.5 font-mono text-[9px] text-[#52525B] bg-black/5 px-1.5 py-0.5 rounded flex-shrink-0">
                                          <Layers size={9} />
                                          {total}
                                        </span>
                                      </div>
                                    )}
                                  </motion.div>
                                )
                              })}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                ) : (
                  /* Level 2: Clicked Album's Spiral Fanned Out (Other albums hidden) */
                  <motion.div
                    key={`album-expanded-${activeAlbum.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.16 }}
                    className="flex-1 min-h-0 overflow-y-auto notebook-scroll [direction:rtl] [&>*]:[direction:ltr] pl-3 pr-1 py-2"
                  >
                    <div className="flex flex-wrap justify-center gap-4">
                      {activeAlbum.items.map((item, idx) => {
                        const spiral = getSpiralTransform(idx)
                        const originX = (idx - (activeAlbum.items.length - 1) / 2) * -32 + spiral.x
                        const originY = idx === 0 ? 18 : -16 + spiral.y
                        const restRotate = idx % 2 === 0 ? -0.6 : 0.6
                        const cardLayout = getExpandedCardLayoutClass(activeAlbum.items.length)
                        return (
                          <motion.button
                            key={item.src + item.caption}
                            type="button"
                            onClick={() => setSelectedPhotoIndex(idx)}
                            initial={{
                              opacity: 0,
                              scale: 0.68,
                              x: originX,
                              y: originY,
                              rotate: spiral.rotate * 1.4,
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                              x: 0,
                              y: 0,
                              rotate: restRotate,
                            }}
                            whileHover={{
                              scale: 1.03,
                              rotate: 0,
                              y: -3,
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 250,
                              damping: 22,
                              delay: idx * 0.045,
                            }}
                            className={`${cardLayout.card} group relative rounded-xs bg-white p-1.5 pb-2 border border-black/15 shadow-sm hover:shadow-md transition-shadow text-left cursor-pointer`}
                          >
                            <div className="scotch-tape -top-2 left-1/2 -translate-x-1/2 w-10 bg-white/75 rotate-[-1deg]" />
                            <div className={`w-full ${cardLayout.imgBox} rounded-[2px] overflow-hidden bg-[#F3EFE6] flex items-center justify-center`}>
                              <img
                                src={item.src}
                                alt={item.caption}
                                className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-200"
                              />
                            </div>
                            <span className="block font-script text-[14px] font-semibold text-center text-[#181824] mt-1.5 leading-tight">
                              {item.caption}
                            </span>
                          </motion.button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            ) : (
              /* Level 3 or Single Media Lightbox */
              <div
                className={`relative rounded-xl overflow-hidden border border-black/10 aspect-video w-full flex-1 min-h-0 max-h-[calc(100dvh-11rem)] sm:max-h-[min(64vh,540px)] flex items-center justify-center shadow-inner ${
                  media.type === "image" || media.type === "album" ? "bg-[#F3EFE6]" : "bg-black"
                }`}
              >
                {media.type === "video" && (
                  <video
                    key={media.src}
                    ref={videoRef}
                    src={media.src}
                    controls
                    autoPlay
                    playsInline
                    onLoadedMetadata={(e) => {
                      const v = e.currentTarget
                      v.muted = false
                      v.volume = 1
                      v.play().catch(() => {})
                    }}
                    className="w-full h-full object-contain"
                  />
                )}

                {media.type === "vimeo" && (
                  <iframe
                    src={`https://player.vimeo.com/video/${media.vimeoId || media.src}?autoplay=1&title=0&byline=0&portrait=0`}
                    className="w-full h-full border-0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                )}

                {media.type === "image" && (
                  <img
                    src={media.src}
                    alt={media.title}
                    className="w-full h-full object-contain"
                  />
                )}

                {activePhoto && activeAlbum && (
                  <>
                    <img
                      src={activePhoto.src}
                      alt={activePhoto.caption}
                      className="w-full h-full object-contain"
                    />
                    {activeAlbum.items.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedPhotoIndex((prev) =>
                              prev === null
                                ? null
                                : (prev - 1 + activeAlbum.items.length) % activeAlbum.items.length
                            )
                          }
                          aria-label="Previous photo"
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 hover:bg-white text-[#181824] shadow-md transition-colors cursor-pointer"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedPhotoIndex((prev) =>
                              prev === null ? null : (prev + 1) % activeAlbum.items.length
                            )
                          }
                          aria-label="Next photo"
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 hover:bg-white text-[#181824] shadow-md transition-colors cursor-pointer"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex-shrink-0 mt-2.5 sm:mt-3 flex justify-between items-center gap-3 text-[11px] font-mono text-[#71717A]">
              <span>{footerText}</span>
              <button
                onClick={onClose}
                className="bg-[#181824] text-white px-3 py-1 rounded hover:bg-black transition-colors whitespace-nowrap flex-shrink-0 cursor-pointer"
              >
                Close ✕
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
