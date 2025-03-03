"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

interface ScrollIndicatorProps {
  onClick: () => void
}

export default function ScrollIndicator({ onClick }: ScrollIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: 1.5,
        y: {
          duration: 0.8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        },
      }}
      className="flex flex-col items-center cursor-pointer"
      onClick={onClick}
    >
      <span className="text-white/60 text-sm mb-2">Scroll Down</span>
      <ChevronDown className="h-6 w-6 text-primary animate-bounce" />
    </motion.div>
  )
}
