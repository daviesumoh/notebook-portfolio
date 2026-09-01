// ============================================================================
// CENTRAL PORTFOLIO CONFIGURATION (Single Source of Truth)
// ============================================================================
// Cloning this repo as a template?
// 1. Edit the data below (owner info, links, cover/about photos, experience, projects).
// 2. Put your private AI persona answers in `.env.local` under `DAVEAI_PERSONA_JSON`
//    (see `.env.example`) so your personal traits stay off public GitHub.
// ============================================================================

import type { MediaModalItem } from "@/components/journal/media-modal"

export interface ScrapbookPhoto {
  id: string
  src: string
  alt: string
  caption: string
  title: string
  description: string
  rotate: number
  imgClass: string
  cardWidth: number
  cardHeight: number
  desktopPos: { left: number; top: number; zIndex: number }
}

export interface AboutPhoto {
  src: string
  alt: string
  title: string
  description: string
  caption: string
  rotate: number
  tapeClass: string
  frameClass: string
  imgClass: string
}

export interface ExperienceEntry {
  id: string
  company: string
  role: string
  period: string
  logo?: string
  logoHeight?: number
  logoOffsetY?: number
  logoLabel?: string
  iconText: string
  iconBg: string
  headline: string
  narrative: string
  textColClass?: string
  thumbWidthClass?: string
  thumbMediaClass?: string
  thumbRotate?: number
  media?: MediaModalItem
}

export interface ProjectEntry {
  id: string
  highlightKey: string
  title: string
  category?: string
  description?: string
  techStack?: string
  techLabel?: string
  githubUrl?: string
  vimeoId?: string
}

export interface DaviesPersonalityProfile {
  favoriteMeal: string
  goToDrink: string
  flavorPreference: string
  lateNightSpot: string
  musicTaste: string
  chronotype: string
  favoriteMoviesAndShows: string
  favoriteBookAndPodcast: string
  workoutsAndSports: string
  favoriteSportsTeam: string
  topHobbyOutsideTech: string
  phone: string
  os: string
  primaryIdeAndAiTool: string
  favoriteLanguage: string
  themeMode: string
  favoriteProductTool: string
  preferredCompanyStage: string
  admiredProduct: string
  productApproach: string
  collaborationStyle: string
  biggestProductPeeve: string
  superpower: string
  communicationStyle: string
  metricsPhilosophy: string
  pets: string
  socialEnergy: string
  friendDescriptor: string
  favoriteTravelDestination: string
  styleVibe: string
  motto: string
  funFacts: string[]
}

// ----------------------------------------------------------------------------
// 1. OWNER & COVER CONFIGURATION
// ----------------------------------------------------------------------------

export const OWNER_INFO = {
  name: "Davies Umoh",
  firstName: "Davies",
  role: "Product Manager",
  location: "Toronto, CA",
  locationUpper: "TORONTO, CA",
  timezone: "America/Toronto",
  portraitSrc:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1770144940187%20%281%29-fhiVAXs3ZFVKVxtg0oy7xCFlQLV4h2.png",
  specialties: [
    "ML & Data Infrastructure",
    "VoiceAI",
    "Embedded Software",
  ],
  links: {
    linkedin: "https://linkedin.com/in/daviesumoh",
    email: "daviesumoh000@gmail.com",
    resumeMailto: "mailto:daviesumoh000@gmail.com?subject=Resume%20Request%20-%20Davies%20Umoh",
    calendly: "https://calendly.com/daviesumoh000/sync",
    github: "https://github.com/daviesumoh",
  },
}

export const DAVIES_PORTRAIT_SRC = OWNER_INFO.portraitSrc

