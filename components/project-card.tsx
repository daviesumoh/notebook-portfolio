"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Script from "next/script"

interface ProjectCardProps {
  title: string
  techStack: string[]
  description: string
  videoId: string
  projectLink?: string
}

export default function ProjectCard({ title, techStack, description, videoId }: ProjectCardProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-border/60 bg-card/50 hover:border-border hover:bg-card transition-all overflow-hidden"
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-3 text-foreground font-mono">{title}</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {techStack.map((tech, index) => (
            <span key={index} className="px-2.5 py-1 bg-secondary text-muted-foreground text-xs rounded-lg font-mono">
              {tech}
            </span>
          ))}
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>

      <div className="relative border-t border-border/60">
        {isClient && (
          <>
            <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
              <iframe
                src={`https://player.vimeo.com/video/${videoId}?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479`}
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
                title={title}
              ></iframe>
            </div>
            <Script src="https://player.vimeo.com/api/player.js" />
          </>
        )}
      </div>
    </motion.div>
  )
}

// Added BiometricAI project card

// Added POSPac Cloud project card
