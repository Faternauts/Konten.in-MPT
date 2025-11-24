// Conversion.ai tracking utilities
// Track user engagement events and sync to Conversion CRM

// Type definitions for tracking events
export type ConversionEventType =
  | 'page_view'
  | 'ad_view'
  | 'ad_click'
  | 'remix_created'
  | 'remix_shared'
  | 'ad_engagement';

export interface ConversionEventData {
  eventType: ConversionEventType;
  userId?: string;
  campaignId?: string;
  adId?: string;
  adTitle?: string;
  promptContent?: string;
  metadata?: Record<string, any>;
}

// Check if Conversion pixel is loaded
function isConversionLoaded(): boolean {
  return typeof window !== 'undefined' &&
         typeof (window as any).conversion !== 'undefined';
}

// Track a custom event with Conversion
export function trackConversionEvent(data: ConversionEventData): void {
  try {
    if (!isConversionLoaded()) {
      console.warn('Conversion pixel not loaded yet, queuing event:', data);
      // Queue event for later if pixel isn't loaded
      queueEvent(data);
      return;
    }

    const { eventType, userId, campaignId, adId, adTitle, promptContent, metadata } = data;

    // Track the event using Conversion's pixel API
    const conversion = (window as any).conversion;

    // Conversion pixel typically has a track method
    if (typeof conversion.track === 'function') {
      conversion.track(eventType, {
        user_id: userId,
        campaign_id: campaignId,
        ad_id: adId,
        ad_title: adTitle,
        prompt_content: promptContent,
        timestamp: new Date().toISOString(),
        ...metadata
      });

      console.log('Conversion event tracked:', eventType, data);
    } else {
      console.warn('Conversion.track method not available');
    }
  } catch (error) {
    console.error('Error tracking Conversion event:', error);
  }
}

// Queue events if pixel isn't loaded yet
const eventQueue: ConversionEventData[] = [];

function queueEvent(data: ConversionEventData): void {
  eventQueue.push(data);

  // Try to flush queue after a short delay
  setTimeout(flushEventQueue, 1000);
}

function flushEventQueue(): void {
  if (!isConversionLoaded() || eventQueue.length === 0) return;

  while (eventQueue.length > 0) {
    const event = eventQueue.shift();
    if (event) {
      trackConversionEvent(event);
    }
  }
}

// Specific tracking functions for common events

export function trackAdView(adId: string, adTitle: string, userId?: string, campaignId?: string): void {
  trackConversionEvent({
    eventType: 'ad_view',
    userId,
    campaignId,
    adId,
    adTitle,
    metadata: {
      viewed_at: new Date().toISOString()
    }
  });
}

export function trackAdClick(adId: string, adTitle: string, userId?: string, campaignId?: string): void {
  trackConversionEvent({
    eventType: 'ad_click',
    userId,
    campaignId,
    adId,
    adTitle,
    metadata: {
      clicked_at: new Date().toISOString()
    }
  });
}

export function trackRemixCreated(
  adId: string,
  adTitle: string,
  promptContent: string,
  userId?: string,
  campaignId?: string
): void {
  trackConversionEvent({
    eventType: 'remix_created',
    userId,
    campaignId,
    adId,
    adTitle,
    promptContent,
    metadata: {
      remix_created_at: new Date().toISOString(),
      prompt_length: promptContent.length
    }
  });
}

export function trackRemixShared(
  adId: string,
  adTitle: string,
  userId?: string,
  campaignId?: string
): void {
  trackConversionEvent({
    eventType: 'remix_shared',
    userId,
    campaignId,
    adId,
    adTitle,
    metadata: {
      shared_at: new Date().toISOString()
    }
  });
}

// Identify user with contact information (for lead capture)
export function identifyConversionUser(
  userId: string,
  email?: string,
  name?: string,
  additionalData?: Record<string, any>
): void {
  try {
    if (!isConversionLoaded()) {
      console.warn('Conversion pixel not loaded, cannot identify user');
      return;
    }

    const conversion = (window as any).conversion;

    if (typeof conversion.identify === 'function') {
      conversion.identify(userId, {
        email,
        name,
        ...additionalData,
        identified_at: new Date().toISOString()
      });

      console.log('Conversion user identified:', userId);
    }
  } catch (error) {
    console.error('Error identifying Conversion user:', error);
  }
}

// Check if tracking is enabled for a specific campaign
export function isCampaignTrackingEnabled(campaignId: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const trackingSettings = localStorage.getItem('conversion_campaign_tracking');
    if (!trackingSettings) return false;

    const settings = JSON.parse(trackingSettings);
    return settings[campaignId] === true;
  } catch (error) {
    console.error('Error checking campaign tracking setting:', error);
    return false;
  }
}

// Enable/disable tracking for a specific campaign
export function setCampaignTracking(campaignId: string, enabled: boolean): void {
  if (typeof window === 'undefined') return;

  try {
    const trackingSettings = localStorage.getItem('conversion_campaign_tracking');
    const settings = trackingSettings ? JSON.parse(trackingSettings) : {};

    settings[campaignId] = enabled;
    localStorage.setItem('conversion_campaign_tracking', JSON.stringify(settings));

    console.log(`Conversion tracking ${enabled ? 'enabled' : 'disabled'} for campaign:`, campaignId);
  } catch (error) {
    console.error('Error setting campaign tracking:', error);
  }
}
