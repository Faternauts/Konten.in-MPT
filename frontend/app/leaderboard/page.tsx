"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, TrendingUp, Flame, Crown, Medal, Award, Search, Star, Heart } from "lucide-react"

const topCreators = [
  {
    id: 1,
    rank: 1,
    name: "Sarah Chen",
    username: "@sarahcreates",
    avatar: "/placeholder.svg?height=80&width=80",
    points: 15420,
    remixes: 234,
    wins: 12,
    badge: "Legend",
  },
  {
    id: 2,
    rank: 2,
    name: "Marcus Johnson",
    username: "@marcusj",
    avatar: "/placeholder.svg?height=80&width=80",
    points: 14230,
    remixes: 198,
    wins: 10,
    badge: "Master",
  },
  {
    id: 3,
    rank: 3,
    name: "Emma Rodriguez",
    username: "@emmadesigns",
    avatar: "/placeholder.svg?height=80&width=80",
    points: 13890,
    remixes: 187,
    wins: 9,
    badge: "Master",
  },
  {
    id: 4,
    rank: 4,
    name: "Alex Kim",
    username: "@alexkim",
    avatar: "/placeholder.svg?height=80&width=80",
    points: 12450,
    remixes: 156,
    wins: 7,
    badge: "Expert",
  },
  {
    id: 5,
    rank: 5,
    name: "Jordan Taylor",
    username: "@jtaylor",
    avatar: "/placeholder.svg?height=80&width=80",
    points: 11230,
    remixes: 143,
    wins: 6,
    badge: "Expert",
  },
  {
    id: 6,
    rank: 6,
    name: "Priya Patel",
    username: "@priyacreative",
    avatar: "/placeholder.svg?height=80&width=80",
    points: 10890,
    remixes: 134,
    wins: 5,
    badge: "Expert",
  },
  {
    id: 7,
    rank: 7,
    name: "Chris Anderson",
    username: "@chrisanderson",
    avatar: "/placeholder.svg?height=80&width=80",
    points: 9870,
    remixes: 121,
    wins: 4,
    badge: "Pro",
  },
  {
    id: 8,
    rank: 8,
    name: "Maya Williams",
    username: "@mayaw",
    avatar: "/placeholder.svg?height=80&width=80",
    points: 9340,
    remixes: 115,
    wins: 4,
    badge: "Pro",
  },
]

const featuredCreator = {
  name: "Sarah Chen",
  username: "@sarahcreates",
  avatar: "/placeholder.svg?height=120&width=120",
  weeklyRemixes: 23,
  weeklyLikes: 12453,
  totalPoints: 15420,
  badge: "Legend",
  bio: "Specializing in tech & fashion ads. Top creator for Nike & Apple remixes.",
  topRemix: {
    brand: "Nike",
    image: "/nike-athletic-shoe-advertisement.jpg",
    likes: 8234,
  }
}

const weeklyTrendingRemixes = [
  {
    id: 1,
    creator: "Sarah Chen",
    username: "@sarahcreates",
    brand: "Nike",
    image: "/nike-athletic-shoe-advertisement.jpg",
    prompt: "Neon cyberpunk aesthetic",
    likes: 8234,
    views: 45230,
    growth: "+342%",
  },
  {
    id: 2,
    creator: "Marcus Johnson",
    username: "@marcusj",
    brand: "Apple",
    image: "/apple-iphone-product-advertisement.jpg",
    prompt: "Holographic future tech",
    likes: 7891,
    views: 42100,
    growth: "+298%",
  },
  {
    id: 3,
    creator: "Emma Rodriguez",
    username: "@emmadesigns",
    brand: "Coca-Cola",
    image: "/coca-cola-super-bowl-commercial.jpg",
    prompt: "Retro 80s vibes",
    likes: 7456,
    views: 39870,
    growth: "+276%",
  },
  {
    id: 4,
    creator: "Alex Kim",
    username: "@alexkim",
    brand: "Tesla",
    image: "/tesla-electric-car-advertisement.jpg",
    prompt: "Cyberpunk cityscape",
    likes: 6789,
    views: 35420,
    growth: "+245%",
  },
  {
    id: 5,
    creator: "Jordan Taylor",
    username: "@jtaylor",
    brand: "Spotify",
    image: "/spotify-music-streaming-advertisement.jpg",
    prompt: "Music wave visualization",
    likes: 5432,
    views: 28910,
    growth: "+198%",
  },
]

