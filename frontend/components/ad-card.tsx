"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Heart, MessageCircle, Share2, Trash2 } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface AdCardProps {
  id: number | string
  brand: string
  image: string
  remixCount: number
  likes: number
  comments: number
  category: string
  onRemix: (id: number | string) => void
  onDelete?: (id: number | string) => void
  isUserCreated?: boolean
}

export function AdCard({ 
  id, 
  brand, 
  image, 
  remixCount, 
  likes, 
  comments, 
  category, 
  onRemix,
  onDelete,
  isUserCreated = false 
}: AdCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(likes)

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  }

  const handleRemixClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onRemix(id)
  }

  return (
    <Link href={`/ad/${id}`}>
      <Card className="break-inside-avoid overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer">
        <div className="relative overflow-hidden bg-muted">
          <div className="w-full aspect-video bg-muted">
            {image?.endsWith('.mp4') || image?.endsWith('.webm') || image?.endsWith('.mov') ? (
              <video
                src={image}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 will-change-transform"
                muted
                loop
                playsInline
                onMouseEnter={e => e.currentTarget.play()}
                onMouseLeave={e => e.currentTarget.pause()}
                onError={(e) => {
                  console.error('Video failed to load:', image, e)
                }}
              />
            ) : (
              <img
                src={image || "/placeholder.svg"}
                alt={`${brand} ad`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 will-change-transform"
                onError={(e) => {
                  console.error('Image failed to load:', image, e)
                  // Set a fallback placeholder
                  ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                }}
              />
            )}
          </div>
          <Badge className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm text-foreground border-0">
            {category}
          </Badge>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground font-medium">{brand}</span>
            <Badge variant="secondary" className="flex items-center gap-1 bg-accent text-foreground">
              <TrendingUp className="h-3 w-3" />
              {remixCount.toLocaleString()}
            </Badge>
          </div>

          {/* Interaction Bar */}
          <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
            <button onClick={handleLike} className="flex items-center gap-1 hover:text-primary transition-colors">
              <Heart className={`h-4 w-4 ${isLiked ? "fill-primary text-primary" : ""}`} />
              <span>{likeCount.toLocaleString()}</span>
            </button>
            <button className="flex items-center gap-1 hover:text-primary transition-colors">
              <MessageCircle className="h-4 w-4" />
              <span>{comments}</span>
            </button>
            <div className="flex items-center gap-2 ml-auto">
              {isUserCreated && onDelete && (
                <button 
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onDelete(id)
                  }} 
                  className="flex items-center gap-1 hover:text-destructive transition-colors"
                  title="Delete ad"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <button className="flex items-center gap-1 hover:text-primary transition-colors">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <Button
            onClick={handleRemixClick}
            className="w-full gradient-primary text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Remix
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}
