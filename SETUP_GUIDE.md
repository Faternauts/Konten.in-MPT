# 🚀 Remixify - Complete Setup Guide

This guide will walk you through setting up the entire Remixify platform from scratch.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Supabase Configuration](#supabase-configuration)
4. [API Keys Setup](#api-keys-setup)
5. [Installation](#installation)
6. [Running the Application](#running-the-application)
7. [Testing the Features](#testing-the-features)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed and set up:

### Required Software

- **Node.js** 18.18 or higher ([Download](https://nodejs.org/))
- **pnpm** package manager ([Install](https://pnpm.io/installation))
  ```bash
  npm install -g pnpm
  ```

### Required Accounts

- **Supabase** account ([Sign up](https://supabase.com/))
- **Google AI Studio** account for Gemini ([Sign up](https://makersuite.google.com/))
- **Anthropic** account for Claude ([Sign up](https://console.anthropic.com/))
- **Google Cloud Platform** account for Vertex AI Veo ([Sign up](https://cloud.google.com/))
- **Letta** account for analytics ([Sign up](https://app.letta.ai/))

---

## Initial Setup

### 1. Clone or Download the Repository

```bash
cd d:\Konten.in\Konten.in\calhacks25
```

### 2. Verify Project Structure

Ensure you have the following key directories:

```
calhacks25/
├── frontend/
│   ├── app/
│   │   ├── api/
│   │   ├── brands/
│   │   └── ...
│   ├── components/
│   └── lib/
├── scripts/
├── README.md
└── SUPABASE_SETUP.md
```

---

## Supabase Configuration

### Step 1: Create a Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in project details:
   - **Name**: remixify (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
4. Wait for project to be created (~2 minutes)

### Step 2: Create Database Tables

1. In your Supabase project, go to **SQL Editor**
2. Run the following SQL to create the schema:

```sql
-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ads table
CREATE TABLE IF NOT EXISTS ads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  location TEXT,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create prompts table
CREATE TABLE IF NOT EXISTS prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ad_id UUID REFERENCES ads(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES prompts(id) ON DELETE SET NULL,
  edited_image_url TEXT,
  edited_video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ads_company_id ON ads(company_id);
CREATE INDEX IF NOT EXISTS idx_prompts_ad_id ON prompts(ad_id);
CREATE INDEX IF NOT EXISTS idx_prompts_parent_id ON prompts(parent_id);
```

### Step 3: Create Storage Bucket

1. Go to **Storage** in the left sidebar
2. Click **"New bucket"**
3. Settings:
   - **Name**: `ads`
   - **Public bucket**: ✅ **Enable**
4. Click **"Create bucket"**

### Step 4: Set Up Storage Policies

1. Go to **Storage** → **Policies** → **ads bucket**
2. Click **"New Policy"**
3. Create three policies:

**Policy 1: Public Access (SELECT)**

```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'ads' );
```

**Policy 2: Allow Uploads (INSERT)**

```sql
CREATE POLICY "Allow uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'ads' );
```

**Policy 3: Allow Deletes (DELETE)**

```sql
CREATE POLICY "Allow deletes"
ON storage.objects FOR DELETE
USING ( bucket_id = 'ads' );
```

### Step 5: Seed Test Data

1. Copy the contents of `supabase-test-data.sql` from the project root
2. Paste and run it in the **SQL Editor**
3. This will create Nike sample ads with prompts

### Step 6: Get Your Supabase Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
   - **anon/public** key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)

---

## API Keys Setup

### 1. Google Gemini (Image Editing)

1. Go to [Google AI Studio](https://makersuite.google.com/)
2. Click **"Get API Key"**
3. Create a new API key
4. Copy the key (starts with `AI...`)

### 2. Anthropic Claude (Prompt Analysis)

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Navigate to **API Keys**
3. Click **"Create Key"**
4. Copy the key (starts with `sk-ant-...`)

### 3. Google Cloud / Vertex AI (Video Generation)

#### Option A: OAuth Token (Quick Start - Local Dev Only)

1. Install [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
2. Authenticate:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```
3. Enable required APIs:
   ```bash
   gcloud services enable aiplatform.googleapis.com
   ```
4. Get access token (expires in 1 hour):
   ```bash
   gcloud auth print-access-token
   ```
5. Copy your **Project ID** and **Access Token**

#### Option B: Service Account (Recommended for Production)

1. Go to [GCP Console](https://console.cloud.google.com/)
2. Navigate to **IAM & Admin** → **Service Accounts**
3. Click **"Create Service Account"**
4. Grant roles:
   - Vertex AI User
   - Storage Object Viewer
5. Click **"Create Key"** → **JSON**
6. Save the JSON file as `service-account-key.json` in your project root
7. Update your code to use Application Default Credentials (ADC)

### 4. Letta (Analytics)

1. Go to [Letta Dashboard](https://app.letta.ai/)
2. Sign in or create an account
3. Navigate to **API Keys**
4. Click **"Create New Key"**
5. Copy the API key
6. **(Optional)** Create a custom agent:
   - Go to **Agents**
   - Click **"Create Agent"**
   - Configure with marketing/analytics expertise
   - Copy the Agent ID

---

## Installation

### 1. Create Environment File

```bash
cd frontend
cp .env.example .env.local
```

### 2. Fill in Environment Variables

Edit `frontend/.env.local` with your actual values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Google Gemini
GEMINI_API_KEY=your-gemini-api-key

# Anthropic Claude
CLAUDE_API_KEY=your-claude-api-key

# Google Cloud / Vertex AI
GCP_PROJECT_ID=your-gcp-project-id
GCP_ACCESS_TOKEN=ya29.your-access-token

# Letta
LETTA_API_KEY=your-letta-api-key
```

### 3. Install Dependencies

```bash
# Install frontend dependencies
cd frontend
pnpm install

# Install root dependencies (for scripts)
cd ..
pnpm install
```

---

## Running the Application

### Start the Development Server

```bash
cd frontend
pnpm dev
```

The application will be available at: **http://localhost:3000**

### Test Scripts (Optional)

Test Letta analytics integration:

```bash
node scripts/get-analytics.mjs
```

Test Letta agent directly:

```bash
node scripts/run-letta-agent.mjs
```

---

## Testing the Features

### 1. View the Feed

- Navigate to http://localhost:3000
- You should see Nike ads from the seeded data

### 2. Upload an Ad

- Click **"Upload Ad"** button
- Fill in title and location
- Upload an image or video
- Submit and verify it appears in the feed

### 3. Remix an Image

- Click on any ad
- Click **"Remix"** button
- Enter a prompt (e.g., "Make the shoes glow with neon colors")
- Wait for Gemini to generate the edited image
- View the result

### 4. Remix a Video

- Find a video ad
- Click **"Remix"**
- Enter a prompt (e.g., "Add cyberpunk aesthetic with neon lights")
- Wait for Veo to generate the video (this takes ~2-5 minutes)
- View the generated video

### 5. View Analytics Dashboard

- Navigate to http://localhost:3000/brands
- View sentiment analysis, demographics, and competitor benchmarking
- All data is generated by Letta agent

### 6. Analyze Prompts

- Go to an ad with multiple remixes
- Click **"Analyze Signals"**
- View the Claude-powered analysis of themes and intent

---

## Troubleshooting

### Images Not Loading from Supabase

**Problem**: Uploaded images return 404 or access denied

**Solution**:

1. Verify bucket is public: **Storage** → **ads** → Settings
2. Check storage policies are created correctly
3. Test URL directly in browser

### Gemini Image Editing Fails

**Problem**: Image editing returns errors

**Solutions**:

- Verify `GEMINI_API_KEY` is correct
- Check API quota in Google AI Studio
- Try with a simpler prompt first
- Check console logs for specific error messages

### Vertex AI Video Generation Fails

**Problem**: Video generation returns 401 or 403 errors

**Solutions**:

- Refresh your access token: `gcloud auth print-access-token`
- Verify Vertex AI API is enabled in GCP
- Check your GCP project has billing enabled
- Ensure you have Vertex AI permissions

### Letta Analytics Not Loading

**Problem**: Analytics dashboard shows errors

**Solutions**:

- Verify `LETTA_API_KEY` is correct
- Check API key permissions in Letta dashboard
- Test with: `node scripts/get-analytics.mjs`
- Verify agent ID is correct (or omit to use default)

### Claude Prompt Analysis Fails

**Problem**: Signal extraction returns errors

**Solutions**:

- Verify `CLAUDE_API_KEY` is correct
- Check API quota in Anthropic console
- Ensure model name is correct: `claude-sonnet-4-5-20250929`

### Build Errors

**Problem**: TypeScript or build errors

**Solutions**:

```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
pnpm dev
```

### Port Already in Use

**Problem**: Port 3000 is already in use

**Solution**:

```bash
# Kill process on port 3000
# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Or use a different port:
pnpm dev -- -p 3001
```

---

## Additional Resources

- **Supabase Setup**: See `SUPABASE_SETUP.md`
- **Letta Configuration**: See `LETTA_CURRENT_CONFIG.md`
- **Conversion Tracking**: See `frontend/docs/conversion-integration-guide.md`
- **Main README**: See `README.md`

---

## Need Help?

If you encounter issues not covered in this guide:

1. Check the browser console for error messages
2. Check the terminal/server logs for backend errors
3. Verify all environment variables are set correctly
4. Ensure all APIs are enabled and have sufficient quota
5. Review the specific API documentation for detailed error codes

---

## Security Notes

⚠️ **Important Security Practices**:

1. **Never commit `.env.local` or `.env` files** to version control
2. **Rotate API keys regularly**, especially if exposed
3. **Use service accounts** instead of OAuth tokens for production
4. **Enable rate limiting** in production environments
5. **Set up proper CORS** policies for your domain
6. **Use environment-specific** keys (dev vs production)

---

**🎉 Congratulations!** Your Remixify platform should now be fully operational.

Enjoy creating and remixing ads with AI! 🚀
