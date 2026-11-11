"use client"

import { motion } from "framer-motion"

const skills = [
  {
    category: "Programming",
    items: ["Python", "SQL", "JavaScript", "React", "Next.js", "PyTorch"],
  },
  { category: "Tools", items: ["Figma", "Cursor", "v0.dev", "Lovable.dev", "PostHog", "PowerBI", "Mixpanel"] },
  { category: "Cloud", items: ["AWS", "Google App Engine", "Docker"] },
]

const education = [
  {
    degree: "Bachelor of Applied Science Engineering",
    university: "McMaster University",
    location: "Hamilton, ON",
    graduation: "Graduation – 05/2026",
    awards: ["Honors Level 3 Scholarship", "Top 10 McMasterU Cornerstone Engineering Project"],
    involvement: ["McMaster AI Society (VP)", "National Society of Black Engineers", "Engineers Without Borders"],
  },
]

export default function SkillsEducation() {
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        <h3 className="text-lg font-semibold mb-6 text-foreground font-mono">Technical Skills</h3>
        <div className="space-y-6">
          {skills.map((skillGroup, index) => (
            <div key={index}>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 font-mono">
                {skillGroup.category}
              </h4>
              <div className="flex flex-wrap gap-2">
                {skillGroup.items.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-secondary border border-border/60 rounded-lg text-muted-foreground text-sm font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold mb-6 text-foreground font-mono">Education</h3>
        {education.map((edu, index) => (
          <div key={index} className="rounded-2xl border border-border/60 bg-card/50 p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
              <h4 className="text-base font-semibold text-foreground">{edu.degree}</h4>
              <span className="text-muted-foreground text-xs font-mono">{edu.graduation}</span>
            </div>
            <div className="mb-4">
              <span className="text-muted-foreground text-sm">
                {edu.university}, {edu.location}
              </span>
            </div>

            <div className="mb-4">
              <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 font-mono">Awards</h5>
              <ul className="space-y-1">
                {edu.awards.map((award, i) => (
                  <li key={i} className="flex items-start text-sm">
                    <span className="text-accent mr-2 font-mono">→</span>
                    <span className="text-muted-foreground">{award}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 font-mono">Extracurricular</h5>
              <ul className="space-y-1">
                {edu.involvement.map((item, i) => (
                  <li key={i} className="flex items-start text-sm">
                    <span className="text-accent mr-2 font-mono">→</span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
