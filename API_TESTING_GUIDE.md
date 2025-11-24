# 🧪 API Testing Guide

This guide provides comprehensive instructions for testing all API endpoints in the Remixify platform.

---

## Table of Contents

1. [Setup for Testing](#setup-for-testing)
2. [Testing with cURL](#testing-with-curl)
3. [Testing with Postman](#testing-with-postman)
4. [Testing with the UI](#testing-with-the-ui)
5. [Automated Testing Scripts](#automated-testing-scripts)

---

## Setup for Testing

### Prerequisites

- Application running on http://localhost:3000
- All environment variables configured
- Supabase database seeded with test data

### Start the Development Server

```bash
cd frontend
pnpm dev
```

---

## Testing with cURL

### 1. Test Image Upload

```bash
# Note: Replace /path/to/image.jpg with an actual image path
curl -X POST http://localhost:3000/api/upload \
  -F "file=@/path/to/image.jpg" \
  -F "title=Test Ad" \
  -F "location=San Francisco"
```

**Expected Response**:

```json
{
  "ad": {
    "id": "uuid-here",
    "title": "Test Ad",
    "image_url": "https://...supabase.co/storage/v1/object/public/ads/images/...",
    "location": "San Francisco",
    "likes": 0,
    "created_at": "2025-11-24T..."
  }
}
```

---

### 2. Test Image Editing (Gemini)

```bash
curl -X POST http://localhost:3000/api/edit-image \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://your-supabase-url.supabase.co/storage/v1/object/public/ads/images/test.jpg",
    "prompt": "Make the background blue and add stars"
  }'
```

**Expected Response**:

```json
{
  "editedImage": "base64-encoded-image-data...",
  "mimeType": "image/png",
  "message": "Image generated successfully by Gemini 2.5 Flash Image",
  "analysis": "The image now features..."
}
```

---

### 3. Test Video Generation (Veo)

**Note**: Video generation takes 2-10 minutes. Use a smaller test first.

```bash
curl -X POST http://localhost:3000/api/edit-video \
  -H "Content-Type: application/json" \
  -d '{
    "frames": [
      "base64-encoded-first-frame",
      "base64-encoded-last-frame"
    ],
    "prompt": "Create a futuristic ad with neon lights",
    "companyName": "Nike"
  }'
```

**Expected Response** (after 2-10 minutes):

```json
{
  "success": true,
  "editedVideo": "base64-encoded-video-data...",
  "mimeType": "video/mp4"
}
```

---

### 4. Test Prompt Analysis (Claude)

```bash
curl -X POST http://localhost:3000/api/analyze-prompts \
  -H "Content-Type: application/json" \
  -d '{
    "prompts": [
      "Make the shoes glow with neon colors",
      "Add lightning bolts around the shoes",
      "Change the shoes to gold metallic",
      "Make the background a futuristic city"
    ]
  }'
```

**Expected Response**:

```json
{
  "themes": ["neon aesthetics", "futuristic elements", "metallic finishes"],
  "emotionalTone": "energetic and bold",
  "styleReferences": ["cyberpunk", "sci-fi", "luxury"],
  "intent": "Users want to modernize the ad with futuristic and premium elements"
}
```

---

### 5. Test Letta Analytics

```bash
curl -X GET http://localhost:3000/api/letta-analytics
```

**Expected Response**:

```json
{
  "sentiment": {
    "positive": 72,
    "neutral": 20,
    "negative": 8
  },
  "demographics": {
    "ageGroups": [
      { "range": "18-24", "percentage": 35 },
      { "range": "25-34", "percentage": 40 },
      { "range": "35-44", "percentage": 15 },
      { "range": "45+", "percentage": 10 }
    ],
    "gender": [
      { "gender": "Female", "percentage": 45 },
      { "gender": "Male", "percentage": 52 },
      { "gender": "Other", "percentage": 3 }
    ],
    "locations": [
      { "location": "United States", "percentage": 45 },
      { "location": "United Kingdom", "percentage": 15 },
      { "location": "Canada", "percentage": 12 },
      { "location": "Australia", "percentage": 8 },
      { "location": "Other", "percentage": 20 }
    ]
  },
  "competitors": [
    {
      "brand": "Adidas",
      "score": 78,
      "engagement": "High",
      "color": "bg-blue-500"
    },
    {
      "brand": "Puma",
      "score": 65,
      "engagement": "Medium",
      "color": "bg-purple-500"
    }
  ]
}
```

---

## Testing with Postman

### Import Collection

Create a Postman collection with these requests:

#### 1. Upload Ad

- **Method**: POST
- **URL**: `http://localhost:3000/api/upload`
- **Body Type**: form-data
- **Form Data**:
  - `file`: [Select File]
  - `title`: "Test Ad"
  - `location`: "San Francisco"

#### 2. Edit Image

- **Method**: POST
- **URL**: `http://localhost:3000/api/edit-image`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):

```json
{
  "imageUrl": "https://example.com/image.jpg",
  "prompt": "Make it futuristic"
}
```

#### 3. Generate Video

- **Method**: POST
- **URL**: `http://localhost:3000/api/edit-video`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):

```json
{
  "frames": ["base64frame1", "base64frame2"],
  "prompt": "Create cyberpunk ad",
  "companyName": "Nike"
}
```

#### 4. Analyze Prompts

- **Method**: POST
- **URL**: `http://localhost:3000/api/analyze-prompts`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):

```json
{
  "prompts": ["Add neon glow", "Make it futuristic", "Add metallic finish"]
}
```

#### 5. Get Analytics

- **Method**: GET
- **URL**: `http://localhost:3000/api/letta-analytics`

---

## Testing with the UI

### 1. Upload Ad Test

**Steps**:

1. Navigate to http://localhost:3000
2. Click "Upload Ad" button
3. Fill in:
   - **Title**: "Test Nike Air Max"
   - **Location**: "United States"
4. Upload an image or video
5. Click "Upload"

**Expected Result**:

- Success message appears
- New ad shows in feed
- Image/video is visible
- Ad has like/comment buttons

---

### 2. Image Remix Test

**Steps**:

1. Navigate to any image ad in the feed
2. Click the ad to view details
3. Click "Remix" button
4. Enter prompt: "Make the shoes glow with neon blue light"
5. Click "Generate"
6. Wait 5-15 seconds

**Expected Result**:

- Loading spinner appears
- Edited image displays in modal
- Image shows neon blue glow effect
- "Save Remix" button is enabled

---

### 3. Video Remix Test

**Steps**:

1. Navigate to any video ad in the feed
2. Click the ad to view details
3. Click "Remix" button
4. Enter prompt: "Add cyberpunk aesthetic with neon city background"
5. Click "Generate"
6. Wait 2-10 minutes (this is normal for Veo)

**Expected Result**:

- Loading message: "Generating video... (this may take a few minutes)"
- Progress indicator shows
- Generated video displays when ready
- Video plays with new aesthetic

---

### 4. Analytics Dashboard Test

**Steps**:

1. Navigate to http://localhost:3000/brands
2. Wait for data to load

**Expected Result**:

- Sentiment Analysis chart displays with positive/neutral/negative bars
- "Powered by Letta" badge visible
- Age Groups pie chart shows distribution
- Gender demographics displayed
- Geographic distribution shown
- Competitor benchmarking table with scores

---

### 5. Signal Extraction Test

**Steps**:

1. Navigate to any ad with multiple remixes
2. Scroll to the prompts/remixes section
3. Click "Extract Signals" or "Analyze" button
4. Wait 2-5 seconds

**Expected Result**:

- Modal opens with analysis
- **Themes**: List of detected themes
- **Emotional Tone**: Overall sentiment
- **Style References**: Mentioned styles
- **Intent Summary**: User intent description

---

## Automated Testing Scripts

### Test Script: Image Editing

Create `test-image-edit.mjs`:

```javascript
import fetch from "node-fetch";
import fs from "fs";

async function testImageEdit() {
  console.log("Testing image editing...");

  // Read a test image
  const imageBuffer = fs.readFileSync("./test-image.jpg");
  const base64Image = imageBuffer.toString("base64");
  const dataUrl = `data:image/jpeg;base64,${base64Image}`;

  const response = await fetch("http://localhost:3000/api/edit-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imageUrl: dataUrl,
      prompt: "Make the background purple and add stars",
    }),
  });

  const result = await response.json();

  if (result.editedImage) {
    console.log("✅ Image edited successfully");
    console.log("MIME Type:", result.mimeType);
    console.log("Analysis:", result.analysis?.substring(0, 100) + "...");

    // Save edited image
    const editedBuffer = Buffer.from(result.editedImage, "base64");
    fs.writeFileSync("./edited-image.png", editedBuffer);
    console.log("Saved to: edited-image.png");
  } else {
    console.error("❌ Failed:", result.error);
  }
}

testImageEdit().catch(console.error);
```

**Run**:

```bash
node test-image-edit.mjs
```

---

### Test Script: Prompt Analysis

Create `test-prompt-analysis.mjs`:

```javascript
import fetch from "node-fetch";

async function testPromptAnalysis() {
  console.log("Testing prompt analysis...");

  const prompts = [
    "Make the shoes glow with neon colors",
    "Add lightning bolts around the shoes",
    "Change the shoes to gold metallic",
    "Make the background a futuristic city",
    "Add flying cars in the background",
  ];

  const response = await fetch("http://localhost:3000/api/analyze-prompts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompts }),
  });

  const result = await response.json();

  console.log("\n📊 Analysis Results:");
  console.log("Themes:", result.themes);
  console.log("Emotional Tone:", result.emotionalTone);
  console.log("Style References:", result.styleReferences);
  console.log("Intent:", result.intent);
}

testPromptAnalysis().catch(console.error);
```

**Run**:

```bash
node test-prompt-analysis.mjs
```

---

### Test Script: End-to-End

Create `test-e2e.mjs`:

```javascript
import fetch from "node-fetch";
import fs from "fs";

async function runE2ETest() {
  console.log("🧪 Running End-to-End Test\n");

  // Test 1: Upload Ad
  console.log("1️⃣ Testing ad upload...");
  const formData = new FormData();
  const imageBuffer = fs.readFileSync("./test-ad.jpg");
  formData.append("file", new Blob([imageBuffer]), "test-ad.jpg");
  formData.append("title", "E2E Test Ad");
  formData.append("location", "Test Location");

  const uploadResponse = await fetch("http://localhost:3000/api/upload", {
    method: "POST",
    body: formData,
  });
  const uploadResult = await uploadResponse.json();
  console.log("✅ Ad uploaded:", uploadResult.ad?.id);

  // Test 2: Edit Image
  console.log("\n2️⃣ Testing image edit...");
  const editResponse = await fetch("http://localhost:3000/api/edit-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imageUrl: uploadResult.ad.image_url,
      prompt: "Make it futuristic",
    }),
  });
  const editResult = await editResponse.json();
  console.log("✅ Image edited successfully");

  // Test 3: Analyze Prompts
  console.log("\n3️⃣ Testing prompt analysis...");
  const analysisResponse = await fetch(
    "http://localhost:3000/api/analyze-prompts",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompts: ["Make it futuristic", "Add neon glow"],
      }),
    }
  );
  const analysisResult = await analysisResponse.json();
  console.log("✅ Prompts analyzed:", analysisResult.themes);

  // Test 4: Get Analytics
  console.log("\n4️⃣ Testing analytics...");
  const analyticsResponse = await fetch(
    "http://localhost:3000/api/letta-analytics"
  );
  const analyticsResult = await analyticsResponse.json();
  console.log("✅ Analytics retrieved:", Object.keys(analyticsResult));

  console.log("\n🎉 All tests passed!");
}

runE2ETest().catch(console.error);
```

**Run**:

```bash
node test-e2e.mjs
```

---

## Common Issues & Solutions

### Issue: "Missing API Key" Error

**Solution**: Verify environment variables are set in `frontend/.env.local`

```bash
# Check if variables are loaded
cd frontend
cat .env.local | grep API_KEY
```

---

### Issue: Image Upload Returns 404

**Solution**: Verify Supabase bucket is public

```sql
-- Run in Supabase SQL Editor
SELECT * FROM storage.buckets WHERE name = 'ads';
-- Ensure 'public' column is true
```

---

### Issue: Gemini Returns "Safety Block"

**Solution**: Try a different prompt or image. Gemini may block content it deems unsafe.

---

### Issue: Veo Video Generation Times Out

**Solution**:

- Increase timeout to 15 minutes
- Check GCP quotas
- Verify access token is valid: `gcloud auth print-access-token`

---

### Issue: Letta Returns Malformed JSON

**Solution**: Update system prompt to explicitly request valid JSON format

---

## Performance Benchmarks

| Endpoint               | Expected Response Time | Notes                      |
| ---------------------- | ---------------------- | -------------------------- |
| `/api/upload`          | 1-3 seconds            | Depends on file size       |
| `/api/edit-image`      | 5-15 seconds           | Gemini processing time     |
| `/api/edit-video`      | 2-10 minutes           | Veo long-running operation |
| `/api/analyze-prompts` | 2-5 seconds            | Claude analysis            |
| `/api/letta-analytics` | 3-8 seconds            | Agent response time        |

---

## Load Testing

### Using Artillery

Install Artillery:

```bash
npm install -g artillery
```

Create `load-test.yml`:

```yaml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Get Analytics"
    flow:
      - get:
          url: "/api/letta-analytics"
```

Run:

```bash
artillery run load-test.yml
```

---

**Happy Testing! 🧪**
