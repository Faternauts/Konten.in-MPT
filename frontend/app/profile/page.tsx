"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings,
  Trophy,
  Heart,
  Sparkles,
  TrendingUp,
  Calendar,
  Award,
  Crown,
  Zap,
  Target,
  Gift,
  Bookmark,
  CreditCard,
  Coffee,
  Shirt,
  Ticket
} from "lucide-react"

const userStats = {
  username: "creative_maker",
  displayName: "Alex Rivera",
  bio: "Digital creator Making brands better, one remix at a time",
  joinDate: "January 2025",
  points: 8420,
  remixCount: 127,
  likesReceived: 5234,
  followers: 892,
  following: 156,
  creditsRemaining: 3,
}

const badges = [
  { id: 1, name: "100 Remix Master", icon: Sparkles, color: "gradient-primary", unlocked: true },
  { id: 2, name: "Viral Creator", icon: TrendingUp, color: "gradient-primary", unlocked: true },
  { id: 3, name: "Brand Champion", icon: Crown, color: "gradient-primary", unlocked: false },
  { id: 4, name: "Top 10 Creator", icon: Trophy, color: "gradient-primary", unlocked: true },
  { id: 5, name: "Lightning Fast", icon: Zap, color: "gradient-primary", unlocked: false },
  { id: 6, name: "Challenge Winner", icon: Target, color: "gradient-primary", unlocked: true },
]

const myRemixes = [
  {
    id: 1,
    brand: "Nike",
    image: "/nike-athletic-shoe-advertisement.jpg",
    prompt: "Make the shoes glow with neon colors",
    likes: 1247,
    views: 8234,
    createdAt: "2 days ago",
  },
  {
    id: 2,
    brand: "Apple",
    image: "/apple-iphone-product-advertisement.jpg",
    prompt: "Add holographic display effects",
    likes: 2891,
    views: 12453,
    createdAt: "5 days ago",
  },
  {
    id: 3,
    brand: "Coca-Cola",
    image: "/coca-cola-super-bowl-commercial.jpg",
    prompt: "Transform into retro 80s aesthetic",
    likes: 3456,
    views: 15678,
    createdAt: "1 week ago",
  },
  {
    id: 4,
    brand: "Tesla",
    image: "/tesla-electric-car-advertisement.jpg",
    prompt: "Add cyberpunk city background",
    likes: 1823,
    views: 9876,
    createdAt: "1 week ago",
  },
  {
    id: 5,
    brand: "McDonald's",
    image: "/mcdonalds-burger-advertisement.jpg",
    prompt: "Make it look like a movie poster",
    likes: 987,
    views: 5432,
    createdAt: "2 weeks ago",
  },
  {
    id: 6,
    brand: "Spotify",
    image: "/spotify-music-streaming-advertisement.jpg",
    prompt: "Add vibrant music waves",
    likes: 2134,
    views: 11234,
    createdAt: "2 weeks ago",
  },
]

const savedRemixes = [
  
  {
    id: 8,
    brand: "Amazon",
    creator: "Marcus Johnson",
    image: "/amazon-prime-delivery-advertisement.jpg",
    prompt: "Add drone delivery in cyberpunk city",
    likes: 3214,
    views: 14567,
    savedAt: "3 days ago",
  },
  {
    id: 9,
    brand: "Pepsi",
    creator: "Emma Rodriguez",
    image: "/pepsi-super-bowl-halftime-show-ad.jpg",
    prompt: "Turn into 80s music video aesthetic",
    likes: 5678,
    views: 23456,
    savedAt: "5 days ago",
  },
]

