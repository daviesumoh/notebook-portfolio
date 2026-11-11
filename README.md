# Portfolio

Personal engineering portfolio and interactive diary built with Next.js, React, Tailwind CSS, and TypeScript. Features a ruled notebook shell layout, keyboard and dogear page-flip navigation, handwriting typography, and an embedded portfolio assistant (DaveAI) backed by OpenAI.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Lucide Icons
- **Animation & 3D:** Framer Motion, Three.js
- **Assistant:** OpenAI API (`gpt-4o-mini`)

## Project Structure

```text
app/
  ├── api/chat/route.ts       # Streaming OpenAI chat handler
  ├── globals.css             # Notebook lines, typography, and paper themes
  ├── layout.tsx              # Root layout and metadata
  └── page.tsx                # Main journal container entrypoint
components/
  ├── journal/                # Notebook pages (Cover, About, Experience, Projects)
  │   ├── notebook-shell.tsx  # Shell container, tabs, keyboard controls
  │   ├── page-flip-dogear.tsx # Interactive corner flip trigger
  │   └── davies-bot.tsx      # Embedded assistant drawer
  └── ui/                     # Base UI components
lib/
  └── davies-profile.ts       # Structured portfolio context for DaveAI
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Add your `OPENAI_API_KEY` in `.env.local` to enable DaveAI live responses.

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
npm run build
npm run start
```

