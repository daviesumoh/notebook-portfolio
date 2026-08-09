export type TabId = 'cover' | 'about' | 'experience' | 'projects' | 'skills' | 'daviesbot'

/** Shared notebook body ink typography matching the Experience narrative size across viewports. */
export const JOURNAL_BODY_TEXT_CLASS =
  "font-script text-[17.5px] sm:text-[18px] lg:text-[15.5px] min-[1360px]:text-[16.5px] min-[1400px]:text-[18px] min-[1500px]:text-xl font-light !leading-[32px] translate-y-[6px]"

/** Shared notebook entry/section heading typography matching Experience role headers. */
export const JOURNAL_SUBHEADING_TEXT_CLASS =
  "font-script text-lg sm:text-[19px] !leading-[32px]"

export interface TabItem {
  id: TabId
  label: string
  pageNum?: string
  color: string // Tailwind background color or hex
  textColor: string
  borderColor: string
}

export const TABS: TabItem[] = [
  {
    id: 'cover',
    label: 'Cover',
    color: '#FDE68A', // Amber/Yellow
    textColor: '#78350F',
    borderColor: '#F59E0B',
  },
  {
    id: 'about',
    label: 'About',
    pageNum: 'p.01',
    color: '#BAE6FD', // Sky blue
    textColor: '#0369A1',
    borderColor: '#38BDF8',
  },
  {
    id: 'experience',
    label: 'Experience',
    pageNum: 'p.02',
    color: '#BBF7D0', // Green
    textColor: '#15803D',
    borderColor: '#4ADE80',
  },
  {
    id: 'projects',
    label: 'Projects',
    pageNum: 'p.03',
    color: '#FED7AA', // Orange
    textColor: '#C2410C',
    borderColor: '#FB923C',
  },
  {
    id: 'daviesbot',
    label: 'Ask DaveAI',
    color: '#FECDD3', // Rose
    textColor: '#BE123C',
    borderColor: '#FB7185',
  },
]

