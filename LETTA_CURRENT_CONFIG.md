# Letta Current Configuration

## 🎯 Current Company Being Analyzed

**Nike** - All Letta analytics are currently configured to analyze Nike advertising campaigns.

## 📊 What Letta is Analyzing

Your Letta agent generates analytics for:
- **Sentiment Analysis** - How audiences feel about Nike ads (positive/neutral/negative)
- **Audience Demographics** - Age groups, gender distribution, and geographic locations of Nike ad viewers
- **Competitor Benchmarking** - How Nike's campaign performance compares to competitors like Adidas, Puma, and Under Armour

## 🏷️ "Powered by Letta" Badges

All Letta-powered components now display a badge:
- ✅ Sentiment Analysis card
- ✅ Audience Demographics card
- ✅ Competitor Benchmarking card

## 🔄 Changing the Company

To analyze a different company, edit these files:

### 1. API Route (`frontend/app/api/letta-analytics/route.ts`)
Line 18:
```typescript
Please analyze [COMPANY NAME] advertising campaign data and provide analytics in JSON format.
```

### 2. Test Script (`scripts/get-analytics.mjs`)
Line 25:
```typescript
Please analyze the [COMPANY NAME] advertising campaign and provide detailed analytics data in JSON format.
```

### Example: Switching to Apple
Replace "Nike" with "Apple" in both locations, then:
```bash
node scripts/get-analytics.mjs  # Test the change
npm run dev                      # Restart your app
```

## 📍 Current Status

✅ **Active Company:** Nike
✅ **Letta API Key:** Configured in `frontend/.env`
✅ **Agent ID:** agent-3af75001-7e1e-4029-a63a-2cabb24d34fd
✅ **Badges Added:** All analytics components
✅ **Test Working:** Successfully generates realistic data

## 🎨 Badge Design

The "Powered by Letta" badge includes:
- ✨ Sparkles icon
- Outline variant styling
- Small text size (text-xs)
- Positioned in card headers

## 💡 Data Source

Letta generates **simulated analytics** based on:
- Industry knowledge of Nike campaigns
- Typical performance benchmarks
- Realistic demographic distributions
- Competitor market positions

The data is realistic but not live-scraped. For real-time data, you would need to configure custom Letta tools to scrape actual social media APIs.