export const COVER_PHOTOS: ScrapbookPhoto[] = [
  {
    id: "two-projectors",
    src: "/photos/two-projectors.jpg",
    alt: "Davies giving a Google x GitCloud Keynote between two projector screens",
    caption: "Google x GitCloud Keynote",
    title: "Google x GitCloud Keynote",
    description: "Presenting product & builder workflows alongside Google, Intuit, and Shopify partners",
    rotate: -2,
    imgClass: "w-full h-[86px] object-cover pointer-events-none",
    cardWidth: 152,
    cardHeight: 144,
    desktopPos: { left: 44, top: 0, zIndex: 20 },
  },
  {
    id: "speaking-group",
    src: "/photos/speaking-group.jpg",
    alt: "Davies judging and mentoring founders at Google Hackathon",
    caption: "Judge at Google Hackathon",
    title: "Judge at Google Hackathon",
    description: "Judging AI builds and sharing product feedback with student founders",
    rotate: -1,
    imgClass: "w-full h-[86px] object-cover pointer-events-none",
    cardWidth: 152,
    cardHeight: 144,
    desktopPos: { left: 12, top: 148, zIndex: 30 },
  },
  {
    id: "trimble-internship",
    src: "/photos/trimble-internship.jpg",
    alt: "Davies at his Trimble Internship",
    caption: "Trimble Internship",
    title: "Trimble Internship",
    description: "Product Internship working on POSPac Cloud & geospatial embedded systems",
    rotate: 0,
    imgClass: "w-full h-[158px] object-cover object-top pointer-events-none",
    cardWidth: 144,
    cardHeight: 200,
    desktopPos: { left: 174, top: 96, zIndex: 10 },
  },
  {
    id: "startup-summit",
    src: "/photos/startup-summit.jpg",
    alt: "Davies speaking as a panelist at StartUp Summit",
    caption: "Panelist at StartUp Summit",
    title: "Panelist at StartUp Summit",
    description: "Founder panel with Stan, Chexy, Boardy, MaRS IAF, Northside VC & Polarity",
    rotate: -1.5,
    imgClass: "w-full h-[116px] object-cover object-top pointer-events-none",
    cardWidth: 206,
    cardHeight: 158,
    desktopPos: { left: 82, top: 294, zIndex: 40 },
  },
]

export const MCMASTER_TALK_PHOTO: ScrapbookPhoto = {
  id: "mcmaster-podium",
  src: "/photos/mcmaster-podium.jpg",
  alt: "Davies giving a keynote at McMaster University",
  caption: "keynote at McMaster university",
  title: "Keynote at McMaster University",
  description: "Speaking on product engineering and building AI systems",
  rotate: -4,
  imgClass: "w-full h-[144px] object-cover object-top pointer-events-none",
  cardWidth: 126,
  cardHeight: 224,
  desktopPos: { left: 0, top: 0, zIndex: 30 },
}

// ----------------------------------------------------------------------------
// 2. ABOUT PAGE CONFIGURATION
// ----------------------------------------------------------------------------

export const ABOUT_CONFIG = {
  greeting: "Hi, I'm Davies",
  bioBullets: [
    "B.Engineering, McMaster University",
    "Experience in ML, Data infra & VoiceAI",
    "co-founded MockQ ($42k in Dev Funding) & GitCloud Community (300+ active members)",
  ],
  careerPath: [
    "EliseAI (product solutions, VoiceAI & CRM)",
    "Soda Data (product intern, ML & data quality)",
    "MockQ (co-founder, VoiceAI interviewer)",
    "GitCloud (co-founder, venture studio)",
    "Trimble (product intern, embedded software)",
  ],
  skills: [
    { label: "Programming", value: "Python, SQL, TypeScript, JavaScript" },
    { label: "ML & Data Infra", value: "PostgreSQL, PyTorch, Databricks, Docker" },
    { label: "Product & Analytics", value: "Figma, PostHog, Mixpanel" },
    { label: "Cloud & Protocols", value: "AWS & GCP" },
  ],
}