const rewards = [
  {
    id: 1,
    name: "Nike Air Max Sneakers",
    company: "Nike",
    icon: Shirt,
    milestone: "Create 50 remixes on Nike ads",
    progress: 34,
    goal: 50,
    description: "Limited edition Nike Air Max for top Nike creators",
    unlocked: false,
  },
  {
    id: 2,
    name: "iPhone 16 Pro",
    company: "Apple",
    icon: Gift,
    milestone: "Reach 10K likes on Apple ad remixes",
    progress: 8234,
    goal: 10000,
    description: "Win the latest iPhone 16 Pro",
    unlocked: false,
  },
  {
    id: 3,
    name: "$100 Starbucks Gift Card",
    company: "Starbucks",
    icon: Coffee,
    milestone: "Create viral remix (50K+ views) for Starbucks",
    progress: 23450,
    goal: 50000,
    description: "Exclusive reward for viral creators",
    unlocked: false,
  },
  {
    id: 4,
    name: "$50 Amazon Gift Card",
    company: "Amazon",
    icon: Gift,
    milestone: "Top 3 remix on Amazon challenge",
    progress: 1,
    goal: 3,
    description: "Finish in top 3 of active Amazon challenge",
    unlocked: true,
  },
  {
    id: 5,
    name: "Tesla Model Y Test Drive",
    company: "Tesla",
    icon: Ticket,
    milestone: "Win Tesla remix challenge",
    progress: 0,
    goal: 1,
    description: "Win the monthly Tesla remix challenge",
    unlocked: false,
  },
  {
    id: 6,
    name: "Coca-Cola VIP Event Pass",
    company: "Coca-Cola",
    icon: Ticket,
    milestone: "Featured in Coca-Cola's top 10 remixes",
    progress: 1,
    goal: 1,
    description: "VIP access to Coca-Cola creator summit",
    unlocked: true,
  },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("saved")

  return (
    <div className="min-h-screen pb-12">
      {/* Header Section */}
      <section className="bg-white dark:bg-slate-900 py-12 px-4 border-b">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <Avatar className="h-32 w-32 ring-4 ring-primary/30 dark:ring-primary shadow-xl">
              <AvatarImage src="" />
              <AvatarFallback className="text-4xl font-bold bg-primary text-white">AR</AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">{userStats.displayName}</h1>
                <Badge className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary border-0 w-fit mx-auto md:mx-0">
                  @{userStats.username}
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground mb-4 max-w-2xl">{userStats.bio}</p>
              <div className="flex items-center gap-4 text-muted-foreground text-sm justify-center md:justify-start">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {userStats.joinDate}
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  {userStats.points.toLocaleString()} points
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" className="bg-transparent border-primary/30 hover:bg-primary/5">
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-all">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-foreground mb-1">{userStats.remixCount}</div>
              <div className="text-sm text-muted-foreground">Remixes</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-foreground mb-1">{userStats.likesReceived.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Likes</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-foreground mb-1">{userStats.followers}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-foreground mb-1">{userStats.following}</div>
              <div className="text-sm text-muted-foreground">Following</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-foreground mb-1">{userStats.creditsRemaining}</div>
              <div className="text-sm text-muted-foreground">Credits</div>
            </CardContent>
          </Card>
        </div>

        {/* Badges Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5" />
              Badges & Achievements
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {badges.map((badge) => {
                const Icon = badge.icon
                return (
                  <div
                    key={badge.id}
                    className={`relative p-4 rounded-xl text-center transition-all ${
                      badge.unlocked
                        ? badge.color + " hover:shadow-lg hover:scale-105"
                        : "bg-secondary/50 opacity-50 grayscale"
                    }`}
                  >
                    <Icon className={`h-8 w-8 mx-auto mb-2 ${badge.unlocked ? "text-white" : "text-muted-foreground"}`} />
                    <p className={`text-xs font-semibold ${badge.unlocked ? "text-white" : "text-muted-foreground"}`}>
                      {badge.name}
                    </p>
                    {!badge.unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-background/80 rounded-full px-2 py-1 text-xs font-bold">
                          Locked
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Rewards Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Brand Rewards
              </h2>
              <p className="text-sm text-muted-foreground">
                Earn exclusive rewards from brands by reaching milestones on their ads
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.map((reward) => {
                const Icon = reward.icon
                const progressPercentage = (reward.progress / reward.goal) * 100
                return (
                  <Card
                    key={reward.id}
                    className={`overflow-hidden transition-all ${
                      reward.unlocked
                        ? "border-2 border-primary hover:shadow-lg hover:scale-105"
                        : "hover:shadow-md"
                    }`}
                  >
                    <CardContent className="p-4">
                      {/* Header with icon and company */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`p-3 rounded-lg ${reward.unlocked ? "bg-primary" : "bg-primary/70"}`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <Badge variant="secondary" className="mb-2 text-xs">
                            {reward.company}
                          </Badge>
                          <h3 className="font-semibold text-sm mb-1">{reward.name}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">{reward.description}</p>
                        </div>
                      </div>

                      {/* Milestone progress */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-start gap-2">
                          <Target className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <p className="text-xs text-muted-foreground">{reward.milestone}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-semibold">
                              {reward.progress.toLocaleString()} / {reward.goal.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all bg-primary"
                              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Action button */}
                      <Button
                        size="sm"
                        className={`w-full ${reward.unlocked ? "bg-primary text-white hover:bg-primary/90" : ""}`}
                        disabled={!reward.unlocked}
                        variant={reward.unlocked ? "default" : "outline"}
                      >
                        {reward.unlocked ? (
                          <>
                            <Trophy className="h-4 w-4 mr-2" />
                            Claim Reward
                          </>
                        ) : (
                          `${Math.round(progressPercentage)}% Complete`
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 bg-muted h-auto">
            <TabsTrigger
              value="saved"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Bookmark className="h-4 w-4 mr-2" />
              Saved ({savedRemixes.length})
            </TabsTrigger>
            <TabsTrigger
              value="remixes"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              My Remixes ({myRemixes.length})
            </TabsTrigger>
            <TabsTrigger
              value="liked"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Heart className="h-4 w-4 mr-2" />
              Liked
            </TabsTrigger>
            <TabsTrigger
              value="challenges"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Challenges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedRemixes.map((remix) => (
                <Card key={remix.id} className="overflow-hidden hover:shadow-xl transition-all group">
                  <div className="relative overflow-hidden">
                    <img
                      src={remix.image || "/placeholder.svg"}
                      alt={`${remix.brand} remix`}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-background/90 backdrop-blur-sm hover:bg-background"
                      >
                        <Bookmark className="h-4 w-4 fill-primary text-primary" />
                      </Button>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white text-sm font-medium line-clamp-2 drop-shadow-lg">{remix.prompt}</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4 bg-background/80 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-semibold block">{remix.brand}</span>
                        <span className="text-xs text-muted-foreground">by {remix.creator}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{remix.savedAt}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {remix.likes.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        {remix.views.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="remixes" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myRemixes.map((remix) => (
                <Card key={remix.id} className="overflow-hidden hover:shadow-xl transition-all group">
                  <div className="relative overflow-hidden">
                    <img
                      src={remix.image || "/placeholder.svg"}
                      alt={`${remix.brand} remix`}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white text-sm font-medium line-clamp-2 drop-shadow-lg">{remix.prompt}</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4 bg-background/80 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{remix.brand}</span>
                      <span className="text-xs text-muted-foreground">{remix.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {remix.likes.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        {remix.views.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="liked" className="space-y-6">
            <div className="text-center py-12">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No liked remixes yet</h3>
              <p className="text-muted-foreground">Start exploring and like remixes that inspire you!</p>
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No active challenges</h3>
              <p className="text-muted-foreground mb-4">Join challenges to compete for prizes and prove you're the best!</p>
              <Button className="gradient-primary text-white">
                Browse Challenges
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
