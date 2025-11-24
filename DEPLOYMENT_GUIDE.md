# 🚀 Deployment Guide - Remixify

This guide covers deploying the Remixify platform to production environments.

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
3. [Self-Hosted Deployment](#self-hosted-deployment)
4. [Docker Deployment](#docker-deployment)
5. [Environment Variables](#environment-variables)
6. [Database Migration](#database-migration)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Pre-Deployment Checklist

### ✅ Code Preparation

- [ ] All features tested locally
- [ ] No console.log statements in production code
- [ ] Error handling implemented for all API routes
- [ ] Environment variables documented
- [ ] `.env.local` not committed to git
- [ ] `.gitignore` includes sensitive files

### ✅ Supabase Preparation

- [ ] Production Supabase project created
- [ ] Database schema deployed
- [ ] Storage bucket `ads` created and public
- [ ] Storage policies configured
- [ ] Test data seeded (optional)
- [ ] API keys copied from Supabase dashboard

### ✅ API Keys Preparation

- [ ] Gemini API key obtained
- [ ] Claude API key obtained
- [ ] GCP service account created (for Veo)
- [ ] Letta API key obtained
- [ ] All keys tested in development

### ✅ Performance Optimization

- [ ] Images optimized (WebP, appropriate sizes)
- [ ] Unused dependencies removed
- [ ] Build warnings resolved
- [ ] TypeScript errors fixed

---

## Vercel Deployment (Recommended)

Vercel is the recommended platform for Next.js applications with excellent integration.

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy from Project Root

```bash
cd d:\Konten.in\Konten.in\konten-in-mpt\frontend
vercel
```

**Follow the prompts**:

- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N** (first time)
- Project name? **remixify** (or your choice)
- Directory with code? **./frontend**
- Override settings? **N**

### Step 4: Configure Environment Variables

#### Option A: Via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
GEMINI_API_KEY
CLAUDE_API_KEY
GCP_PROJECT_ID
LETTA_API_KEY
```

5. For **GCP Service Account**:
   - Copy entire JSON content
   - Create variable: `GOOGLE_APPLICATION_CREDENTIALS_JSON`
   - Paste JSON as value
   - Update code to parse JSON from env var

#### Option B: Via Vercel CLI

```bash
# Add production environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add GEMINI_API_KEY production
# ... repeat for all variables
```

### Step 5: Configure Serverless Function Timeout

**Important for Video Generation**: Default timeout is 10s, which is too short for Veo.

1. Go to **Settings** → **Functions**
2. Set **Function Region**: Choose closest to your users
3. Set **Timeout**: 60 seconds (requires Pro plan)

Alternatively, add to `vercel.json`:

```json
{
  "functions": {
    "app/api/edit-video/route.ts": {
      "maxDuration": 60
    }
  }
}
```

### Step 6: Deploy to Production

```bash
# Deploy to production
vercel --prod
```

### Step 7: Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Configure DNS as instructed
4. Wait for SSL certificate provisioning

---

## Self-Hosted Deployment

For more control, you can self-host on your own server.

### Prerequisites

- Ubuntu 20.04+ or similar Linux server
- Node.js 18.18+ installed
- Nginx installed
- Domain name with DNS configured
- SSL certificate (Let's Encrypt)

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Install Nginx
sudo apt install -y nginx

# Install certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

### Step 2: Clone and Build

```bash
# Create application directory
sudo mkdir -p /var/www/remixify
sudo chown $USER:$USER /var/www/remixify
cd /var/www/remixify

# Clone repository
git clone https://github.com/Faternauts/Konten.in-MPT.git .

# Install dependencies
cd frontend
pnpm install

# Create environment file
nano .env.production.local
# Paste all environment variables

# Build application
pnpm build
```

### Step 3: Configure PM2 Process Manager

```bash
# Install PM2
npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'remixify',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/remixify/frontend',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
# Run the command it outputs
```

### Step 4: Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/remixify
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Increase timeout for video generation
        proxy_read_timeout 600s;
        proxy_connect_timeout 600s;
        proxy_send_timeout 600s;
    }

    # Increase client body size for file uploads
    client_max_body_size 100M;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/remixify /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 5: Setup SSL Certificate

```bash
# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Certbot will automatically configure Nginx for HTTPS
```

### Step 6: Configure Firewall

```bash
# Allow HTTP, HTTPS, and SSH
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

---

## Docker Deployment

For containerized deployment using Docker.

### Step 1: Create Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# Copy necessary files from builder
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Step 2: Update next.config.mjs

Add standalone output:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // ... other config
};

export default nextConfig;
```

### Step 3: Create docker-compose.yml

```yaml
version: "3.8"

services:
  remixify:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - CLAUDE_API_KEY=${CLAUDE_API_KEY}
      - GCP_PROJECT_ID=${GCP_PROJECT_ID}
      - GOOGLE_APPLICATION_CREDENTIALS_JSON=${GOOGLE_APPLICATION_CREDENTIALS_JSON}
      - LETTA_API_KEY=${LETTA_API_KEY}
    restart: unless-stopped
    volumes:
      - ./logs:/app/logs
```

### Step 4: Create .env file

```bash
# Create production .env file
cp .env.example .env.production
# Edit with production values
nano .env.production
```

### Step 5: Build and Run

```bash
# Build image
docker-compose build

# Run container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop container
docker-compose down
```

---

## Environment Variables

### Production Environment Variables

Create a `.env.production` file with these values:

```env
# Supabase (Production)
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key

# Google Gemini
GEMINI_API_KEY=your-production-gemini-key

# Anthropic Claude
CLAUDE_API_KEY=your-production-claude-key

# Google Cloud (Use Service Account in Production)
GCP_PROJECT_ID=your-production-project-id
GOOGLE_APPLICATION_CREDENTIALS_JSON='{"type":"service_account",...}'

# Letta
LETTA_API_KEY=your-production-letta-key
LETTA_BASE_URL=https://api.letta.ai
LETTA_AGENT_ID=your-production-agent-id

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Service Account JSON Handling

For GCP service account in environment variable:

**Update** `frontend/app/api/edit-video/route.ts`:

```typescript
// At the top of the file
let credentials;
if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  // Use credentials for authentication
}
```

---

## Database Migration

### Export from Development Supabase

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to development project
supabase link --project-ref your-dev-project-id

# Generate migration
supabase db dump -f migration.sql
```

### Import to Production Supabase

1. Go to production Supabase project
2. Navigate to **SQL Editor**
3. Paste contents of `migration.sql`
4. Run the migration
5. Verify tables created:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

### Seed Production Data (Optional)

```sql
-- Insert sample company
INSERT INTO companies (name) VALUES ('Nike');

-- Verify
SELECT * FROM companies;
```

---

## Post-Deployment Verification

### Checklist

- [ ] Homepage loads successfully
- [ ] Feed displays ads correctly
- [ ] Upload ad functionality works
- [ ] Image remix works (Gemini)
- [ ] Video remix works (Veo)
- [ ] Analytics dashboard loads
- [ ] Prompt analysis works (Claude)
- [ ] All images load from Supabase
- [ ] SSL certificate is valid
- [ ] Domain redirects to HTTPS

### Testing Script

```bash
# Test homepage
curl -I https://your-domain.com

# Test API health
curl https://your-domain.com/api/letta-analytics

# Test upload (with image file)
curl -X POST https://your-domain.com/api/upload \
  -F "file=@test.jpg" \
  -F "title=Test" \
  -F "location=Test"
```

---

## Monitoring & Maintenance

### Application Monitoring

#### Vercel

- Built-in analytics in dashboard
- View function logs in real-time
- Monitor performance metrics

#### Self-Hosted

```bash
# View PM2 logs
pm2 logs remixify

# Monitor CPU/Memory
pm2 monit

# View status
pm2 status
```

### Error Tracking

**Recommended**: Integrate [Sentry](https://sentry.io)

```bash
# Install Sentry
pnpm add @sentry/nextjs

# Initialize
npx @sentry/wizard -i nextjs
```

Update `next.config.mjs`:

```javascript
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig = {
  // ... your config
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: "your-org",
  project: "remixify",
});
```

### Performance Monitoring

**Vercel Analytics**:

```bash
# Already installed
import { Analytics } from '@vercel/analytics/react';

// In layout.tsx
<Analytics />
```

### Backup Strategy

#### Database Backups

```bash
# Automated daily backups with Supabase
# Configure in Supabase Dashboard > Database > Backups

# Manual backup
supabase db dump -f backup-$(date +%Y%m%d).sql
```

#### Storage Backups

```bash
# Use Supabase CLI or S3 sync tools
# Configure in Supabase Dashboard > Storage > Backup
```

### SSL Certificate Renewal

**Let's Encrypt** auto-renews. Verify:

```bash
# Test renewal
sudo certbot renew --dry-run

# View certificate status
sudo certbot certificates
```

### Updates & Maintenance

```bash
# Pull latest changes
git pull origin main

# Install dependencies
pnpm install

# Build
pnpm build

# Restart (PM2)
pm2 restart remixify

# Restart (Vercel)
git push origin main  # Auto-deploys
```

---

## Scaling Considerations

### Horizontal Scaling

**Vercel**: Automatically scales serverless functions

**Self-Hosted**:

```bash
# Increase PM2 instances
pm2 scale remixify 4

# Or in ecosystem.config.js
instances: 4,  // Or 'max' for all CPU cores
```

### Database Optimization

```sql
-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_ads_created_at ON ads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON prompts(created_at DESC);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM ads ORDER BY created_at DESC LIMIT 20;
```

### Caching Strategy

**Implement Redis** for caching (optional):

```bash
# Install Redis
sudo apt install redis-server

# Install Node.js client
pnpm add ioredis
```

```typescript
// lib/redis.ts
import Redis from "ioredis";

export const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
});