export const ABOUT_PHOTOS: AboutPhoto[] = [
  {
    src: "/photos/deltahacks-workshop.jpg",
    alt: "Davies teaching a Voice AI Agents workshop at GitCloud x DeltaHacks",
    title: "GitCloud x Deltahacks workshop",
    description: "Leading a hands-on Voice AI Agents workshop for hackers at DeltaHacks",
    caption: "GitCloud x Deltahacks workshop",
    rotate: -1.5,
    tapeClass: "rotate-[-1deg]",
    frameClass: "h-[92px] sm:h-[100px]",
    imgClass: "object-cover object-[50%_40%] pointer-events-none",
  },
  {
    src: "/photos/workshop-mentoring.jpg",
    alt: "Davies judging and mentoring builders at GDG Hackathon",
    title: "Judge at GDG Hackathon",
    description: "Judging AI agent projects and mentoring builders live at GDG Hackathon",
    caption: "Judge at GDG Hackathon",
    rotate: 1.5,
    tapeClass: "rotate-1",
    frameClass: "h-[92px] sm:h-[100px]",
    imgClass: "object-cover object-center pointer-events-none",
  },
  {
    src: "/photos/panel-qa-mic.jpg",
    alt: "Davies speaking on microphone at a founder panel Q&A",
    title: "Founder Panel & Q&A",
    description: "Speaking on product engineering, voice AI, and shipping velocity",
    caption: "founder q&a · toronto",
    rotate: -1,
    tapeClass: "rotate-[-1deg]",
    frameClass: "h-[122px] sm:h-[132px]",
    imgClass: "object-cover object-[50%_22%] pointer-events-none",
  },
]

// ----------------------------------------------------------------------------
// 3. EXPERIENCE PAGE CONFIGURATION
// ----------------------------------------------------------------------------

