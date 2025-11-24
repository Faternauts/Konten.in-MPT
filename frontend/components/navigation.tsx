"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Search, User, Trophy, Briefcase, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function Navigation() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const pathname = usePathname()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)

    // Store search query in sessionStorage so it can be accessed by the home page
    sessionStorage.setItem('searchQuery', value)

    // If not on home page, navigate to home page
    if (pathname !== '/' && value.trim()) {
      router.push('/')
    }

    // Dispatch custom event to trigger search on the page
    window.dispatchEvent(new CustomEvent('globalSearch', { detail: value }))
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div 
            className="text-2xl font-semibold gradient-text"
            style={{ fontFamily: 'Gill Sans, sans-serif' }}
          >
            Konten.in
          </div>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search ads, brands, creators..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 rounded-full border-border/50 focus-visible:ring-primary"
            />
          </form>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <Link href="/challenges">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full transition-all ${pathname === '/challenges' ? 'bg-primary/10' : 'hover:bg-primary/10'}`}
            >
              <Target className={`h-5 w-5 transition-colors ${pathname === '/challenges' ? 'text-primary' : 'hover:text-primary'}`} />
            </Button>
          </Link>

          <Link href="/leaderboard">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full transition-all ${pathname === '/leaderboard' ? 'bg-primary/10' : 'hover:bg-primary/10'}`}
            >
              <Trophy className={`h-5 w-5 transition-colors ${pathname === '/leaderboard' ? 'text-primary' : 'hover:text-primary'}`} />
            </Button>
          </Link>


          <Link href="/brands">
            <Button
              variant="outline"
              className={`hidden md:inline-flex rounded-full transition-all ${pathname === '/brands' ? 'bg-primary/10 border-primary' : 'bg-transparent hover:bg-primary/10 hover:border-primary'}`}
            >
              <Briefcase className={`h-4 w-4 mr-2 transition-colors ${pathname === '/brands' ? 'text-primary' : 'hover:text-primary'}`} />
              <span className={`transition-colors ${pathname === '/brands' ? 'text-primary' : 'hover:text-primary'}`}>For Brands</span>
            </Button>
          </Link>

          <Link href="/profile">
            <Avatar className={`h-9 w-9 cursor-pointer ring-2 transition-all ${pathname === '/profile' ? 'ring-primary' : 'ring-transparent hover:ring-primary'}`}>
              <AvatarImage src="" />
              <AvatarFallback className={`transition-colors ${pathname === '/profile' ? 'bg-primary/20 text-primary' : 'bg-purple-200 text-purple-600 hover:bg-primary/10 hover:text-primary'}`}>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </nav>
  )
}
