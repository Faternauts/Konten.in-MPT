import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('Supabase config check:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  urlPreview: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'missing'
})

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    NEXT_PUBLIC_SUPABASE_URL: !!supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!supabaseAnonKey
  })
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to generate a simple UUID v4
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// Get or create a persistent user ID for this browser session
function getUserId(): string {
  if (typeof window === 'undefined') return generateUUID()

  let userId = localStorage.getItem('temp_user_id')
  if (!userId) {
    userId = generateUUID()
    localStorage.setItem('temp_user_id', userId)
  }
  return userId
}

// Helper functions for database operations
export async function savePrompt(adId: string, userId: string, content: string, parentId?: string) {
  try {
    console.log('Saving prompt:', { adId, userId, content, parentId })

    // Validate that adId is a UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    if (!uuidRegex.test(adId)) {
      const error = new Error('Cannot save comment: This is a demo ad. Comments can only be added to uploaded ads.')
      console.error('Invalid ad_id (not a UUID):', adId)
      throw error
    }

    // Validate or generate userId as UUID
    let validUserId = userId
    if (!uuidRegex.test(userId)) {
      console.warn('Invalid user_id (not a UUID), generating new one:', userId)
      validUserId = getUserId()
    }

    // Validate that parentId is a UUID if provided
    const validParentId = parentId && uuidRegex.test(parentId) ? parentId : null

    if (parentId && !validParentId) {
      console.warn('Invalid parent_id provided (not a UUID), setting to null:', parentId)
    }

    const { data, error } = await supabase
      .from('prompts')
      .insert([
        {
          ad_id: adId,
          user_id: validUserId,
          content: content,
          parent_id: validParentId
        }
      ])
      .select()

    if (error) {
      console.error('Supabase savePrompt error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        fullError: JSON.stringify(error)
      })
      throw error
    }

    console.log('Successfully saved prompt:', data)
    return data
  } catch (err) {
    console.error('savePrompt caught error:', err)
    throw err
  }
}

export { getUserId }

export async function uploadMediaToStorage(file: File, type: 'image' | 'video') {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${type}s/${fileName}` // images/123456.jpg or videos/123456.mp4

    const { data, error } = await supabase.storage
      .from('ads')
      .upload(filePath, file)

    if (error) {
      console.error('Error uploading to storage:', error)
      throw error
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('ads')
      .getPublicUrl(filePath)

    return publicUrl
  } catch (err) {
    console.error('Error in uploadMediaToStorage:', err)
    throw err
  }
}

export async function saveAd(companyId: string, title: string, imageUrl: string, location: string, videoUrl?: string, likes?: number) {
  try {
    // Save the ad record with the provided URLs
    console.log('Saving ad with:', { companyId, title, imageUrl, location, videoUrl, likes })

    // Then save the ad record
    const { data, error } = await supabase
      .from('ads')
      .insert([
        {
          company_id: companyId,
          title: title,
          image_url: imageUrl,
          video_url: videoUrl || null,
          location: location,
          likes: likes || Math.floor(Math.random() * 9900 + 100) // Random likes between 100-10000
        }
      ])
      .select()

    if (error) {
      console.error('Error saving ad:', error)
      throw error
    }

    return data
  } catch (err) {
    console.error('Error in saveAd:', err)
    throw err
  }
}

export async function getPromptsForAd(adId: string) {
  try {
    console.log('Fetching prompts for ad ID:', adId)
    
    // First, try to get the UUID for this ad
    const { data: ad, error: adError } = await supabase
      .from('ads')
      .select('id')
      .eq('id', adId)
      .single()

    if (adError) {
      console.error('Error finding ad:', {
        message: adError.message,
        details: adError.details,
        hint: adError.hint,
        code: adError.code,
        adId
      })
      throw adError
    }

    if (!ad) {
      console.error('Ad not found:', adId)
      return []
    }

    // Now fetch prompts using the UUID
    const { data: prompts, error: promptsError } = await supabase
      .from('prompts')
      .select(`
        id,
        content,
        created_at,
        parent_id,
        user_id,
        edited_image_url,
        edited_video_url
      `)
      .eq('ad_id', ad.id)
      .order('created_at', { ascending: true })

    if (promptsError) {
      console.error('Supabase prompts error:', {
        message: promptsError.message,
        details: promptsError.details,
        hint: promptsError.hint,
        code: promptsError.code,
        adId: ad.id
      })
      throw promptsError
    }

    console.log('Successfully fetched prompts:', {
      adId: ad.id,
      count: prompts?.length || 0,
      prompts
    })
    
    return prompts || []
  } catch (err) {
    console.error('getPromptsForAd caught error:', err)
    // Return empty array instead of throwing to prevent UI from breaking
    return []
  }
}

export async function getPromptsForCompany(companyName: string) {
  try {
    // Single optimized query with join
    const { data, error } = await supabase
      .from('prompts')
      .select(`
        *,
        ads!inner(
          company_id,
          title,
          image_url,
          video_url,
          companies!inner(
            name
          )
        )
      `)
      .eq('ads.companies.name', companyName)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching company prompts:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Error in getPromptsForCompany:', err)
    return []
  }
}

export async function getAdsForCompany(companyName: string) {
  try {
    // Single optimized query with join
    const { data, error } = await supabase
      .from('ads')
      .select(`
        *,
        companies!inner(
          id,
          name
        )
      `)
      .eq('companies.name', companyName)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching ads:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Error in getAdsForCompany:', err)
    return []
  }
}

export async function getAdById(adId: string) {
  try {
    console.log('Fetching ad with ID:', adId)
    
    // Try to fetch by ID (could be UUID or numeric string)
    const { data, error } = await supabase
      .from('ads')
      .select(`
        *,
        companies (*)
      `)
      .eq('id', adId)
      .single()

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw error
    }

    console.log('Successfully fetched ad:', data)
    return data
  } catch (err) {
    console.error('getAdById caught error:', {
      error: err,
      stringified: JSON.stringify(err),
      adId: adId,
      errorType: typeof err,
      errorKeys: err ? Object.keys(err) : 'no error object'
    })
    throw err
  }
}

export async function getAllAds() {
  const { data, error } = await supabase
    .from('ads')
    .select(`
      *,
      companies (*),
      prompts (id)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.warn('Supabase ads table not accessible:', error)
    return [] // Return empty array instead of throwing
  }

  return data || []
}

