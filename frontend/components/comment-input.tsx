"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface CommentInputProps {
  onSubmit: (text: string) => void
  placeholder?: string
  buttonText?: string
  className?: string
}

export function CommentInput({ onSubmit, placeholder = "Write a comment...", buttonText = "Post", className = "" }: CommentInputProps) {
  const [text, setText] = useState("")

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text.trim())
      setText("")
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="min-h-[80px] resize-none"
      />
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="gradient-primary text-white rounded-full font-semibold"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  )
}