export const EXPERIENCES: ExperienceEntry[] = [
  {
    id: "elise",
    company: "EliseAI",
    role: "Product Solutions",
    period: "JUN 2026 – PRESENT · TORONTO",
    logo: "/eliseai-logo.png",
    logoHeight: 19,
    iconText: "EAI",
    iconBg: "transparent",
    headline: "EliseAI — Product Solutions",
    narrative:
      "Built debugging automation in Postman & DataDog to isolate root cause on recurring platform bugs, cutting user-reported production incidents by 14%.",
    thumbWidthClass: "w-[104px] lg:w-[114px] min-[1400px]:w-[122px] min-[1500px]:w-[158px]",
    thumbMediaClass: "h-[60px] min-[1400px]:h-[60px] min-[1500px]:h-[66px]",
    thumbRotate: 1,
    media: {
      type: "video" as const,
      src: "/videos/my-work-eliseai.mp4",
      cardTitle: "My work @ EliseAI",
      title: "Apollo — EliseAI Product Demo",
      description:
        "EliseAI's Apollo platform where I automated bug isolation in Postman & DataDog to cut incidents by 14%.",
    },
  },
  {
    id: "soda",
    company: "Soda Data",
    role: "Product Intern",
    period: "SEP 2025 – APR 2026 · TORONTO",
    logo: "/soda-logo.png",
    logoHeight: 16,
    iconText: "SODA",
    iconBg: "transparent",
    headline: "Soda Data — Product Intern",
    narrative:
      "Scaled automated anomaly detection across 1B+ rows with Airflow & Databricks, cutting false-positives by 70% compared to Meta's Prophet.",
    thumbWidthClass: "w-[104px] lg:w-[114px] min-[1400px]:w-[138px] min-[1500px]:w-[164px]",
    thumbMediaClass: "h-[62px] min-[1400px]:h-[72px] min-[1500px]:h-[80px]",
    thumbRotate: -1,
    media: {
      type: "video" as const,
      src: "/videos/my-work-soda.mp4",
      cardTitle: "My work @ Soda Data",
      title: "Soda Contract Copilot (SodaAI)",
      description:
        "Data-contract copilot running automated checks alongside our Airflow & Databricks anomaly detection pipeline.",
    },
  },
  {
    id: "mockq",
    company: "MockQ",
    role: "Co-Founder",
    period: "SEP 2025 – JUL 2026 · TORONTO",
    logo: "/mockq-logo.png",
    logoHeight: 15,
    iconText: "MQ",
    iconBg: "transparent",
    headline: "MockQ — Co-Founder",
    narrative:
      "Built real-time VoiceAI interviewer synchronizing AI voice and live coding IDE for coding interviews, securing $42k in Dev Funding.",
    thumbWidthClass: "w-[104px] lg:w-[114px] min-[1400px]:w-[144px] min-[1500px]:w-[172px]",
    thumbMediaClass: "h-[62px] min-[1400px]:h-[74px] min-[1500px]:h-[82px]",
    thumbRotate: 1.5,
    media: {
      type: "video" as const,
      src: "/videos/my-work-mockq.mp4",
      cardTitle: "My StartUp, MockQ AI",
      title: "VoiceAI Interviewer & Live Coding IDE",
      description:
        "Synced AI voice interviewer and live coding IDE built at MockQ to run real-time technical interviews.",
    },
  },
  {
    id: "gitcloud",
    company: "GitCloud",
    role: "Co-Founder",
    period: "APR 2025 – MAY 2026 · TORONTO",
    logo: "/gitcloud-logo.png",
    logoHeight: 20,
    logoOffsetY: -3,
    logoLabel: "GitCloud",
    iconText: "GC",
    iconBg: "transparent",
    headline: "GitCloud — Co-Founder",
    narrative:
      "Founded student venture studio incubating 300+ builders, partnering with Google, Intuit, tech firms & VCs to upskill founders in product & GTM.",
    thumbWidthClass: "w-[104px] lg:w-[114px] min-[1400px]:w-[136px] min-[1500px]:w-[164px]",
    thumbMediaClass: "h-[62px] min-[1400px]:h-[72px] min-[1500px]:h-[80px]",
    thumbRotate: -1.5,
    media: {
      type: "album" as const,
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1777911996606-Gce7RfVtOaRCFKFy8sXfsUqajTJAsK.jpg",
      cardTitle: "GitCloud's Initiatives",
      title: "GitCloud's Initiatives",
      description:
        "Workshops, hackathons, and events partnering with Google, Shopify, Intuit, Boardy, Stan, DeltaHacks, and more for 300+ founders & 1000+ builders.",
      albums: [
        {
          id: "google-hackathon",
          title: "Google x GitCloud Hackathon",
          description:
            "Google AI Workshop & hackathon at Google Toronto featuring Gemini, Firebase, Stitch, engineering mentors, and live team demos.",
          items: [
            {
              src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1777911996606-Gce7RfVtOaRCFKFy8sXfsUqajTJAsK.jpg",
              caption: "Google x GitCloud Group",
              description:
                "300+ builders and the GitCloud community gathered at Google Toronto for the hackathon.",
            },
            {
              src: "/photos/speaking-group.jpg",
              caption: "Judges at Google Hackathon",
              description:
                "Judging AI builds and giving product feedback to student teams at Google Toronto.",
            },
            {
              src: "/photos/two-projectors.jpg",
              caption: "Google Hackathon Keynote",
              description:
                "Opening keynote at our Google x GitCloud hackathon for 300+ incubated builders.",
            },
            {
              src: "/photos/google-hackathon-mentoring.jpg",
              caption: "Team Demo & Mentoring",
              description:
                "Hands-on technical mentoring as student founders debug and pitch their AI prototypes.",
              objectPosition: "50% 25%",
            },
            {
              src: "/photos/google-cloud-mentors.jpg",
              caption: "Google Cloud Mentors",
              description:
                "Google Cloud engineers and hackathon judges supporting incubated student teams.",
              objectPosition: "50% 34%",
            },
            {
              src: "/photos/google-hackathon-builders.jpg",
              caption: "Builders Collaborating",
              description:
                "Student builders shipping prototypes together across the Google x GitCloud hackathon floor.",
              objectPosition: "50% 28%",
            },
            {
              src: "/photos/google-hackathon-food.jpg",
              caption: "Food & Networking",
              description:
                "Builders grabbing pizza and connecting between hacking sprints at Google Toronto.",
              objectPosition: "50% 42%",
            },
            {
              src: "/photos/google-hackathon-poster.jpg",
              caption: "Workshop Poster",
              description:
                "Event flyer for the GitCloud x Google AI Workshop at the Google Toronto Office with Gemini, Firebase, and Stitch.",
              objectPosition: "50% 34%",
            },
          ],
        },
        {
          id: "startup-summit",
          title: "GitCloud StartUp Summit",
          description:
            "Founder & VC summit bringing together operators from Stan, MaRS IAF, Clover Labs, Boardy, Northside VC, Polarity, Chexy & Friedmann AI.",
          items: [
            {
              src: "/photos/startup-summit.jpg",
              caption: "Panelist at StartUp Summit",
              description:
                "Founder panel covering product execution and GTM alongside Toronto startups and VCs.",
            },
            {
              src: "/photos/startup-summit-lineup.jpg",
              caption: "Speaker Lineup",
              description:
                "StartUp Summit speaker lineup featuring founders, VCs, and engineers across Toronto startups.",
              objectPosition: "50% 18%",
            },
            {
              src: "/photos/startup-summit-moderating.jpg",
              caption: "Founder Panel",
              description:
                "Panel discussion with operators from Stan, Boardy, Northside VC & Polarity at StartUp Summit.",
              objectPosition: "40% 35%",
            },
            {
              src: "/photos/startup-summit-qa.jpg",
              caption: "Audience Q&A",
              description:
                "Live founder Q&A with student builders during GitCloud StartUp Summit.",
            },
            {
              src: "/photos/startup-summit-networking.jpg",
              caption: "Summit Networking",
              description:
                "Founders and operators connecting after panels at StartUp Summit.",
            },
          ],
        },
        {
          id: "shopify-panel",
          title: "Shopify x GitCloud Panel",
          description:
            "Sync @ Shopify panel at Shopify Toronto with engineers and founders from Shopify, Amazon, Dropbox, PureInt, and Point72.",
          items: [
            {
              src: "/photos/shopify-panel-group.jpg",
              caption: "Shopify x GitCloud Group",
              description:
                "Closing group photo with builders and panelists after Shopify Sync w/ GitCloud.",
              objectPosition: "50% 38%",
            },
            {
              src: "/photos/shopify-panel-discussion.jpg",
              caption: "Shopify Sync Panel",
              description:
                "Panel discussion on startup culture, AI, and engineering with Shopify, Amazon, Dropbox, and PureInt speakers.",
              objectPosition: "45% 42%",
            },
            {
              src: "/photos/shopify-panel-poster.jpg",
              caption: "Sync @ Shopify Lineup",
              description:
                "Event poster featuring engineers from Shopify, Amazon, Dropbox, PureInt, and Point72.",
              objectPosition: "50% 24%",
            },
            {
              src: "/photos/shopify-panel-audience.jpg",
              caption: "Full House Audience",
              description:
                "Student builders packed the Shopify screening room for Q&A and product discussions.",
              objectPosition: "50% 42%",
            },
            {
              src: "/photos/shopify-panel-builders.jpg",
              caption: "Community Builders",
              description:
                "Student founders connecting before the Shopify x GitCloud panel.",
              objectPosition: "50% 35%",
            },
          ],
        },
        {
          id: "intuit-tour",
          title: "Intuit x GitCloud",
          description:
            "GitCloud x Intuit Toronto office tour with Intuit engineers & recruiters, live project demos, and 1-on-1 networking.",
          items: [
            {
              src: "/photos/intuit-kickoff.jpg",
              caption: "Office Tour Kickoff",
              description:
                "Welcoming student builders to the Intuit Toronto office for lightning demos and engineering talks.",
              objectPosition: "50% 62%",
            },
            {
              src: "/photos/intuit-poster.jpg",
              caption: "Office Tour Poster",
              description:
                "Event poster for the GitCloud x Intuit Office Tour in Toronto with Intuit engineers and recruiters.",
              objectPosition: "50% 32%",
            },
            {
              src: "/photos/intuit-panel-qa.jpg",
              caption: "Intuit Panel & Q&A",
              description:
                "Intuit engineers sharing career insights and product stories with student builders.",
              objectPosition: "45% 68%",
            },
            {
              src: "/photos/intuit-networking.jpg",
              caption: "Engineer Networking",
              description:
                "1-on-1 networking between student builders, Intuit engineers, and recruiters.",
              objectPosition: "50% 56%",
            },
            {
              src: "/photos/intuit-team-selfie.jpg",
              caption: "Builders @ Intuit",
              description:
                "GitCloud team and student founders wrapping up project demos at Intuit Toronto.",
              objectPosition: "50% 38%",
            },
          ],
        },
        {
          id: "gdg-hackathon",
          title: "GDG x GitCloud Hackathon",
          description:
            "GitCloud sponsor track at GDG On Campus Mac-a-Thon 2026 ($500 cash & API credits), mentoring teams and judging AI builds.",
          items: [
            {
              src: "/photos/gdg-macathon-group.jpg",
              caption: "Mac-a-Thon 2026 Group",
              description:
                "Student builders, mentors, and organizers gathered for GDG On Campus Mac-a-Thon 2026.",
              objectPosition: "50% 52%",
            },
            {
              src: "/photos/workshop-mentoring.jpg",
              caption: "Judge at GDG Hackathon",
              description:
                "Mentoring student teams and judging final demos at GDG x GitCloud.",
            },
            {
              src: "/photos/gdg-blindspot-winners.jpg",
              caption: "GitCloud Track Winners",
              description:
                "Presenting awards to BlindSpot, winners of the GitCloud track at GDG McMaster Mac-a-Thon.",
              objectPosition: "50% 78%",
            },
            {
              src: "/photos/gdg-keynote-speaking.jpg",
              caption: "Closing Remarks",
              description:
                "Delivering sponsor remarks and announcing prize winners with GDG On Campus organizers.",
              objectPosition: "50% 74%",
            },
          ],
        },
        {
          id: "deltahacks",
          title: "DeltaHacks x GitCloud AI Workshop",
          description:
            "Hands-on Voice AI Agent workshop at DeltaHacks led alongside engineers from Soda Data, Dropbox, Wealthsimple, and Microsoft.",
          items: [
            {
              src: "/photos/deltahacks-workshop.jpg",
              caption: "GitCloud x DeltaHacks",
              description:
                "Leading a Voice AI Agents workshop for student builders at DeltaHacks.",
            },
            {
              src: "/photos/deltahacks-poster.jpg",
              caption: "Workshop Poster",
              description:
                "Voice AI Agent Workshop flyer at DeltaHacks featuring engineers from GitCloud, Soda Data, Dropbox, Wealthsimple, and Microsoft.",
              objectPosition: "50% 24%",
            },
            {
              src: "/photos/deltahacks-builders.jpg",
              caption: "Workshop Builders",
              description:
                "Student hackers building voice AI workflows together with Python, OpenAI, ElevenLabs, and MCP.",
              objectPosition: "50% 42%",
            },
            {
              src: "/photos/deltahacks-room.jpg",
              caption: "Workshop Session",
              description:
                "Full lecture hall during the GitCloud x DeltaHacks Voice AI Agent workshop at McMaster University.",
              objectPosition: "50% 58%",
            },
          ],
        },
        {
          id: "gitcloud-team",
          title: "GitCloud Team",
          description:
            "The GitCloud executive team organizing venture studio programming, workshops, hackathons, and founder summits across Toronto.",
          items: [
            {
              src: "/photos/gitcloud-team-portrait.jpg",
              caption: "GitCloud Core Team",
              description:
                "The student venture studio team behind GitCloud's workshops, hackathons, and StartUp Summit.",
              objectPosition: "50% 50%",
            },
            {
              src: "/photos/gitcloud-team-huddle.jpg",
              caption: "Team Huddle",
              description:
                "GitCloud executive team collaborating between venture studio sessions.",
              objectPosition: "50% 48%",
            },
            {
              src: "/photos/gitcloud-team-full.jpg",
              caption: "GitCloud Full Team",
              description:
                "GitCloud organizing team and builders after a Toronto startup session.",
              objectPosition: "50% 54%",
            },
          ],
        },
      ],
    },
  },
  {
    id: "trimble",
    company: "Trimble Inc.",
    role: "Product Intern",
    period: "MAY 2024 – MAY 2025 · TORONTO",
    logo: "/trimble-logo.png",
    logoHeight: 17,
    iconText: "TRMB",
    iconBg: "transparent",
    headline: "Trimble Inc. — Product Intern",
    narrative:
      "Defined PRDs for POSPac Cloud geospatial data processing, boosting cloud speeds by 27% via REST API integrations.",
    thumbWidthClass: "w-[104px] lg:w-[118px] min-[1400px]:w-[164px] min-[1500px]:w-[198px]",
    thumbMediaClass: "h-[62px] min-[1400px]:h-[84px] min-[1500px]:h-[96px]",
    thumbRotate: 1,
    media: {
      type: "image" as const,
      src: "/photos/my-work-trimble.avif",
      cardTitle: "My work @ Trimble",
      title: "POSPac UAV & PP-RTX Geospatial Monitor",
      description:
        "GNSS trajectory and PP-RTX view in Trimble's POSPac suite, tied to the POSPac Cloud REST API PRDs.",
    },
  },
]