export async function createCompany(name: string) {
  const { data, error } = await supabase
    .from('companies')
    .insert([{ name }])
    .select()
    .single()

  if (error) {
    console.error('Error creating company:', error)
    throw error
  }

  return data
}

export async function getOrCreateCompany(name: string) {
  // First try to find existing company
  const { data: existing, error: findError } = await supabase
    .from('companies')
    .select('*')
    .eq('name', name)
    .single()

  if (findError && findError.code !== 'PGRST116') {
    console.error('Error finding company:', findError)
    throw findError
  }

  if (existing) {
    return existing
  }

  // Create new company if not found
  return await createCompany(name)
}

export async function uploadBase64Image(base64Data: string, mimeType: string = 'image/jpeg'): Promise<string> {
  try {
    // Convert base64 to blob
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    // Generate unique filename
    const fileExt = mimeType.split('/')[1] || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `edited/${fileName}`;

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('ads')
      .upload(filePath, blob, {
        contentType: mimeType,
        upsert: false
      });

    if (error) {
      console.error('Error uploading to storage:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('ads')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (err) {
    console.error('Error in uploadBase64Image:', err);
    throw err;
  }
}

export async function saveEditedImage(promptId: string, imageUrl: string) {
  try {
    console.log('Saving edited image for prompt:', promptId, 'URL:', imageUrl)

    const { data, error } = await supabase
      .from('prompts')
      .update({ edited_image_url: imageUrl })
      .eq('id', promptId)
      .select()

    if (error) {
      console.error('Error saving edited image:', error)
      throw error
    }

    console.log('Edited image saved successfully:', data)
    return data
  } catch (err) {
    console.error('Error in saveEditedImage:', err)
    throw err
  }
}

export async function uploadBase64Video(base64Data: string, mimeType: string = 'video/mp4'): Promise<string> {
  try {
    // Convert base64 to blob
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    // Generate unique filename
    const fileExt = mimeType.split('/')[1] || 'mp4';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `edited-videos/${fileName}`;

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('ads')
      .upload(filePath, blob, {
        contentType: mimeType,
        upsert: false
      });

    if (error) {
      console.error('Error uploading video to storage:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('ads')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (err) {
    console.error('Error in uploadBase64Video:', err);
    throw err;
  }
}

export async function saveEditedVideo(promptId: string, videoUrl: string) {
  try {
    console.log('Saving edited video for prompt:', promptId, 'URL:', videoUrl)

    const { data, error } = await supabase
      .from('prompts')
      .update({ edited_video_url: videoUrl })
      .eq('id', promptId)
      .select()

    if (error) {
      console.error('Supabase error saving edited video:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        promptId,
        videoUrl
      })

      // If column doesn't exist, try saving to edited_image_url instead as fallback
      if (error.message.includes('edited_video_url') || error.code === '42703') {
        console.log('edited_video_url column may not exist, trying edited_image_url as fallback...')
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('prompts')
          .update({ edited_image_url: videoUrl })
          .eq('id', promptId)
          .select()

        if (fallbackError) {
          console.error('Fallback also failed:', fallbackError)
          throw error
        }

        console.log('Saved to edited_image_url as fallback:', fallbackData)
        return fallbackData
      }

      throw error
    }

    console.log('Edited video saved successfully:', data)
    return data
  } catch (err) {
    console.error('Error in saveEditedVideo:', err)
    throw err
  }
}

export async function savePromptWithEditedImage(adId: string, userId: string, content: string, editedImageUrl: string, parentId?: string) {
  try {
    console.log('Saving prompt with edited image:', { adId, userId, content, editedImageUrl, parentId })
    
    const { data, error } = await supabase
      .from('prompts')
      .insert([{
        ad_id: adId,
        user_id: userId,
        content: content,
        edited_image_url: editedImageUrl,
        parent_id: parentId || null
      }])
      .select()

    if (error) {
      console.error('Error saving prompt with edited image:', error)
      throw error
    }

    console.log('Prompt with edited image saved successfully:', data)
    return data[0]
  } catch (err) {
    console.error('Error in savePromptWithEditedImage:', err)
    throw err
  }
}

export async function deleteAd(adId: string) {
  try {
    console.log('=== Starting deleteAd ===')
    console.log('Ad ID to delete:', adId)

    // First, get the ad to find its media URLs
    console.log('Step 1: Fetching ad data...')
    const { data: ad, error: getError } = await supabase
      .from('ads')
      .select('image_url, video_url')
      .eq('id', adId)
      .single()

    if (getError) {
      console.error('Error fetching ad for deletion:', getError)
      throw new Error(`Failed to fetch ad: ${getError.message}`)
    }

    console.log('Ad data retrieved:', ad)

    // Delete all prompts associated with this ad
    console.log('Step 2: Deleting associated prompts...')
    const { error: promptsError } = await supabase
      .from('prompts')
      .delete()
      .eq('ad_id', adId)

    if (promptsError) {
      console.error('Error deleting prompts:', promptsError)
      // Continue anyway - prompts might not exist
    } else {
      console.log('Prompts deleted successfully')
    }

    // Delete the ad from the database
    console.log('Step 3: Deleting ad from database...')
    const { error: adError } = await supabase
      .from('ads')
      .delete()
      .eq('id', adId)

    if (adError) {
      console.error('Error deleting ad from database:', adError)
      throw new Error(`Failed to delete ad: ${adError.message}`)
    }

    console.log('Ad deleted from database successfully')

    // Delete media files from storage
    if (ad) {
      console.log('Step 4: Deleting media files from storage...')
      const filesToDelete: string[] = []

      // Extract file paths from URLs
      if (ad.image_url) {
        const imagePath = extractStoragePath(ad.image_url)
        console.log('Image path extracted:', imagePath)
        if (imagePath) filesToDelete.push(imagePath)
      }

      if (ad.video_url) {
        const videoPath = extractStoragePath(ad.video_url)
        console.log('Video path extracted:', videoPath)
        if (videoPath) filesToDelete.push(videoPath)
      }

      // Delete files from storage bucket
      if (filesToDelete.length > 0) {
        console.log('Files to delete from storage:', filesToDelete)
        const { error: storageError } = await supabase.storage
          .from('ads')
          .remove(filesToDelete)

        if (storageError) {
          console.error('Error deleting files from storage:', storageError)
          // Don't throw here - the database records are already deleted
        } else {
          console.log('Files deleted from storage successfully')
        }
      } else {
        console.log('No files to delete from storage')
      }
    }

    console.log('=== Ad deleted successfully ===')
    return true
  } catch (err: any) {
    console.error('=== Error in deleteAd ===')
    console.error('Error details:', err)
    throw err
  }
}

// Helper function to extract storage path from public URL
function extractStoragePath(url: string): string | null {
  try {
    // URLs look like: https://[project].supabase.co/storage/v1/object/public/ads/images/123456.jpg
    const match = url.match(/\/ads\/(.+)$/)
    return match ? match[1] : null
  } catch (err) {
    console.error('Error extracting storage path:', err)
    return null
  }
}