const categoryLeaderboards = [
  {
    category: "Fashion",
    description: "Athletic wear, streetwear, and fashion brands",
    topCreator: "Sarah Chen",
    topBrand: "Nike",
    remixCount: 3891,
    avgEngagement: "8.2K",
  },
  {
    category: "Tech",
    description: "Smartphones, gadgets, and tech innovations",
    topCreator: "Marcus Johnson",
    topBrand: "Apple",
    remixCount: 5234,
    avgEngagement: "12.3K",
  },
  {
    category: "Super Bowl",
    description: "Iconic Super Bowl commercials and moments",
    topCreator: "Emma Rodriguez",
    topBrand: "Coca-Cola",
    remixCount: 4567,
    avgEngagement: "15.7K",
  },
  {
    category: "Food & Beverage",
    description: "Fast food, restaurants, and drink brands",
    topCreator: "Jordan Taylor",
    topBrand: "McDonald's",
    remixCount: 3123,
    avgEngagement: "6.8K",
  },
  {
    category: "Viral",
    description: "Trending memes and viral ad moments",
    topCreator: "Priya Patel",
    topBrand: "Spotify",
    remixCount: 6789,
    avgEngagement: "18.4K",
  },
  {
    category: "Auto & Transport",
    description: "Cars, EVs, and transportation brands",
    topCreator: "Alex Kim",
    topBrand: "Tesla",
    remixCount: 2456,
    avgEngagement: "9.1K",
  },
]

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [timeframe, setTimeframe] = useState("all-time")

  const filteredCategories = categoryLeaderboards.filter(cat =>
    cat.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.topBrand.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-primary" />
      case 2:
        return <Medal className="h-6 w-6 text-primary/70" />
      case 3:
        return <Award className="h-6 w-6 text-primary/70" />
      default:
        return <span className="text-2xl font-bold text-muted-foreground">{rank}</span>
    }
  }

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Legend":
        return "bg-primary text-white"
      case "Master":
        return "bg-primary/90 text-white"
      case "Expert":
        return "bg-primary/80 text-white"
      case "Pro":
        return "bg-primary/70 text-white"
      default:
        return "bg-secondary text-foreground"
    }
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Leaderboard</h1>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search categories (Fashion, Tech, Food, Viral...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 rounded-full"
            />
          </div>
        </div>
        {/* Weekly Trending Remixes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-primary" />
              This Week's Trending Remixes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {weeklyTrendingRemixes.map((remix, index) => (
                <Card key={remix.id} className="overflow-hidden hover:shadow-xl transition-all group relative">
                  {index === 0 && (
                    <div className="absolute top-2 left-2 z-10">
                      <Badge className="bg-primary text-white">
                        #1 Trending
                      </Badge>
                    </div>
                  )}
                  <div className="relative overflow-hidden">
                    <img
                      src={remix.image}
                      alt={`${remix.brand} remix`}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white text-xs font-medium line-clamp-2 drop-shadow-lg">
                          "{remix.prompt}"
                        </p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">{remix.brand}</span>
                      <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                        {remix.growth}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">by {remix.username}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {remix.likes.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {remix.views.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Leaderboards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Category Leaderboards</h2>
          {filteredCategories.length === 0 ? (
            <Card className="p-12 text-center">
              <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No categories found</h3>
              <p className="text-muted-foreground">Try searching for a different category</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map((cat) => (
                <Card
                  key={cat.category}
                  className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 hover:border-primary"
                >
                  <CardContent className="p-6">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{cat.category}</h3>
                      <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{cat.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Top Creator</span>
                          <span className="font-semibold">{cat.topCreator}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Top Brand</span>
                          <span className="font-semibold">{cat.topBrand}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Total Remixes</span>
                          <span className="font-semibold">{cat.remixCount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Avg Engagement</span>
                          <span className="font-semibold">{cat.avgEngagement}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-4">
                        View Leaderboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Featured Creator of the Week */}
        <Card className="mb-8 overflow-hidden border-2 border-primary shadow-xl">
          <div className="gradient-primary px-6 py-4">
            <div className="flex items-center gap-2 text-white">
              <Star className="h-5 w-5 fill-white" />
              <h2 className="text-xl font-bold">Featured Creator of the Week</h2>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-[auto_1fr_auto] gap-6 items-center">
              {/* Avatar */}
              <Avatar className="h-24 w-24 ring-4 ring-primary">
                <AvatarImage src={featuredCreator.avatar} />
                <AvatarFallback className="text-2xl">SC</AvatarFallback>
              </Avatar>

              {/* Info */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold">{featuredCreator.name}</h3>
                  <Badge className="bg-primary text-white">
                    {featuredCreator.badge}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-3">{featuredCreator.username}</p>
                <p className="text-sm mb-4">{featuredCreator.bio}</p>
                <div className="flex gap-6 text-sm">
                  <div>
                    <div className="font-bold text-lg gradient-text">{featuredCreator.weeklyRemixes}</div>
                    <div className="text-muted-foreground">Remixes this week</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg gradient-text">{featuredCreator.weeklyLikes.toLocaleString()}</div>
                    <div className="text-muted-foreground">Likes this week</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg gradient-text">{featuredCreator.totalPoints.toLocaleString()}</div>
                    <div className="text-muted-foreground">Total Points</div>
                  </div>
                </div>
              </div>

              {/* Top Remix Preview */}
              <div className="relative group">
                <div className="w-48 h-48 rounded-xl overflow-hidden border-2 border-border">
                  <img
                    src={featuredCreator.topRemix.image}
                    alt="Top remix"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <Badge className="bg-background/90 backdrop-blur-sm text-foreground border-0 flex items-center gap-1 w-fit">
                    <Heart className="h-3 w-3 fill-primary text-primary" />
                    {featuredCreator.topRemix.likes.toLocaleString()}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overall Leaderboard */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Overall Leaderboard
          </h2>
          <p className="text-muted-foreground">Top creators across all brands and categories</p>
        </div>

        <Tabs defaultValue="creators" className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="bg-muted shadow-lg h-auto">
              <TabsTrigger
                value="creators"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Top Creators
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="creators" className="space-y-6">
            {/* Timeframe Filter */}
            <div className="flex justify-center gap-2">
              <Button
                variant={timeframe === "all-time" ? "default" : "outline"}
                onClick={() => setTimeframe("all-time")}
                className={timeframe === "all-time" ? "gradient-primary text-white" : "bg-transparent"}
              >
                All Time
              </Button>
              <Button
                variant={timeframe === "monthly" ? "default" : "outline"}
                onClick={() => setTimeframe("monthly")}
                className={timeframe === "monthly" ? "gradient-primary text-white" : "bg-transparent"}
              >
                This Month
              </Button>
              <Button
                variant={timeframe === "weekly" ? "default" : "outline"}
                onClick={() => setTimeframe("weekly")}
                className={timeframe === "weekly" ? "gradient-primary text-white" : "bg-transparent"}
              >
                This Week
              </Button>
            </div>

            {/* Top 3 Podium */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              {/* 2nd Place */}
              <Card className="md:mt-8 hover:shadow-xl transition-all">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">{getRankIcon(2)}</div>
                  <Avatar className="h-20 w-20 mx-auto mb-4 ring-4 ring-gray-400">
                    <AvatarImage src={topCreators[1].avatar || "/placeholder.svg"} />
                    <AvatarFallback>MJ</AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-lg mb-1">{topCreators[1].name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{topCreators[1].username}</p>
                  <Badge className={`${getBadgeColor(topCreators[1].badge)} mb-4`}>{topCreators[1].badge}</Badge>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Points</span>
                      <span className="font-semibold">{topCreators[1].points.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Remixes</span>
                      <span className="font-semibold">{topCreators[1].remixes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Wins</span>
                      <span className="font-semibold">{topCreators[1].wins}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 1st Place */}
              <Card className="hover:shadow-xl transition-all border-2 border-yellow-500">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">{getRankIcon(1)}</div>
                  <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-yellow-500">
                    <AvatarImage src={topCreators[0].avatar || "/placeholder.svg"} />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-xl mb-1">{topCreators[0].name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{topCreators[0].username}</p>
                  <Badge className={`${getBadgeColor(topCreators[0].badge)} mb-4`}>{topCreators[0].badge}</Badge>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Points</span>
                      <span className="font-semibold">{topCreators[0].points.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Remixes</span>
                      <span className="font-semibold">{topCreators[0].remixes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Wins</span>
                      <span className="font-semibold">{topCreators[0].wins}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 3rd Place */}
              <Card className="md:mt-8 hover:shadow-xl transition-all">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">{getRankIcon(3)}</div>
                  <Avatar className="h-20 w-20 mx-auto mb-4 ring-4 ring-amber-600">
                    <AvatarImage src={topCreators[2].avatar || "/placeholder.svg"} />
                    <AvatarFallback>ER</AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-lg mb-1">{topCreators[2].name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{topCreators[2].username}</p>
                  <Badge className={`${getBadgeColor(topCreators[2].badge)} mb-4`}>{topCreators[2].badge}</Badge>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Points</span>
                      <span className="font-semibold">{topCreators[2].points.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Remixes</span>
                      <span className="font-semibold">{topCreators[2].remixes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Wins</span>
                      <span className="font-semibold">{topCreators[2].wins}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rest of Rankings */}
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-0">
                {topCreators.slice(3).map((creator) => (
                  <div
                    key={creator.id}
                    className="flex items-center gap-4 p-4 border-b last:border-b-0 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="w-12 text-center">{getRankIcon(creator.rank)}</div>
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={creator.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{creator.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold">{creator.name}</h4>
                      <p className="text-sm text-muted-foreground">{creator.username}</p>
                    </div>
                    <Badge className={`${getBadgeColor(creator.badge)} hidden sm:inline-flex`}>{creator.badge}</Badge>
                    <div className="text-right">
                      <div className="font-bold">{creator.points.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{creator.remixes} remixes</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