// Cache analytics for 5 minutes
const cacheKey = "letta:analytics";
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

// Fetch from Letta...
await redis.setex(cacheKey, 300, JSON.stringify(data));
```

---

## Troubleshooting Production Issues

### Issue: 502 Bad Gateway

**Cause**: Application crashed or not running

**Solution**:

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs --lines 100

# Restart application
pm2 restart remixify
```

### Issue: Slow Video Generation

**Cause**: Timeout or network issues

**Solutions**:

- Increase Nginx timeout (already set to 600s)
- Increase Vercel function timeout (Pro plan)
- Implement polling mechanism client-side

### Issue: High Memory Usage

**Solution**:

```bash
# Check memory
pm2 monit

# Increase Node.js memory limit
pm2 restart remixify --max-memory-restart 1G
```

### Issue: Database Connection Errors

**Solution**:

- Check Supabase project status
- Verify API keys are correct
- Check connection pool limits
- Enable connection pooling in Supabase settings

---

## Security Hardening

### Production Security Checklist

- [ ] All API keys rotated for production
- [ ] CORS configured to allow only production domain
- [ ] Rate limiting implemented (Vercel Edge Config or custom)
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (Supabase client handles this)
- [ ] XSS protection (Next.js handles this)
- [ ] HTTPS enforced (redirect HTTP to HTTPS)
- [ ] Security headers configured

### Security Headers

Add to `next.config.mjs`:

```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};
```

---

## Cost Estimation

### Monthly Costs (Approximate)

| Service          | Tier          | Cost               |
| ---------------- | ------------- | ------------------ |
| Vercel           | Pro           | $20/month          |
| Supabase         | Pro           | $25/month          |
| Google Gemini    | Pay-as-you-go | ~$10-50/month      |
| Anthropic Claude | Pay-as-you-go | ~$10-30/month      |
| Vertex AI (Veo)  | Pay-as-you-go | ~$50-200/month     |
| Letta            | Varies        | $0-100/month       |
| **Total**        |               | **$115-425/month** |

**Note**: Costs vary based on usage. Implement caching and rate limiting to reduce costs.

---

## Rollback Strategy

### Vercel Rollback

1. Go to **Deployments** in dashboard
2. Find previous successful deployment
3. Click **⋯** → **Promote to Production**

### Self-Hosted Rollback

```bash
# Revert to previous commit
git log --oneline
git checkout <previous-commit-hash>

# Rebuild
pnpm build

# Restart
pm2 restart remixify
```

---

**🎉 Congratulations! Your Remixify platform is now deployed to production.**

For support, refer to the troubleshooting sections or create an issue in the repository.
