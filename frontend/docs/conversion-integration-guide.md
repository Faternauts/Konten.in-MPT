# Conversion.ai Integration Guide

## Overview
Your ad remix platform now integrates with Conversion.ai to track user engagement and automatically sync leads to their CRM for automated marketing campaigns.

## How It Works

### 1. **Conversion Pixel Installation**
- The Conversion pixel is automatically loaded on all pages via the root layout
- Location: `/app/layout.tsx`
- Script: `https://p.conversion.ai`

### 2. **Campaign Toggle ("Reach Out via Conversion")**
Each campaign card in the brand dashboard has a toggle that enables/disables Conversion tracking:

**When ENABLED (toggle ON):**
- User engagement data is sent to Conversion
- Events tracked: Ad views, remix creation
- Data includes: user ID, campaign ID, ad title, prompt content

**When DISABLED (toggle OFF):**
- No data is sent to Conversion
- User privacy is preserved

### 3. **Events Tracked**

#### Ad Views
- **When**: User lands on ad detail page (`/ad/[id]`)
- **Data sent**: Ad ID, ad title, user ID, timestamp
- **File**: `/app/ad/[id]/page.tsx` (line 224-236)

#### Remix Creation
- **When**: User submits a prompt/remix
- **Data sent**: Ad ID, ad title, prompt content, user ID, timestamp
- **Files**:
  - Main comment: `/app/ad/[id]/page.tsx` (line 661-670)
  - Reply comments: `/app/ad/[id]/page.tsx` (line 610-619)

#### Campaign Views
- **When**: Brand dashboard campaigns tab is viewed
- **Data sent**: Campaign ID, campaign name, user ID
- **File**: `/app/brands/page.tsx` (line 321-335)

## Technical Implementation

### Tracking Service
Location: `/lib/conversion-tracking.ts`

Key functions:
```typescript
// Track ad view
trackAdView(adId, adTitle, userId, campaignId)

// Track remix creation
trackRemixCreated(adId, adTitle, promptContent, userId, campaignId)

// Enable/disable tracking for a campaign
setCampaignTracking(campaignId, enabled)

// Check if tracking is enabled
isCampaignTrackingEnabled(campaignId)
```

### Data Storage
Campaign tracking preferences are stored in `localStorage` under the key `conversion_campaign_tracking`:
```json
{
  "campaign-1": true,
  "campaign-2": false,
  "campaign-3": true
}
```

## User Flow

1. **Brand Manager** goes to Brand Dashboard
2. **Enables toggle** on a campaign they want to track
3. **System** saves preference and enables Conversion tracking
4. **Users** view/remix that campaign's ads
5. **Events** are automatically sent to Conversion
6. **Conversion** receives leads with engagement data
7. **Conversion** can trigger automated email campaigns, workflows, etc.

## Privacy & Compliance

- Tracking is **opt-in per campaign** (brand must enable toggle)
- User data only sent when tracking is enabled
- Anonymous user IDs used (generated on first visit)
- No personal information collected without consent

## Future Enhancements

Possible additions:
- User identification with email/name for richer CRM data
- Additional events: ad clicks, shares, purchases
- Conversion dashboard integration to show synced leads
- A/B testing with Conversion workflows
- Attribution tracking for conversions back to remixes

## Troubleshooting

### Events Not Showing in Conversion
1. Check browser console for tracking calls
2. Verify toggle is enabled for campaign
3. Confirm Conversion pixel loaded (`window.conversion` exists)
4. Check localStorage for tracking preferences

### Toggle Not Working
1. Verify campaign ID matches between toggle and tracking
2. Check browser console for errors
3. Ensure localStorage is accessible

## Support

For Conversion.ai API questions or access to additional features:
- Visit: https://support.conversion.ai
- Email: support@conversion.ai
- Check: https://api-docs.conversion.ai
