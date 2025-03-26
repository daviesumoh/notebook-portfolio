"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface MediaItem {
  type: "video" | "image"
  src: string
  title: string
  description?: string
}

interface WorkExperienceItem {
  company: string
  location: string
  position: string
  period: string
  responsibilities: string[]
  logo?: string
  logoAlt?: string
  bgColor?: string
  media?: MediaItem[]
}

export default function WorkExperience({ imagesLoaded = true, onModalChange }: { imagesLoaded?: boolean; onModalChange?: (isOpen: boolean) => void }) {
  const [selectedExperience, setSelectedExperience] = useState<WorkExperienceItem | null>(null)

  // Lock body scroll when modal is open and notify parent
  useEffect(() => {
    const isOpen = !!selectedExperience
    if (selectedExperience) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    onModalChange?.(isOpen)
    return () => {
      document.body.style.overflow = ""
    }
  }, [selectedExperience, onModalChange])

  const experiences: WorkExperienceItem[] = [
    {
      company: "Soda Data",
      location: "Toronto, Canada",
      position: "Product Intern",
      period: "09/2025 — 04/2026",
      responsibilities: [
        "Scaled Soda Cloud's data quality roadmap, launching Airflow and Databricks integrations that automate anomaly detection across 1B+ rows with a 70% lower false-positive rate than Meta's Prophet.",
        "Translated user interviews into prioritized features for SodaAI, a no-code AI assistant that automates data contract and SQL data checks, boosting non-technical user adoption by 38%.",
        "Built PostHog conversion funnels to identify drop-off in ETL workflows, cutting churn by 22% via target UX refinement.",
      ],
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sodadata_logo%20%282%29-O8OjROaYNIeWwETvqSQDphcow9Xiuu.jpg",
      logoAlt: "Soda Data",
      bgColor: "#00d4aa",
      media: [
        {
          type: "video",
          src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9S35Z8IlcVaSCBVTyFiSieCj0-J9NfXeDA0y6II5aulmmxSuoVeQaUbD.mp4",
          title: "SodaAI",
          description: "AI-powered data quality assistant",
        },
        {
          type: "image",
          src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/i04IfelGLgZQpxDZ9g3gtPAs4lM-kqbFkkXLH9R06Xtf8MpSWozaydnqu0.avif",
          title: "Agentic Data Cleansing",
          description: "Automated data quality workflows",
        },
      ],
    },
    {
      company: "MockQ",
      location: "Toronto, Canada",
      position: "Co-Founder",
      period: "01/2026 — Present",
      responsibilities: [
        "Defined the roadmap for an AI coding interview platform, translating requirements into proprietary infrastructure and functional prototypes for a 600-person waitlist.",
        "Built a real-time AI interviewer synchronizing AI voice and live coding IDE to simulate technical coding interviews.",
        "Executed pitches to various Venture Capital firms, backed by market research, securing $42,000 in developer funding.",
      ],
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20%283%29.PNG-Ryony9xElPtuOVuUnHacvr5VemOraw.png",
      logoAlt: "MockQ",
      bgColor: "#000000",
      media: [
        {
          type: "image",
          src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oK052WhSm0QWtVsyBuYOY7ia7asbXy.png",
          title: "AI Technical Recruiter",
          description: "Real-time AI interviewer with live coding environment",
        },
      ],
    },
    {
      company: "GitCloud",
      location: "Toronto, Canada",
      position: "Co-Founder & President",
      period: "04/2025 — Present",
      responsibilities: [
        "Founded a university venture studio incubating student founders, leading product lifecycle from user research to prototyping and Go-to-Market Strategy.",
        "Spearheaded partnerships with Google & Polarity to deliver workshops on AI engineering, product strategy, and competitor analysis, upskill 60+ members in product development.",
        "Scaled GitCloud to a thriving community of 300+ active members through strategic outreach and engaging programming.",
      ],
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gitcloudstudio_logo%20%281%29-z7PfkQgBE7y8tx8up8fuoAg9EDOvqn.jpg",
      logoAlt: "GitCloud",
      bgColor: "#000000",
      media: [
        {
          type: "image",
          src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1777911996606-Gce7RfVtOaRCFKFy8sXfsUqajTJAsK.jpg",
          title: "Google x GitCloud Hackathon",
          description: "Hackathon event hosted at Google",
        },
        {
          type: "image",
          src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1775150424804%20%281%29-omRPLqxjwmVE0D0wc0PZxLdFFkaKVf.jpg",
          title: "Shopify x GitCloud Sync",
          description: "Partnership event with Shopify",
        },
        {
          type: "image",
          src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC02812.png-6tqubZITcoJ1AiXMeXWDwF6GTg9LFn.jpeg",
          title: "StartUp Summit ft. Boardy, Stan, Chexy, MaRS IAF, Polarity, Northside VC & more",
          description: "Panel discussion with startup founders and investors",
        },
      ],
    },
    {
      company: "Trimble Inc.",
      location: "Toronto, Canada",
      position: "Product Intern",
      period: "05/2024 — 05/2025",
      responsibilities: [
        "Defined the product requirements for POSPac Cloud, a geospatial data-processing SaaS, by translating user research into prioritized features, reducing go-to-market time by 21%.",
        "Launched REST API features through sprints with engineering & QA, improving cloud data processing times by 27%.",
      ],
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/trimble_logo-j01gxoDGf3agLZhRDwjQZsDY38Vbpw.jpg",
      logoAlt: "Trimble Inc.",
      bgColor: "#005f9e",
      media: [
        {
          type: "image",
          src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/apx15-hero-image-uJpI7QyBygW7mFfSQ1JAFpmDRUs2W5.png",
          title: "PX1-RTX",
          description: "Trimble GNSS/INS positioning module",
        },
        {
          type: "image",
          src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pos-pac-complete-1-zuAXD7PDHLk6EO2X2X8hhOwAEE8RxA.avif",
          title: "POSPac Cloud",
          description: "Geospatial data processing SaaS platform",
        },
      ],
    },
  ]

  return (
    <>
      {/* Experience Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {experiences.map((experience, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => setSelectedExperience(experience)}
            className="group rounded-xl border border-border/60 bg-card/50 hover:border-border hover:bg-card transition-all duration-200 cursor-pointer p-5"
          >
            <div className="flex items-start gap-4">
              <div
                className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
                style={{ backgroundColor: experience.bgColor || "#333" }}
              >
                {imagesLoaded && experience.logo ? (
                  <img
                    src={experience.logo}
                    alt={experience.logoAlt || experience.company}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold">{experience.company.split(" ")[0][0]}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-foreground group-hover:text-accent transition-colors">
                  {experience.position}
                </h3>
                <p className="text-muted-foreground text-sm">{experience.company}</p>
                <p className="text-muted-foreground/60 text-xs mt-1 font-mono">{experience.period}</p>
                <p className="text-accent/70 text-xs mt-2 font-mono group-hover:text-accent transition-colors">Click for detailed overview</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {selectedExperience && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
            onClick={() => setSelectedExperience(null)}
          >
            {/* Backdrop with blur */}
            <div className="fixed inset-0 bg-black/80 backdrop-blur-xl" />
            
            {/* Modal Container - properly centered with safe margins */}
            <div className="relative min-h-full flex items-center justify-center py-8 px-4 md:py-12 md:px-8">
              {/* Terminal-style Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl rounded-2xl border border-border/60 overflow-hidden shadow-2xl"
                style={{ backgroundColor: "#141414" }}
              >
                {/* Terminal Header */}
                <div
                  className="sticky top-0 z-10 flex items-center justify-between border-b border-border/60 px-4 py-3"
                  style={{ backgroundColor: "#1a1a1a" }}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => setSelectedExperience(null)}
                        className="h-3 w-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
                      />
                      <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                      <div className="h-3 w-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs text-muted-foreground font-mono truncate">
                      {selectedExperience.company.toLowerCase().replace(/\s+/g, "-")}/{selectedExperience.position.toLowerCase().replace(/\s+/g, "-")}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedExperience(null)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground flex-shrink-0 ml-2"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[70vh] p-6" style={{ backgroundColor: "#0d0d0d" }}>
                {/* Header */}
                <div className="flex items-start gap-4 mb-8">
                  <div
                    className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: selectedExperience.bgColor || "#333" }}
                  >
                    {imagesLoaded && selectedExperience.logo ? (
                      <img
                        src={selectedExperience.logo}
                        alt={selectedExperience.logoAlt || selectedExperience.company}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold text-lg">
                        {selectedExperience.company.split(" ")[0][0]}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-semibold text-foreground font-mono">
                      {selectedExperience.position}
                    </h2>
                    <p className="text-muted-foreground">{selectedExperience.company}</p>
                    <p className="text-muted-foreground/60 text-sm mt-1 font-mono">
                      {selectedExperience.location} · {selectedExperience.period}
                    </p>
                  </div>
                </div>

                {/* Responsibilities - Key Contributions First */}
                <div className="mb-8">
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4 font-mono">
                    // Key Contributions
                  </h3>
                  <ul className="space-y-3">
                    {selectedExperience.responsibilities.map((responsibility, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-muted-foreground text-sm"
                      >
                        <span className="text-accent font-mono mt-0.5">→</span>
                        <span className="leading-relaxed">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Media Section - Project Showcase Second */}
                {selectedExperience.media && selectedExperience.media.length > 0 && (
                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4 font-mono">
                      // Project Showcase
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {selectedExperience.media.map((item, mediaIndex) => (
                        <div
                          key={mediaIndex}
                          className="rounded-xl overflow-hidden border border-border/40"
                          style={{ backgroundColor: "#1c1c1c" }}
                        >
                          {item.type === "video" ? (
                            <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                              <video
                                src={item.src}
                                className="w-full h-full object-contain bg-black"
                                autoPlay
                                playsInline
                                muted
                                loop
                              />
                            </div>
                          ) : (
                            <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                              <img
                                src={item.src}
                                alt={item.title}
                                className="w-full h-full object-contain bg-black"
                              />
                            </div>
                          )}
                          <div className="px-4 py-3 border-t border-border/40">
                            <h4 className="text-foreground font-medium">{item.title}</h4>
                            {item.description && (
                              <p className="text-muted-foreground text-sm">{item.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Added Trimble Inc. role

// Updated Trimble narrative