// ----------------------------------------------------------------------------
// 4. PROJECTS PAGE CONFIGURATION
// ----------------------------------------------------------------------------

export const PROJECTS: ProjectEntry[] = [
  {
    id: "voiceai-claude",
    highlightKey: "voiceai",
    title: "VoiceAI for Claude Code CLI",
    description:
      "A low-latency conversational voice layer for the Claude Code app and CLI on macOS with real-time speech input and output.",
    techStack: "Swift · Node.js · TypeScript",
    githubUrl: "https://github.com/daviesumoh/claude-code-voice-agent",
  },
  {
    id: "crypto-risk",
    highlightKey: "crypto",
    title: "Crypto Fraud ML Model",
    description:
      "Real-time Ethereum Virtual Machine transaction risk scoring with revm simulation, multi-hop heuristics, ONNX/GBDT ML sidecar, and Next.js analyst workbench.",
    techStack: "scikit-learn · Rust · ONNX · React",
    githubUrl: "https://github.com/daviesumoh/Crypto-Fraud-ML-Model-Coingauge",
  },
  {
    id: "phone-agent",
    highlightKey: "phone",
    title: "Computer Use Phone Agent",
  },
]

// ----------------------------------------------------------------------------
// 5. PUBLIC-SAFE DEFAULT PERSONA (Overridden by DAVEAI_PERSONA_JSON in .env.local)
// ----------------------------------------------------------------------------
// Keep private personal answers out of committed source files by setting
// `DAVEAI_PERSONA_JSON` in `.env.local` (and in Vercel Environment Variables).

