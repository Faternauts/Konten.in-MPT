"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Clock, Users, DollarSign, Calendar } from "lucide-react"

const activeChallenges = [
  {
    id: 1,
    title: "Super Bowl LVIII Remix Challenge",
    brand: "Pepsi",
    image: "/pepsi-super-bowl-halftime-show-ad.jpg",
    prize: "$10,000",
    participants: 1247,
    submissions: 3456,
    endDate: "2025-03-15",
    daysLeft: 12,
    category: "Super Bowl",
    description: "Create the best remix of the iconic Super Bowl halftime show ad and compete for the grand prize",
    isEntered: true,
    myRank: 45,
  },
  {
    id: 2,
    title: "Tech Innovation Showcase",
    brand: "Apple",
    image: "/apple-iphone-product-advertisement.jpg",
    prize: "$5,000",
    participants: 892,
    submissions: 2134,
    endDate: "2025-03-20",
    daysLeft: 17,
    category: "Tech",
    description: "Submit your vision of Apple's future tech - top submission wins",
    isEntered: false,
  },
  {
    id: 3,
    title: "Sustainable Fashion Forward",
    brand: "Nike",
    image: "/nike-athletic-shoe-advertisement.jpg",
    prize: "$7,500",
    participants: 1089,
    submissions: 2891,
    endDate: "2025-03-25",
    daysLeft: 22,
    category: "Fashion",
    description: "Compete to create the most impactful sustainability message for Nike",
    isEntered: true,
    myRank: 12,
  },
  {
    id: 4,
    title: "Fast Food Frenzy",
    brand: "McDonald's",
    image: "/mcdonalds-burger-advertisement.jpg",
    prize: "$3,500",
    participants: 654,
    submissions: 1567,
    endDate: "2025-03-18",
    daysLeft: 15,
    category: "Food",
    description: "Create a mouth-watering remix that makes people crave fast food",
    isEntered: false,
  },
  {
    id: 5,
    title: "Electric Dreams",
    brand: "Tesla",
    image: "/tesla-electric-car-advertisement.jpg",
    prize: "$6,000",
    participants: 823,
    submissions: 1893,
    endDate: "2025-03-22",
    daysLeft: 19,
    category: "Tech",
    description: "Show the future of electric vehicles in your unique style",
    isEntered: false,
  },
]

const upcomingChallenges = [
  {
    id: 4,
    title: "Summer Vibes Campaign",
    brand: "Coca-Cola",
    image: "/coca-cola-super-bowl-commercial.jpg",
    prize: "$8,000",
    startDate: "2025-03-18",
    category: "Viral",
  },
  {
    id: 5,
    title: "Electric Future",
    brand: "Tesla",
    image: "/tesla-electric-car-advertisement.jpg",
    prize: "$12,000",
    startDate: "2025-03-22",
    category: "Tech",
  },
]

const pastWinners = [
  {
    id: 1,
    challenge: "Holiday Magic 2024",
    winner: "Sarah Chen",
    prize: "$10,000",
    image: "/nike-athletic-shoe-advertisement.jpg",
    votes: 8234,
  },
  {
    id: 2,
    challenge: "New Year Revolution",
    winner: "Marcus Johnson",
    prize: "$7,500",
    image: "/apple-iphone-product-advertisement.jpg",
    votes: 7891,
  },
]

