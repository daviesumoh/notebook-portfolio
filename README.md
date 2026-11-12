# Portfolio

Personal engineering portfolio and interactive diary built with Next.js, React, Tailwind CSS, and TypeScript. It has a notebook-style layout with keyboard and corner page-flip navigation, and a chat assistant (DaveAI) backed by the OpenAI API.

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

## Configuration

Environment variables are read from `.env.local` (git-ignored). Only `.env.example` is committed.

| Variable | Required | Description |
| --- | --- | --- |
| `OPENAI_API_KEY` | For live chat | Without it the assistant falls back to the static profile in `lib/davies-profile.ts`. |
| `DAVEAI_PERSONA_JSON` | No | JSON string overriding personal fields (favorite food, motto, etc.) so they stay out of the repo. |

`/api/chat` allows 12 requests per minute per IP, caps messages at 500 characters and keeps the last 6 history turns. The limiter is in-memory (per server instance), so also set a spend limit on your OpenAI project and consider a firewall rule if you expose it publicly.

To make this your own, replace the content in `lib/portfolio-config.ts` and `lib/davies-profile.ts`, and the images in `public/`.

## Build

```bash
npm run build
npm run start
```


## License

MIT. See [LICENSE](LICENSE).