export const DEFAULT_PERSONA_PROFILE: DaviesPersonalityProfile = {
  favoriteMeal: "Home-cooked comfort food",
  goToDrink: "Tea or fresh juice",
  flavorPreference: "Sweet",
  lateNightSpot: "Local late-night fusion spot",
  musicTaste: "R&B and Hip-Hop",
  chronotype: "Night owl",
  favoriteMoviesAndShows: "Sci-fi and superhero classics",
  favoriteBookAndPodcast: "Epic fantasy books and first-principles tech podcasts",
  workoutsAndSports: "Gym training and soccer",
  favoriteSportsTeam: "Premier League soccer",
  topHobbyOutsideTech: "Motorsports and soccer",
  phone: "iPhone",
  os: "macOS",
  primaryIdeAndAiTool: "Modern AI-native IDEs",
  favoriteLanguage: "Python and Rust",
  themeMode: "Dark mode",
  favoriteProductTool: "Mobbin & Figma",
  preferredCompanyStage: "Scaling",
  admiredProduct: "High-craft developer and AI products",
  productApproach: "Specs first",
  collaborationStyle: "Team deep work",
  biggestProductPeeve: "Unrefined AI-generated UI without human polish",
  superpower: "Writing clear, high-leverage product specs",
  communicationStyle: "Quick call",
  metricsPhilosophy: "Obsessively tracks product and system metrics end-to-end",
  pets: "Dogs",
  socialEnergy: "Extrovert",
  friendDescriptor: "Inquisitive",
  favoriteTravelDestination: "Tropical island destinations",
  styleVibe: "Classic tailored look",
  motto: "Keep shipping and creating value",
  funFacts: [
    "B.Engineering graduate from McMaster University who co-founded GitCloud (300+ builders) and MockQ ($42k dev funding).",
    "Writes product specs first and loves high-craft UI and low-latency AI systems.",
  ],
}