export default function ChallengesPage() {
  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 h-24 flex items-center">
          <h1 className="text-3xl font-bold">Challenges</h1>
        </div>
      </div>

      {/* Content */}
      <div className="w-full pt-4">
        <Tabs defaultValue="active" className="w-full">
          <div className="border-b bg-background sticky top-16 z-40">
            <div className="container mx-auto px-4">
              <TabsList className="bg-transparent h-auto w-full justify-start rounded-none border-0 p-0">
                <TabsTrigger
                  value="active"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent data-[state=active]:text-purple-600 px-6 py-2"
                >
                  Active Challenges
                </TabsTrigger>
                <TabsTrigger
                  value="upcoming"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent data-[state=active]:text-purple-600 px-6 py-2"
                >
                  Upcoming
                </TabsTrigger>
                <TabsTrigger
                  value="winners"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent data-[state=active]:text-purple-600 px-6 py-2"
                >
                  Past Winners
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <div className="container mx-auto px-4 mt-8">

          <TabsContent value="active" className="space-y-8">
            {/* My Challenges Section */}
            {activeChallenges.filter(c => c.isEntered).length > 0 && (
              <div>
                <div className="mb-4">
                  <h2 className="text-2xl font-bold">My Challenges</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeChallenges.filter(c => c.isEntered).map((challenge) => (
                    <Card key={challenge.id} className="overflow-hidden hover:shadow-xl transition-all group flex flex-col border-2 border-primary/20">
                      <div className="relative overflow-hidden">
                        <img
                          src={challenge.image || "/placeholder.svg"}
                          alt={challenge.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-background/90 backdrop-blur-sm text-foreground border-0">
                            {challenge.category}
                          </Badge>
                        </div>
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-primary text-white border-0">
                            Entered
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-5 flex flex-col flex-1">
                        <div className="mb-3 min-h-[60px]">
                          <h3 className="font-bold text-lg mb-1 text-balance">{challenge.title}</h3>
                          <p className="text-sm text-muted-foreground">by {challenge.brand}</p>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[40px]">{challenge.description}</p>

                        <div className="space-y-3 mb-4">
                          {challenge.myRank && (
                            <div className="flex items-center justify-between text-sm bg-primary/10 rounded-lg p-3">
                              <span className="flex items-center gap-1 font-semibold text-primary">
                                <Trophy className="h-4 w-4" />
                                Your Rank
                              </span>
                              <span className="font-bold text-lg text-primary">#{challenge.myRank}</span>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <DollarSign className="h-4 w-4" />
                              Prize Pool
                            </span>
                            <span className="font-bold text-lg gradient-text">{challenge.prize}</span>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Users className="h-4 w-4" />
                              Participants
                            </span>
                            <span className="font-semibold">{challenge.participants.toLocaleString()}</span>
                          </div>

                          <div className="pt-2">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                Time Left
                              </span>
                              <span className="font-semibold">{challenge.daysLeft} days</span>
                            </div>
                            <Progress value={(challenge.daysLeft / 30) * 100} className="h-2" />
                          </div>
                        </div>

                        <Button className="w-full bg-primary text-white font-semibold hover:bg-primary/90">
                          View My Submission
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Available Challenges Section */}
            {activeChallenges.filter(c => !c.isEntered).length > 0 && (
              <div>
                <div className="mb-4">
                  <h2 className="text-2xl font-bold">Available Challenges</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeChallenges.filter(c => !c.isEntered).map((challenge) => (
                    <Card key={challenge.id} className="overflow-hidden hover:shadow-xl transition-all group flex flex-col">
                      <div className="relative overflow-hidden">
                        <img
                          src={challenge.image || "/placeholder.svg"}
                          alt={challenge.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-background/90 backdrop-blur-sm text-foreground border-0">
                            {challenge.category}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-5 flex flex-col flex-1">
                        <div className="mb-3 min-h-[60px]">
                          <h3 className="font-bold text-lg mb-1 text-balance">{challenge.title}</h3>
                          <p className="text-sm text-muted-foreground">by {challenge.brand}</p>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[40px]">{challenge.description}</p>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <DollarSign className="h-4 w-4" />
                              Prize Pool
                            </span>
                            <span className="font-bold text-lg gradient-text">{challenge.prize}</span>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Users className="h-4 w-4" />
                              Participants
                            </span>
                            <span className="font-semibold">{challenge.participants.toLocaleString()}</span>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Trophy className="h-4 w-4" />
                              Submissions
                            </span>
                            <span className="font-semibold">{challenge.submissions.toLocaleString()}</span>
                          </div>

                          <div className="pt-2">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                Time Left
                              </span>
                              <span className="font-semibold">{challenge.daysLeft} days</span>
                            </div>
                            <Progress value={(challenge.daysLeft / 30) * 100} className="h-2" />
                          </div>
                        </div>

                        <Button className="w-full gradient-primary text-white font-semibold">Enter Challenge</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {upcomingChallenges.map((challenge) => (
                <Card key={challenge.id} className="overflow-hidden hover:shadow-xl transition-all">
                  <div className="relative overflow-hidden">
                    <img
                      src={challenge.image || "/placeholder.svg"}
                      alt={challenge.title}
                      className="w-full h-48 object-cover opacity-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <Badge className="bg-white/90 text-foreground mb-2">{challenge.category}</Badge>
                      <h3 className="font-bold text-xl text-white mb-1">{challenge.title}</h3>
                      <p className="text-sm text-white/90">by {challenge.brand}</p>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Starts {challenge.startDate}
                      </div>
                      <div className="font-bold text-lg gradient-text">{challenge.prize}</div>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent">
                      Set Reminder
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="winners" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {pastWinners.map((winner) => (
                <Card key={winner.id} className="overflow-hidden hover:shadow-xl transition-all">
                  <div className="relative overflow-hidden">
                    <img
                      src={winner.image || "/placeholder.svg"}
                      alt={winner.challenge}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-purple-600 text-white border-0 flex items-center gap-1">
                        <Trophy className="h-3 w-3" />
                        Winner
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg mb-1">{winner.challenge}</h3>
                    <p className="text-sm text-muted-foreground mb-3">Winner: {winner.winner}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg gradient-text">{winner.prize}</span>
                      <span className="text-sm text-muted-foreground">{winner.votes.toLocaleString()} votes</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
