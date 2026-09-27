import type { MediaModalItem } from "./media-modal"
import { EXPERIENCES } from "./pages/experience-page"
import { COVER_PHOTOS, MCMASTER_TALK_PHOTO, DAVIES_PORTRAIT_SRC } from "./pages/cover-page"
import { ABOUT_PHOTOS } from "./pages/about-page"
import type { MediaId } from "@/lib/portfolio-actions"

// Resolves the media IDs in DaveAI's tool catalog (lib/portfolio-actions.ts) to the real viewer
// payloads already used by the pages, so the bot opens exactly what visitors can click on.
// The Record type is exhaustive: adding an ID to the catalog without a resolver fails to compile.

type Photo = { src: string; title: string; description: string }

const experienceMedia = (id: string): MediaModalItem | null =>
  EXPERIENCES.find((e) => e.id === id)?.media ?? null

const gitcloudAlbum = (albumId: string): MediaModalItem | null => {
  const media = experienceMedia("gitcloud")
  return media ? { ...media, initialAlbumId: albumId } : null
}

const photo = (p: Photo | undefined): MediaModalItem | null =>
  p ? { type: "image", src: p.src, title: p.title, description: p.description } : null

const coverPhoto = (id: string) => photo([...COVER_PHOTOS, MCMASTER_TALK_PHOTO].find((p) => p.id === id))

const RESOLVERS: Record<MediaId, () => MediaModalItem | null> = {
  "elise-demo": () => experienceMedia("elise"),
  "soda-demo": () => experienceMedia("soda"),
  "mockq-demo": () => experienceMedia("mockq"),
  "trimble-photo": () => experienceMedia("trimble"),
  "gitcloud-albums": () => experienceMedia("gitcloud"),
  "gitcloud-google-hackathon": () => gitcloudAlbum("google-hackathon"),
  "gitcloud-startup-summit": () => gitcloudAlbum("startup-summit"),
  "gitcloud-shopify-panel": () => gitcloudAlbum("shopify-panel"),
  "gitcloud-intuit-tour": () => gitcloudAlbum("intuit-tour"),
  "gitcloud-gdg-hackathon": () => gitcloudAlbum("gdg-hackathon"),
  "gitcloud-deltahacks": () => gitcloudAlbum("deltahacks"),
  "gitcloud-team": () => gitcloudAlbum("gitcloud-team"),
  "photo-google-keynote": () => coverPhoto("two-projectors"),
  "photo-judge-google": () => coverPhoto("speaking-group"),
  "photo-trimble-internship": () => coverPhoto("trimble-internship"),
  "photo-startup-summit": () => coverPhoto("startup-summit"),
  "photo-mcmaster-keynote": () => coverPhoto("mcmaster-podium"),
  "photo-davies-portrait": () => ({
    type: "image",
    src: DAVIES_PORTRAIT_SRC,
    title: "Davies Umoh",
    description: "Product Manager based in Toronto, CA",
  }),
  "photo-deltahacks-workshop": () => photo(ABOUT_PHOTOS[0]),
  "photo-gdg-judge": () => photo(ABOUT_PHOTOS[1]),
  "photo-founder-panel": () => photo(ABOUT_PHOTOS[2]),
}

export function resolvePortfolioMedia(id: MediaId): MediaModalItem | null {
  return RESOLVERS[id]?.() ?? null
}

