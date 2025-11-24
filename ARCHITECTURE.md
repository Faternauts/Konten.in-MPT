# 🏗️ Remixify - Architecture Documentation

## Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Diagram](#architecture-diagram)
4. [Data Flow](#data-flow)
5. [Component Structure](#component-structure)
6. [API Routes](#api-routes)
7. [Database Schema](#database-schema)
8. [Storage Architecture](#storage-architecture)
9. [AI Integration](#ai-integration)

---

## System Overview

Remixify is a Next.js-based social platform that enables brands to upload advertisements and allows users to create AI-powered remixes through natural language prompts. The platform combines multiple AI services to provide image editing, video generation, prompt analysis, and deep analytics capabilities.

### Key Features

- **Ad Upload & Management**: Upload images/videos, view feed, manage ads
- **AI Image Editing**: Gemini 2.5 Flash Image for prompt-based editing
- **AI Video Generation**: Vertex AI Veo 3.1 for text-to-video from frames
- **Prompt Analysis**: Claude Sonnet for extracting themes and intent
- **Analytics Dashboard**: Letta agent with deep memory for brand insights
- **Threaded Remixes**: Parent-child relationships for remix chains
- **Real-time Feed**: Mix of mock and real ads with search/filter

---

## Technology Stack

### Frontend

- **Framework**: Next.js 16 (App Router)
- **React**: 19.2.0
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI primitives
- **State Management**: React hooks (no external state library)

### Backend

- **Runtime**: Node.js 18.18+
- **API Layer**: Next.js Route Handlers (serverless functions)
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (S3-compatible)

### AI Services

| Service          | Purpose            | Model                    |
| ---------------- | ------------------ | ------------------------ |
| Google Gemini    | Image editing      | gemini-2.5-flash-image   |
| Vertex AI Veo    | Video generation   | veo-3.1-generate-preview |
| Anthropic Claude | Prompt analysis    | claude-sonnet-4-5        |
| Letta            | Analytics & memory | Custom agent             |

### Package Manager

- **pnpm**: Fast, disk-efficient package manager

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Feed Page  │  │  Ad Details  │  │   Analytics  │     │
│  │   (/)        │  │   (/ad/[id]) │  │   (/brands)  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                  │
└────────────────────────────┼──────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js API Routes                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ /api/upload  │  │/api/edit-    │  │/api/analyze- │     │
│  │              │  │ image/video  │  │   prompts    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────────────────────────────────────────┐      │
│  │          /api/letta-analytics                     │      │
│  └──────────────────────────────────────────────────┘      │
└───────┬────────────────┬────────────────┬──────────────────┘
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────────────────────────┐
│   Supabase   │  │         AI Services              │
│  ┌─────────┐ │  │  ┌────────┐  ┌─────────┐       │
│  │Database │ │  │  │ Gemini │  │ Vertex  │       │
│  │(Tables) │ │  │  │        │  │AI (Veo) │       │
│  └─────────┘ │  │  └────────┘  └─────────┘       │
│  ┌─────────┐ │  │  ┌────────┐  ┌─────────┐       │
│  │Storage  │ │  │  │ Claude │  │  Letta  │       │
│  │(Bucket) │ │  │  │        │  │         │       │
│  └─────────┘ │  │  └────────┘  └─────────┘       │
└──────────────┘  └──────────────────────────────────┘
```

---

## Data Flow

### 1. Ad Upload Flow

```
User uploads image/video
    ↓
Frontend validates file (size, type)
    ↓
POST /api/upload
    ↓
Upload to Supabase Storage (bucket: ads)
    ↓
Insert record in ads table
    ↓
Return ad object with URLs
    ↓
Update feed UI
```

### 2. Image Remix Flow

```
User enters prompt for image ad
    ↓
POST /api/edit-image
    ↓
Fetch original image (Supabase/public)
    ↓
Convert to base64
    ↓
Call Gemini API with image + prompt
    ↓
Receive edited image (base64)
    ↓
Upload to Supabase Storage (edited/)
    ↓
Insert prompt record with edited_image_url
    ↓
Display edited image in modal
```

### 3. Video Remix Flow

```
User enters prompt for video ad
    ↓
Extract first & last frames from video
    ↓
POST /api/edit-video
    ↓
Convert frames to base64
    ↓
Call Vertex AI Veo API (image-to-video)
    ↓
Poll operation status (10s intervals, max 10min)
    ↓
Receive generated video (base64)
    ↓
Upload to Supabase Storage (edited-videos/)
    ↓
Insert prompt record with edited_video_url
    ↓
Display generated video in modal
```

### 4. Analytics Flow

```
User visits /brands
    ↓
GET /api/letta-analytics
    ↓
Letta agent analyzes Nike campaign data
    ↓
Return JSON: sentiment, demographics, competitors
    ↓
Visualize with Recharts components
```

### 5. Prompt Analysis Flow

```
User clicks "Extract Signals"
    ↓
Fetch all prompts for ad from Supabase
    ↓
POST /api/analyze-prompts
    ↓
Claude analyzes prompt patterns
    ↓
Return: themes, emotional tone, style refs, intent
    ↓
Display in Signal Extraction modal
```

---

## Component Structure

### Pages (App Router)

```
app/
├── page.tsx                    # Home feed (main page)
├── layout.tsx                  # Root layout with providers
├── globals.css                 # Global styles
├── ad/[id]/page.tsx           # Ad detail page
├── brands/
│   ├── page.tsx               # Analytics dashboard
│   ├── analytics-dashboard.tsx # Charts & visualizations
│   └── signal-extraction.tsx   # Prompt analysis modal
├── profile/page.tsx           # User profile (placeholder)
├── leaderboard/page.tsx       # Leaderboard (placeholder)
└── challenges/page.tsx        # Challenges (placeholder)
```

### Components

```
components/
├── navigation.tsx             # Top navigation bar
├── upload-ad-modal.tsx        # Ad upload modal
├── remix-modal.tsx            # Remix interface
├── ad-card.tsx                # Ad card in feed
├── comment-input.tsx          # Comment input component
├── theme-provider.tsx         # Dark/light theme provider
└── ui/                        # Radix UI primitives
    ├── button.tsx
    ├── card.tsx
    ├── dialog.tsx
    ├── input.tsx
    ├── tabs.tsx
    └── ...
```

### Library Utilities

```
lib/
├── supabase.ts               # Supabase client initialization
├── types.ts                  # TypeScript type definitions
├── utils.ts                  # Utility functions (cn, etc.)
├── videoUtils.ts             # Video frame extraction
└── conversion-tracking.ts     # Conversion tracking (optional)
```

---

## API Routes

### POST /api/upload

**Purpose**: Upload ad image/video to Supabase Storage

**Request**:

```typescript
{
  file: File,           // Image or video file
  title: string,        // Ad title
  location: string,     // Location/campaign info
  companyId?: string    // Optional company ID
}
```

**Response**:

```typescript
{
  ad: {
    id: string,
    title: string,
    image_url?: string,
    video_url?: string,
    location: string,
    likes: number,
    created_at: string
  }
}
```

**Implementation**: `frontend/app/api/upload/route.ts`

---

### POST /api/edit-image

**Purpose**: Edit image using Gemini 2.5 Flash Image

**Request**:

```typescript
{
  imageUrl: string,     // Public URL or data URL
  prompt: string        // Edit instructions
}
```

**Response**:

```typescript
{
  editedImage: string,  // Base64 encoded image
  mimeType: string,     // 'image/png' or 'image/jpeg'
  message: string,
  analysis?: string     // Optional description
}
```

**AI Model**: `gemini-2.5-flash-image`  
**Fallback**: `gemini-pro-vision` (analysis only)

**Implementation**: `frontend/app/api/edit-image/route.ts`

---

### POST /api/edit-video

**Purpose**: Generate video from frames using Vertex AI Veo 3.1

**Request**:

```typescript
{
  frames: string[],     // Array of base64 frame images
  prompt: string,       // Video generation prompt
  companyName?: string  // Brand context
}
```

**Response**:

```typescript
{
  success: boolean,
  editedVideo: string,  // Base64 encoded video
  mimeType: string      // 'video/mp4'
}
```

**AI Model**: `veo-3.1-generate-preview`  
**Parameters**:

- Duration: 4 seconds (fixed)
- Resolution: 720p
- Audio: Disabled
- Uses first & last frames for image-to-video

**Implementation**: `frontend/app/api/edit-video/route.ts`

---

### POST /api/analyze-prompts

**Purpose**: Analyze user prompts with Claude

**Request**:

```typescript
{
  prompts: string[]     // Array of prompt texts
}
```

**Response**:

```typescript
{
  themes: string[],             // Main themes
  emotionalTone: string,        // Overall tone
  styleReferences: string[],    // Style refs
  intent: string                // User intent summary
}
```

**AI Model**: `claude-sonnet-4-5-20250929`

**Implementation**: `frontend/app/api/analyze-prompts/route.ts`

---

### GET /api/letta-analytics

**Purpose**: Get brand analytics from Letta agent

**Request**: None (GET request)

**Response**:

```typescript
{
  sentiment: {
    positive: number,    // 0-100
    neutral: number,
    negative: number
  },
  demographics: {
    ageGroups: Array<{range: string, percentage: number}>,
    gender: Array<{gender: string, percentage: number}>,
    locations: Array<{location: string, percentage: number}>
  },
  competitors: Array<{
    brand: string,
    score: number,
    engagement: 'High' | 'Medium' | 'Low',
    color: string
  }>
}
```

**AI Agent**: Letta with deep memory  
**Current Config**: Analyzes Nike campaigns

**Implementation**: `frontend/app/api/letta-analytics/route.ts`

---

## Database Schema

### companies

```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose**: Store brand/company information

---

### ads

```sql
CREATE TABLE ads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id),
  title TEXT NOT NULL,
  image_url TEXT,          -- Supabase Storage URL
  video_url TEXT,          -- Supabase Storage URL
  location TEXT,           -- Campaign/location info
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ads_company_id ON ads(company_id);
```

**Purpose**: Store advertisements (images or videos)

**Notes**:

- Either `image_url` OR `video_url` is present (not both)
- `location` is a free-text field for UI display
- `likes` is initialized with random value or 0

---

### prompts

```sql
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ad_id UUID REFERENCES ads(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,          -- Browser ID or UUID
  content TEXT NOT NULL,          -- Prompt text
  parent_id UUID REFERENCES prompts(id) ON DELETE SET NULL,
  edited_image_url TEXT,          -- Generated image URL
  edited_video_url TEXT,          -- Generated video URL
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_prompts_ad_id ON prompts(ad_id);
CREATE INDEX idx_prompts_parent_id ON prompts(parent_id);
```

**Purpose**: Store user prompts and generated remixes

**Notes**:

- `user_id` is auto-generated stable browser ID if not UUID
- `parent_id` enables threaded replies (remix chains)
- `edited_video_url` may fallback to `edited_image_url` in some cases

---

## Storage Architecture

### Bucket: `ads` (Public)

**Directory Structure**:

```
ads/
├── images/              # Original uploaded images
│   └── {uuid}.{ext}
├── videos/              # Original uploaded videos
│   └── {uuid}.mp4
├── edited/              # AI-edited images
│   └── {uuid}.{ext}
└── edited-videos/       # AI-generated videos
    └── {uuid}.mp4
```

**Access Control**:

- Public read access (SELECT)
- Authenticated insert (INSERT)
- Authenticated delete (DELETE)

**CORS**: Configured for Next.js localhost and production domain

**File Naming**: UUID-based to avoid conflicts

---

## AI Integration

### 1. Google Gemini (Image Editing)

**Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent`

**Authentication**: API Key in query parameter

**Request Format**:

```typescript
{
  contents: [{
    role: "user",
    parts: [
      { text: prompt },
      { inlineData: { mimeType, data: base64 } }
    ]
  }],
  generationConfig: {
    temperature: 0.7,
    candidateCount: 1,
    maxOutputTokens: 2048
  }
}
```

**Response Handling**:

- Look for `candidates[0].content.parts[].inlineData`
- Fallback to `gemini-pro-vision` for analysis only

---

### 2. Vertex AI Veo 3.1 (Video Generation)

**Endpoint**: `https://us-central1-aiplatform.googleapis.com/v1/projects/{projectId}/locations/us-central1/publishers/google/models/veo-3.1-generate-preview:predictLongRunning`

**Authentication**: Bearer token (OAuth or Service Account)

**Request Format**:

```typescript
{
  instances: [{
    prompt: string,
    image: { bytesBase64Encoded, mimeType },
    lastFrame: { bytesBase64Encoded, mimeType }
  }],
  parameters: {
    sampleCount: 1,
    durationSeconds: 4,     // 4, 6, or 8
    generateAudio: false,
    resolution: "720p"      // 720p or 1080p
  }
}
```

**Long-Running Operation**:

1. Initial request returns `operationName`
2. Poll status endpoint every 10 seconds
3. Max wait time: 10 minutes (60 polls)
4. Extract video from `response.candidates[0].content.parts[0].inlineData.data`

---

### 3. Anthropic Claude (Prompt Analysis)

**Endpoint**: `https://api.anthropic.com/v1/messages`

**Authentication**: `x-api-key` header

**Request Format**:

```typescript
{
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 1024,
  system: systemPrompt,
  messages: [{ role: 'user', content: userPrompt }]
}
```

**System Prompt**: Instructs to return JSON with themes, tone, style refs, intent

**Response Parsing**:

- Extract text from `content[0].text`
- Parse JSON (handle markdown code blocks)

---

### 4. Letta Agent (Analytics)

**SDK**: `@letta-ai/letta-client`

**Authentication**: Token-based

**Usage**:

```typescript
const client = new LettaClient({ token, baseUrl });
const response = await client.agents.messages.create(agentId, {
  messages: [{ role: "user", content: prompt }],
});
```

**Response Format**:

- Iterate `response.messages`
- Look for `messageType: "assistant_message"`
- Extract and parse JSON from `content`

**Configuration**:

- Default Agent ID: `agent-3af75001-7e1e-4029-a63a-2cabb24d34fd`
- Current focus: Nike campaign analytics
- Customizable via `LETTA_AGENT_ID` env var

---

## Performance Considerations

### Optimization Strategies

1. **Image Processing**:

   - Resize large images before upload
   - Use WebP format where supported
   - Lazy load images in feed

2. **Video Processing**:

   - Extract frames client-side to reduce payload
   - Show loading state during generation
   - Cache generated videos in Supabase Storage

3. **API Calls**:

   - Implement request debouncing
   - Show optimistic UI updates
   - Handle long-polling gracefully

4. **Database Queries**:

   - Use indexes on foreign keys
   - Paginate feed results
   - Cache frequently accessed data

5. **AI Services**:
   - Implement timeout handling
   - Provide fallback responses
   - Monitor API quotas

---

## Security Considerations

### Environment Variables

- Never expose API keys client-side
- Use `NEXT_PUBLIC_` prefix only for public values
- Rotate keys regularly

### Storage Policies

- Validate file types and sizes
- Implement rate limiting on uploads
- Scan uploads for malicious content (optional)

### API Routes

- Validate all inputs
- Implement authentication where needed
- Use CORS policies appropriately

### Supabase RLS

- Enable Row Level Security on sensitive tables
- Create policies for multi-tenant scenarios
- Audit access logs regularly

---

## Deployment Considerations

### Vercel (Recommended)

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
cd frontend
vercel
```

**Environment Variables**: Set in Vercel dashboard

**Serverless Function Timeout**: Increase for video generation (max 60s on Pro plan)

### Self-Hosted

- Use PM2 or Docker for process management
- Set up reverse proxy (Nginx)
- Configure SSL certificates
- Monitor server resources

---

## Monitoring & Logging

### Application Logs

- Console logs in development
- Structured logging in production
- Error tracking (Sentry, LogRocket)

### AI Service Monitoring

- Track API usage and costs
- Monitor response times
- Set up alerts for failures

### Database Monitoring

- Supabase dashboard for query performance
- Monitor connection pool
- Track storage usage

---

## Future Enhancements

### Planned Features

- [ ] User authentication (Supabase Auth)
- [ ] Real-time collaboration
- [ ] Advanced video editing options
- [ ] Social sharing integrations
- [ ] Performance analytics per ad
- [ ] A/B testing framework
- [ ] Mobile app (React Native)

### Scalability Improvements

- [ ] Implement caching layer (Redis)
- [ ] Use CDN for static assets
- [ ] Optimize database queries
- [ ] Implement worker queues for long tasks
- [ ] Add horizontal scaling for API routes

---

**This architecture document is maintained alongside the codebase. Update it when making significant architectural changes.**
