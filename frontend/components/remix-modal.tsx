"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Wand2, Download, Share2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { savePromptWithEditedImage } from "@/lib/supabase"

interface RemixModalProps {
  isOpen: boolean
  onClose: () => void
  ad: {
    id: number | string
    brand: string
    image: string
    category: string
  } | null
}

export function RemixModal({ isOpen, onClose, ad }: RemixModalProps) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [selectedStyle, setSelectedStyle] = useState("original")

  const styles = [
    { id: "original", name: "Original Style", description: "Keep the brand aesthetic" },
    { id: "modern", name: "Modern", description: "Clean and minimalist" },
    { id: "retro", name: "Retro", description: "Vintage vibes" },
    { id: "bold", name: "Bold", description: "High contrast and vibrant" },
    { id: "cinematic", name: "Cinematic", description: "Movie poster style" },
  ]

  const handleGenerate = async () => {
    if (!prompt.trim() || !ad) return

    setIsGenerating(true)
    try {
      // Call the edit-image API
      const response = await fetch('/api/edit-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adId: ad.id,
          prompt: prompt.trim(),
          style: selectedStyle,
          originalImageUrl: ad.image
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate edited image')
      }

      const result = await response.json()
      setGeneratedImage(result.editedImageUrl)

      // Save the prompt and edited image to the database
      await savePromptWithEditedImage(
        ad.id.toString(),
        'user-' + Date.now(), // Generate a temporary user ID
        prompt.trim(),
        result.editedImageUrl
      )

      console.log('Edited image saved successfully')
    } catch (error) {
      console.error('Error generating image:', error)
      alert('Failed to generate edited image. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    console.log("[v0] Downloading remixed ad")
  }

  const handleShare = () => {
    console.log("[v0] Sharing remixed ad")
  }

  if (!ad) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Remix {ad.brand} Ad</DialogTitle>
            <Badge variant="secondary" className="text-sm">
              {ad.category}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Remix</TabsTrigger>
            <TabsTrigger value="preview" disabled={!generatedImage}>
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Original Ad */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Original Ad</Label>
                <div className="relative rounded-lg overflow-hidden border-2 border-border">
                  <img src={ad.image || "/placeholder.svg"} alt={`${ad.brand} original ad`} className="w-full h-auto" />
                </div>
              </div>

              {/* Remix Controls */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt" className="text-base font-semibold">
                    Your Creative Vision
                  </Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe how you want to remix this ad... (e.g., 'Make it futuristic with neon lights and cyberpunk aesthetic')"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Be specific about colors, mood, style, and elements you want to change
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold">Style Preset</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {styles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`p-3 rounded-lg border-2 text-left transition-all hover:border-primary ${
                          selectedStyle === style.id ? "border-primary bg-primary/5" : "border-border"
                        }`}
                      >
                        <div className="font-semibold text-sm">{style.name}</div>
                        <div className="text-xs text-muted-foreground">{style.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full gradient-primary text-white font-semibold py-6 text-lg"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Wand2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Your Remix...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Remix
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="font-normal">
                    1 Credit Required
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6 mt-6">
            {generatedImage && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Original */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-muted-foreground">Original</Label>
                    <div className="relative rounded-lg overflow-hidden border-2 border-border">
                      <img src={ad.image || "/placeholder.svg"} alt="Original ad" className="w-full h-auto" />
                    </div>
                  </div>

                  {/* Remixed */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-primary">Your Remix</Label>
                    <div className="relative rounded-lg overflow-hidden border-2 border-primary">
                      <img src={generatedImage || "/placeholder.svg"} alt="Remixed ad" className="w-full h-auto" />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button onClick={handleDownload} variant="outline" className="flex-1 bg-transparent" size="lg">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button onClick={handleShare} className="flex-1 gradient-primary text-white" size="lg">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share to Feed
                  </Button>
                </div>

                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-semibold text-sm">Your Prompt</p>
                      <p className="text-sm text-muted-foreground">{prompt}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Style: {styles.find((s) => s.id === selectedStyle)?.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
