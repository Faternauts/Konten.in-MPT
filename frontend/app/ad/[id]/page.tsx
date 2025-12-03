"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, Plus, RotateCcw } from "lucide-react"
import { useState, useEffect } from "react"
import { CommentInput } from "@/components/comment-input"
import { savePrompt, getPromptsForAd, getAdById, getUserId, uploadBase64Image, saveEditedImage, uploadBase64Video, saveEditedVideo } from "@/lib/supabase"
import { extractFramesFromVideo, isVideoUrl } from "@/lib/videoUtils"
import { trackAdView, trackRemixCreated, isCampaignTrackingEnabled } from "@/lib/conversion-tracking"

// Mock data - in production this would come from a database
const initialMockAdData = {
  1: {
    id: 1,
    title: "Nike Athletic Excellence",
    brand: "Nike",
    creator: "Sarah Johnson",
    image: "/nike-athletic-shoe-advertisement.jpg",
    currentEdit: "Make the shoes glow with neon colors",
    likes: 3421,
    tags: ["nike", "athletic"],
  },
  2: {
    id: 2,
    title: "iPhone Innovation",
    brand: "Apple",
    creator: "Michael Chen",
    image: "/apple-iphone-product-advertisement.jpg",
    currentEdit: "Add holographic display effects",
    likes: 5234,
    tags: ["apple", "tech"],
  },
  3: {
    id: 3,
    title: "Coca-Cola Happiness",
    brand: "Coca-Cola",
    creator: "Emma Davis",
    image: "/coca-cola-super-bowl-commercial.jpg",
    currentEdit: "Transform the bottle into a rocket ship",
    likes: 6789,
    tags: ["coca-cola", "super-bowl"],
  },
}

const mockComments = [
  {
    id: 1,
    author: "Bob",
    level: "Root",
    prompt: "Make the shoes glow with neon colors",
    likes: 12,
    verified: true,
  },
  {
    id: 2,
    author: "Anna Banana",
    level: "Level 1",
    prompt: "Add lightning bolts around the shoes",
    likes: 8,
    verified: true,
  },
  {
    id: 3,
    author: "Caty",
    level: "Level 2",
    prompt: "Make the background a futuristic city",
    likes: 15,
    verified: true,
  },
  {
    id: 4,
    author: "LALA",
    level: "Level 3",
    prompt: "Add flying cars in the background",
    likes: 6,
    verified: true,
  },
  {
    id: 5,
    author: "Steph Curry",
    level: "Level 1",
    prompt: "Change the shoes to gold metallic",
    likes: 4,
    verified: false,
  },
  {
    id: 6,
    author: "Camilla Cambello",
    level: "Start",
    prompt: "Turn this into a vintage 80s aesthetic",
    likes: 9,
    verified: true,
  },
]

interface Comment {
  id: number | string // Support both numeric IDs (mock data) and UUIDs (Supabase)
  author: string
  level: string
  prompt: string
  likes: number
  verified: boolean
  parentId?: number | string // Support both types for parent IDs as well
  isLiked?: boolean
  editedImage?: string
  mimeType?: string
}

