
## Konten.in - Ad Remix Platform - CalHacks 2025

Welcome to Konten.in, an exciting social platform for brands to upload ads and let users create remixes through prompt-based AI editing. Includes image editing via Gemini, video generation via Veo 3, user comment/prompt analysis via Claude, deep research, memory, and analytics about the company via Letta, and storage/database via Supabase.

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind
- **APIs**: Next.js Route Handlers under `frontend/app/api/*`
- **AI services**:
  - Image editing: Google Gemini 2.5 Flash Image
  - Video generation: Vertex AI Veo 3.1 (preview)
  - Prompt analysis: Anthropic Claude
  - Analytics: Letta Agent API
- **Data**: Supabase (Postgres + Storage)
- **Machine Learning**: 

## Setup

### Prerequisites

- Node.js 18.18+ and pnpm
- A Supabase project with:
  - Database tables described below
  - A public storage bucket named `ads`
- API keys/accounts for the services you want to enable (Gemini, Claude, Google Cloud/Vertex AI, Letta)

### Environment Variables

Create a `.env.local` (or `.env`) file in the `frontend` directory with at least:

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Image editing (Gemini)
GEMINI_API_KEY=your-gemini-api-key

# Prompt analysis (Claude)
CLAUDE_API_KEY=your-claude-api-key

# Video generation (Vertex AI Veo) – choose ONE auth method
# 1) Short-lived OAuth token (local dev)
GCP_PROJECT_ID=your-gcp-project-id
GCP_ACCESS_TOKEN=ya29....   # 'gcloud auth print-access-token' (expires ~1h)

# OR 2) Service Account JSON (recommended). If you choose this, set the file path and update your code to use ADC:
# GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json

# Letta for analytics from the web
LETTA_API_KEY=your-letta-api-key
# Optional overrides:
# LETTA_BASE_URL=https://api.letta.ai
# LETTA_AGENT_ID=agent-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### Database Setup (Supabase)

Run the SQL in your Supabase SQL editor from your existing README to create the base tables. The app expects these tables/columns at runtime:

- companies
  - id (uuid, pk)
  - name (text)
  - created_at (timestamptz, default now)

- ads
  - id (uuid, pk)
  - company_id (uuid, fk → companies.id)
  - title (text)
  - image_url (text, optional if video)
  - video_url (text, optional)
  - location (text, used by UI)
  - likes (int, used by UI; code initializes a random value if not provided)
  - created_at (timestamptz, default now)

- prompts
  - id (uuid, pk)
  - ad_id (uuid, fk → ads.id)
  - user_id (uuid or string; code auto-generates a stable browser id if not uuid)
  - content (text)
  - parent_id (uuid, nullable; threaded replies)
  - edited_image_url (text, optional)
  - edited_video_url (text, optional; if not present, the app falls back to saving video URLs in `edited_image_url`)
  - created_at (timestamptz, default now)

Seed data:
- Use `supabase-test-data.sql` at repo root to insert Nike sample data.

Storage:
- Create a public bucket named `ads`. The app writes under:
  - `images/` and `videos/` (uploads)
  - `edited/` and `edited-videos/` (generated assets)

### Installation & Running

```bash
cd frontend
pnpm install
pnpm dev
# open http://localhost:3000
```

## Features

- **Ad Upload**: Image/video uploads saved to Supabase Storage and `ads` table.
- **AI-Powered Remixing**:
  - Image edits with Gemini using your prompt + original image.
  - Video generation with Vertex AI Veo from first/last frames and prompt.
- **Prompt Analysis**: Aggregates user prompts and analyzes with Claude.
- **Analytics Dashboard**: Letta agent returns brand analytics JSON for visualization. Letta deep memory and research analytics sourced from the web.
- **Threads/Replies**: Users can reply to prompts (`parent_id`) to build remix chains.
- **Feed**: Mix of mock ads and Supabase ads; supports likes, comments count, search, and deletion of user uploads.





