"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Image as ImageIcon, Video } from "lucide-react"

interface UploadAdModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (adData: {
    brand: string
    title: string
    imageUrl: string
    category: string
    companyId: string
    location: string
    isVideo?: boolean
  }) => void
}

export function UploadAdModal({ isOpen, onClose, onSubmit }: UploadAdModalProps) {
  const [brand, setBrand] = useState("")
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("Tech")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const categories = ["Tech", "Fashion", "Food", "Super Bowl", "Viral"]

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedFile && brand && title && location && category) {
      try {
        // Upload file to server
        const formData = new FormData()
        formData.append('file', selectedFile)
        formData.append('brand', brand)
        formData.append('title', title)
        formData.append('location', location)
        formData.append('category', category)
        formData.append('companyId', brand) // Use brand name as company ID

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        const uploadData = await response.json()

        // Call onSubmit with the upload data
        onSubmit({
          brand: uploadData.brand,
          title: uploadData.title,
          imageUrl: uploadData.filename,
          category: uploadData.category,
          companyId: uploadData.brand, // Use brand name as company ID
          location: uploadData.location || location,
          isVideo: uploadData.isVideo || false
        })

        // Reset form
        setBrand("")
        setTitle("")
        setLocation("")
        setSelectedFile(null)
        setPreviewUrl(null)
        onClose()
      } catch (error) {
        console.error('Error uploading:', error)
        alert('Failed to upload. Please try again.')
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload New Advertisement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image/Video Upload */}
          <div className="space-y-2">
            <Label>Advertisement Image or Video</Label>
            <div className="border-2 border-dashed rounded-lg p-4 hover:bg-accent/5 transition-colors">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
                id="ad-image"
                required
              />
              <label
                htmlFor="ad-image"
                className="flex flex-col items-center justify-center gap-2 cursor-pointer"
              >
                {previewUrl ? (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                    {selectedFile?.type.startsWith('video/') ? (
                      <video
                        src={previewUrl}
                        className="object-cover w-full h-full"
                        controls
                        muted
                      />
                    ) : (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="object-cover w-full h-full"
                      />
                    )}
                  </div>
                ) : (
                  <>
                    <div className="h-32 flex items-center justify-center">
                      <div className="flex gap-4">
                        <ImageIcon className="h-16 w-16 text-muted-foreground/50" />
                        <Video className="h-16 w-16 text-muted-foreground/50" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Upload className="h-4 w-4" />
                      Click to upload image or video
                    </div>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Brand Name */}
          <div className="space-y-2">
            <Label htmlFor="brand">Brand Name/Your Name </Label>
            <Input
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Nike, Apple, Coca-Cola"
              required
            />
          </div>

          {/* Ad Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Advertisement Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Summer Collection Launch"
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Portland, Oregon"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  type="button"
                  variant={category === cat ? "default" : "outline"}
                  onClick={() => setCategory(cat)}
                  className={`rounded-full ${
                    category === cat ? "gradient-primary text-white" : ""
                  }`}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full gradient-primary text-white rounded-full font-semibold"
            disabled={!selectedFile || !brand || !title || !location}
          >
            Upload Advertisement
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