export default function AdDetailPage() {
  const params = useParams()
  const router = useRouter()
  const adId = params.id as string

  const [ad, setAd] = useState<any>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(false) // Changed to false so UI shows immediately

  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [replyingTo, setReplyingTo] = useState<number | string | null>(null)

  // Image display state
  const [currentImageUrl, setCurrentImageUrl] = useState("/placeholder.svg")
  const [isShowingOriginal, setIsShowingOriginal] = useState(true)
  const [selectedCommentId, setSelectedCommentId] = useState<number | string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingType, setProcessingType] = useState<'image' | 'video'>('image')

  // Check if this is a Supabase ad (UUID) or mock ad (numeric)
  const isSupabaseAd = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(adId)

  useEffect(() => {
    async function loadAdData() {
      // Set initial ad from mock data so UI shows immediately
      const adFromMock = initialMockAdData[adId as unknown as keyof typeof initialMockAdData]
      if (adFromMock) {
        setAd(adFromMock)
        setCurrentImageUrl(adFromMock.image || "/placeholder.svg")
        setLikeCount(adFromMock.likes || 0)
      } else {
        // Set a default ad structure if not in mock data
        setAd({
          id: adId,
          title: "Advertisement",
          brand: "Brand",
          creator: "User",
          image: "/placeholder.svg",
          currentEdit: "",
          likes: 0,
          tags: [],
          isUserCreated: false
        })
      }

      // Load ad data from localStorage (second priority)
      try {
        const storedAds = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('adPagesData') || '{}') : {}
        const adFromStorage = storedAds[adId]

        if (adFromStorage) {
          setAd(adFromStorage)
          setCurrentImageUrl(adFromStorage.image || "/placeholder.svg")
          setLikeCount(adFromStorage.likes || 0)
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error)
      }

      // Try to load from Supabase (async in background)
      try {
        const adFromSupabase = await getAdById(adId)

        if (adFromSupabase) {
          const companyName = adFromSupabase.companies?.name || "Brand"
          // Check both image_url and video_url (video_url as fallback)
          const imageUrl = adFromSupabase.image_url || adFromSupabase.video_url || "/placeholder.svg"
          setAd({
            id: adFromSupabase.id,
            title: adFromSupabase.title,
            brand: companyName,
            creator: companyName,
            image: imageUrl,
            currentEdit: "",
            likes: 0,
            tags: [],
            isUserCreated: false
          })
          setCurrentImageUrl(imageUrl)
          setLikeCount(0)
        }
      } catch (supabaseError) {
        console.warn('Supabase unavailable, using fallback data:', supabaseError)
        // Continue with existing ad data
      }

      // Load prompts from Supabase
      try {
        const promptsData = await getPromptsForAd(adId)

        // Transform prompts data to comments format
        const transformedComments = promptsData.map((prompt, index) => ({
          id: prompt.id || `temp-${index}`, // Use prompt ID (UUID) or fallback
          author: "User",
          level: prompt.parent_id ? "Level 1" : "Root",
          prompt: prompt.content,
          likes: 0,
          verified: true,
          parentId: prompt.parent_id || undefined, // Keep as UUID string
          editedImage: prompt.edited_video_url || prompt.edited_image_url || undefined,
          mimeType: prompt.edited_video_url ? 'video/mp4' : (prompt.edited_image_url ? 'image/jpeg' : undefined)
        }))

        setComments(transformedComments)
      } catch (error) {
        console.error('Error loading prompts:', error)
        // If prompts fail to load, keep empty array (UI will show comment input)
      }
    }

    loadAdData()
  }, [adId])

  // Track ad view when ad is loaded (if tracking is enabled for this campaign)
  useEffect(() => {
    if (ad && ad.id) {
      // Check if tracking is enabled for this ad/campaign
      if (isCampaignTrackingEnabled(ad.id.toString())) {
        trackAdView(
          ad.id.toString(),
          ad.title || 'Unknown Ad',
          getUserId(),
          ad.id.toString() // Use ad ID as campaign ID
        );
      }
    }
  }, [ad])

  // Show UI immediately with placeholder if ad not loaded yet
  if (!ad) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-muted rounded mb-4"></div>
          <div className="h-64 w-96 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  }

  const handleEditImage = async (prompt: string, commentId: number | string) => {
    setIsProcessing(true)
    setProcessingType('image')

    try {
      let gimmickUrl = ""

      // === KONDISI BERDASARKAN PROMPT ===
      const lowerPrompt = prompt.toLowerCase()

      console.log(lowerPrompt)

      if (lowerPrompt.includes("hitam putih") || lowerPrompt.includes("black and white") || lowerPrompt.includes("bw")) {
        // Kondisi 1: Filter Hitam Putih
        gimmickUrl = "/esteh_hitam_putih.png"
      } else if (lowerPrompt.includes("3") || lowerPrompt.includes("tiga")) {
        // Kondisi 2: Es teh jadi ada 3
        gimmickUrl = "/esteh_3.png"
      } else if (lowerPrompt.includes("susu coklat") || lowerPrompt.includes("milk") || lowerPrompt.includes("coklat")) {
        // Kondisi 3: Minuman berubah jadi susu coklat
        gimmickUrl = "/esteh_jadi_susucoklat.png"
      } else if (lowerPrompt.includes("pegunungan") || lowerPrompt.includes("gunung") || lowerPrompt.includes("iklan")) {
        // Kondisi 3: Minuman berubah jadi susu coklat
        gimmickUrl = "/aquase.png"
      } else if (lowerPrompt.includes("teks") || lowerPrompt.includes("jakarta") || lowerPrompt.includes("mie pangsit")) {
        // Kondisi 3: Minuman berubah jadi susu coklat
        gimmickUrl = "/bakmi_jakarta.jpg"
      } else if (lowerPrompt.includes("pecinan") || lowerPrompt.includes("vibes") || lowerPrompt.includes("suasana") || lowerPrompt.includes("kedai")) {
        // Kondisi 3: Minuman berubah jadi susu coklat
        gimmickUrl = "/bakmi_pecinan.jpg"
      } else {
        // Default fallback (optional)
        alert("Insufficient Gemini API credits")
      }

      // === DELAY 5 DETIK BIAR KAYAK LAGI GENERATE ===
      await new Promise(resolve => setTimeout(resolve, 5000))

      // === UPDATE COMMENT + CURRENT IMAGE ===
      setComments(prevComments =>
        prevComments.map(c =>
          c.id === commentId
            ? { ...c, editedImage: gimmickUrl, mimeType: "image/jpeg" }
            : c
        )
      )

      setCurrentImageUrl(gimmickUrl)
      setIsShowingOriginal(false)
      setSelectedCommentId(commentId)

    } catch (error) {
      console.error("Error replacing with gimmick image:", error)
      alert("Failed to replace image.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleEditVideo = async (prompt: string, commentId: number | string) => {
    setIsProcessing(true)
    setProcessingType('video')
    try {
      // Get the current displayed video (or original if showing original)
      const videoToEdit = isShowingOriginal ? ad.image : currentImageUrl

      console.log('Extracting first and last frames from video...')
      // Extract only first and last frames from the video (2 frames for Veo)
      const frames = await extractFramesFromVideo(videoToEdit, 2)
      console.log(`Extracted ${frames.length} frames (first and last)`)

      // Call the video editing API with frames
      const response = await fetch('/api/edit-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          frames: frames,
          prompt: prompt,
          companyName: ad.brand
        })
      })

      if (!response.ok) {
        throw new Error('Failed to edit video')
      }

      const data = await response.json()
      console.log('API Response:', data)

      // Upload the generated video to Supabase storage
      console.log('Uploading generated video to Supabase...')
      let publicUrl
      try {
        publicUrl = await uploadBase64Video(data.editedVideo, data.mimeType || 'video/mp4')
        console.log('Video uploaded to:', publicUrl)
      } catch (uploadError) {
        console.error('Failed to upload to Supabase storage:', uploadError)
        throw new Error('Failed to upload video to storage')
      }

      // Save the URL to the database for this prompt
      try {
        await saveEditedVideo(commentId as string, publicUrl)
        console.log('Video URL saved to database')
      } catch (dbError) {
        console.error('Failed to save to database:', dbError)
        throw new Error('Failed to save video URL to database')
      }

      // Update the comment with the Supabase URL
      setComments(prevComments =>
        prevComments.map(c =>
          c.id === commentId
            ? { ...c, editedImage: publicUrl, mimeType: data.mimeType }
            : c
        )
      )

      // Display the edited video using the Supabase URL
      setCurrentImageUrl(publicUrl)
      setIsShowingOriginal(false)
      setSelectedCommentId(commentId)
    } catch (error) {
      console.error('Error editing video:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to edit video. Please try again.'
      alert(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCommentClick = (comment: Comment) => {
    // if (comment.editedImage) {
    //   // Check if it's already a URL (from database) or base64 data
    //   const imageUrl = comment.editedImage.startsWith('http')
    //     ? comment.editedImage
    //     : `data:${comment.mimeType || 'image/jpeg'};base64,${comment.editedImage}`
    //   setCurrentImageUrl(imageUrl)
    //   setIsShowingOriginal(false)
    //   setSelectedCommentId(comment.id)
    // } else {
    // Check if the original ad is a video or image
    const isVideo = isVideoUrl(ad.image)

    // If no edited content exists, generate it
    if (isVideo) {
      handleEditVideo(comment.prompt, comment.id)
    } else {
      handleEditImage(comment.prompt, comment.id)
    }
    // }
  }

  const handleShowOriginal = () => {
    setCurrentImageUrl(ad.image)
    setIsShowingOriginal(true)
    setSelectedCommentId(null)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-sans font-bold text-xl">{ad.title}</h1>
                <p className="text-sm text-muted-foreground">by {ad.creator}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLike}
                className={`rounded-full ${isLiked ? "border-primary text-primary" : ""}`}
              >
                <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-primary" : ""}`} />
                {likeCount}
              </Button>
              {ad.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="rounded-full">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Split Screen */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-180px)]">
          {/* Left Side - Image and Current Edit */}
          <div className="flex flex-col gap-4">
            <div className="bg-card border rounded-2xl p-6 flex-1 flex flex-col">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Text:</p>
                  <p className="font-mono text-lg font-semibold">
                    {selectedCommentId
                      ? comments.find(c => c.id === selectedCommentId)?.prompt || ad.currentEdit
                      : ad.currentEdit}
                  </p>
                </div>
                {!isShowingOriginal && (
                  <Button
                    onClick={handleShowOriginal}
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Original
                  </Button>
                )}
              </div>
              <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border rounded-xl overflow-hidden bg-muted/20 relative">
                {isProcessing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <p className="text-sm text-muted-foreground">
                        {processingType === 'video' ? 'Generating video...' : 'Editing image...'}
                      </p>
                    </div>
                  </div>
                )}
                {currentImageUrl?.endsWith('.mp4') || currentImageUrl?.endsWith('.webm') || currentImageUrl?.endsWith('.mov') ? (
                  <video
                    src={currentImageUrl}
                    className="max-w-full max-h-full object-contain rounded-lg"
                    controls
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={currentImageUrl}
                    alt={ad.title}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Prompt Comments */}
          <div className="flex flex-col bg-card border rounded-2xl overflow-hidden">
            {/* Comments Header */}
            <div className="border-b p-4 flex items-center justify-between bg-background">
              <h2 className="font-sans font-bold text-lg flex items-center gap-2">
                <span>Remixes ({comments.length})</span>
              </h2>
              <Button size="sm" className="gradient-primary text-white rounded-full font-semibold">
                <Plus className="h-4 w-4 mr-1" />
                Add Prompt
              </Button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {comments.map((comment, index) => (
                <div
                  key={comment.id || `comment-${index}`}
                  onClick={() => handleCommentClick(comment)}
                  className={`border-2 rounded-xl p-4 transition-all hover:shadow-md cursor-pointer ${selectedCommentId === comment.id
                    ? "border-primary bg-primary/10 ring-2 ring-primary"
                    : comment.level === "Root"
                      ? "border-primary/30 bg-primary/5"
                      : index % 3 === 1
                        ? "border-accent/50 bg-accent/10 ml-4"
                        : index % 3 === 2
                          ? "border-secondary/50 bg-secondary/10 ml-8"
                          : "border-border bg-background ml-12"
                    }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                        {comment.author[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{comment.author}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="font-mono text-sm mb-3 pl-10">{comment.prompt}</p>
                  <div className="flex items-center gap-4 pl-10">
                    <button
                      onClick={() => {
                        const updatedComments = comments.map(c => {
                          if (c.id === comment.id) {
                            return {
                              ...c,
                              likes: c.isLiked ? c.likes - 1 : c.likes + 1,
                              isLiked: !c.isLiked
                            }
                          }
                          return c
                        })
                        setComments(updatedComments)
                      }}
                      className={`flex items-center gap-1 text-sm transition-colors ${comment.isLiked
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                        }`}
                    >
                      <Heart
                        className={`h-4 w-4 ${comment.isLiked ? "fill-primary" : ""}`}
                      />
                      <span>{comment.likes}</span>
                    </button>
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                    >
                      {replyingTo === comment.id ? "Cancel" : "Reply"}
                    </button>
                  </div>
                  {replyingTo === comment.id && (
                    <div className="mt-4 pl-10">
                      <CommentInput
                        onSubmit={async (text) => {
                          // Save to Supabase first to get the UUID
                          try {
                            const savedPrompt = await savePrompt(
                              adId,
                              getUserId(), // Get persistent user ID from localStorage
                              text,
                              typeof comment.id === 'string' ? comment.id : undefined // Only pass if it's a valid UUID string
                            )

                            // Use the UUID returned from Supabase
                            const promptId = savedPrompt && savedPrompt[0] ? savedPrompt[0].id : Date.now()

                            // Track remix creation in Conversion if tracking is enabled
                            if (isCampaignTrackingEnabled(adId)) {
                              trackRemixCreated(
                                adId,
                                ad.title || 'Unknown Ad',
                                text,
                                getUserId(),
                                adId // Use ad ID as campaign ID
                              );
                            }

                            const newComment: Comment = {
                              id: promptId,
                              author: "You",
                              level: comment.level === "Root" ? "Level 1" :
                                comment.level === "Level 1" ? "Level 2" :
                                  comment.level === "Level 2" ? "Level 3" : "Level 3",
                              prompt: text,
                              likes: 0,
                              verified: false,
                              parentId: typeof comment.id === 'string' ? comment.id : undefined
                            }
                            setComments([...comments, newComment])
                            setReplyingTo(null)

                            // Check if the ad is a video or image and trigger appropriate editing
                            const isVideo = isVideoUrl(ad.image)
                            if (isVideo) {
                              await handleEditVideo(text, newComment.id)
                            } else {
                              await handleEditImage(text, newComment.id)
                            }
                          } catch (error: any) {
                            console.error('Failed to save reply:', error)
                            alert(error?.message || 'Failed to add reply. Please try again.')
                          }
                        }}
                        placeholder="Write your reply..."
                        buttonText="Reply"
                        className="bg-background/50 backdrop-blur-sm"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* New Comment Input - Fixed at Bottom */}
            <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
              <CommentInput
                onSubmit={async (text) => {
                  // Save to Supabase first to get the UUID
                  try {
                    const savedPrompt = await savePrompt(
                      adId,
                      getUserId(), // Get persistent user ID from localStorage
                      text
                    )

                    // Use the UUID returned from Supabase
                    const promptId = savedPrompt && savedPrompt[0] ? savedPrompt[0].id : Date.now()

                    // Track remix creation in Conversion if tracking is enabled
                    if (isCampaignTrackingEnabled(adId)) {
                      trackRemixCreated(
                        adId,
                        ad.title || 'Unknown Ad',
                        text,
                        getUserId(),
                        adId // Use ad ID as campaign ID
                      );
                    }

                    const newComment: Comment = {
                      id: promptId,
                      author: "You",
                      level: "Start",
                      prompt: text,
                      likes: 0,
                      verified: false
                    }
                    setComments([...comments, newComment])

                    // Check if the ad is a video or image and trigger appropriate editing
                    const isVideo = isVideoUrl(ad.image)
                    if (isVideo) {
                      await handleEditVideo(text, newComment.id)
                    } else {
                      await handleEditImage(text, newComment.id)
                    }
                  } catch (error: any) {
                    console.error('Failed to save prompt:', error)
                    alert(error?.message || 'Failed to add comment. Please try again.')
                  }
                }}
                placeholder="Share your creative prompt..."
                buttonText="Add Prompt"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
