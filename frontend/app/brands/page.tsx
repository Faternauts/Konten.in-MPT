"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { BarChart3, TrendingUp, Users, Eye, Heart, Share2, Plus, Download, Calendar, DollarSign, MessageSquare, Sparkles, Upload, X, Search } from "lucide-react"
import { useState, useEffect } from "react"
import type { PromptAnalysis } from "@/lib/types"
import { getPromptsForCompany, getAdsForCompany } from "@/lib/supabase"
import { AnalyticsDashboard } from "./analytics-dashboard"
import { SignalExtraction } from "./signal-extraction"
import { setCampaignTracking, isCampaignTrackingEnabled, trackAdView } from "@/lib/conversion-tracking"

const campaignStats = {
  totalRemixes: 1204,
  totalViews: 1234567,
  totalEngagement: 89234,
  activeCampaigns: 3,
}

const campaigns = [
  {
    id: 1,
    name: "Summer Collection 2025",
    status: "active",
    image: "/nike-athletic-shoe-advertisement.jpg",
    remixes: 1247,
    views: 456789,
    engagement: 34567,
    budget: 5000,
    spent: 3200,
    endDate: "2025-03-15",
  },
  {
    id: 2,
    name: "Tech Innovation Series",
    status: "active",
    image: "/apple-iphone-product-advertisement.jpg",
    remixes: 2891,
    views: 678901,
    engagement: 45678,
    budget: 8000,
    spent: 5400,
    endDate: "2025-03-20",
  },
  {
    id: 3,
    name: "Holiday Special",
    status: "completed",
    image: "/coca-cola-super-bowl-commercial.jpg",
    remixes: 1202,
    views: 890123,
    engagement: 56789,
    budget: 10000,
    spent: 10000,
    endDate: "2025-02-28",
  },
]

const mockTopRemixes = [
  {
    id: 1,
    creator: "Sarah Chen",
    image: "/nike-athletic-shoe-advertisement.jpg",
    likes: 8234,
    views: 45230,
    campaign: "Summer Collection 2025",
  },
  {
    id: 2,
    creator: "Marcus Johnson",
    image: "/apple-iphone-product-advertisement.jpg",
    likes: 7891,
    views: 42100,
    campaign: "Tech Innovation Series",
  },
  {
    id: 3,
    creator: "Emma Rodriguez",
    image: "/coca-cola-super-bowl-commercial.jpg",
    likes: 7456,
    views: 39870,
    campaign: "Holiday Special",
  },
]

// Available brands for competitor selection
const availableBrands = [
  "Nike", "Apple", "Coca-Cola", "Tesla", "McDonald's", "Spotify",
  "Adidas", "Amazon", "Pepsi", "Samsung", "Google", "Microsoft",
  "Target", "Walmart", "Best Buy", "Netflix", "Uber", "Airbnb"
];

export default function BrandDashboard() {
  const [promptAnalysis, setPromptAnalysis] = useState<PromptAnalysis | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [topRemixes, setTopRemixes] = useState<any[]>(mockTopRemixes);
  const [isLoadingTopRemixes, setIsLoadingTopRemixes] = useState(true);
  const [competitors, setCompetitors] = useState([
    { brand: "Competitor A", score: 78, engagement: "Medium", color: "bg-blue-500" },
    { brand: "Competitor B", score: 65, engagement: "Medium", color: "bg-purple-500" },
    { brand: "Competitor C", score: 54, engagement: "Low", color: "bg-gray-500" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddCompetitor, setShowAddCompetitor] = useState(false);
  const [editingCompetitor, setEditingCompetitor] = useState<number | null>(null);
  const [lettaAnalytics, setLettaAnalytics] = useState<any>(null);
  const [isLoadingLetta, setIsLoadingLetta] = useState(false);
  const [currentTab, setCurrentTab] = useState("campaigns");
  const [campaignViewModes, setCampaignViewModes] = useState<Record<number, 'reach' | 'conversion'>>({});

  // Function to fetch and analyze prompts
  const fetchAndAnalyzePrompts = async () => {
    setIsLoadingAnalysis(true);
    try {
      console.log('Fetching Nike prompts for analysis...');
      const promptsData = await getPromptsForCompany("Nike");

      // Extract just the content for analysis
      const prompts = promptsData.map(p => p.content);

      // If no prompts from Supabase, use Nike-specific mock data
      const promptsToAnalyze = prompts.length > 0 ? prompts : [
        "Add dynamic motion blur to the Nike shoes",
        "Make the swoosh logo glow with neon energy",
        "Transform the background into an urban basketball court",
        "Add futuristic athletic performance stats overlay",
        "Create a street art style with graffiti elements"
      ];

      console.log(`Analyzing ${promptsToAnalyze.length} prompts...`);

      // Analyze the prompts
      const response = await fetch('/api/analyze-prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompts: promptsToAnalyze })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze prompts');
      }

      const data = await response.json();
      console.log('Analysis complete:', data);
      setPromptAnalysis(data);
    } catch (error) {
      console.warn('Using fallback prompt analysis data (API unavailable):', error);
      // Set some default analysis data if the API fails
      setPromptAnalysis({
        themes: ["Athletic", "Urban", "Dynamic", "Modern", "Performance"],
        emotionalTone: "Energetic and aspirational, focusing on athletic achievement and urban style",
        styleReferences: ["Street Art", "Modern Athletic", "Urban Fashion", "Tech-Minimal"],
        intent: "Users aim to enhance Nike's athletic imagery with modern, urban aesthetics while maintaining brand recognition"
      });
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setCurrentTab(value);

    // Re-run prompt analysis when analytics or signals tab is opened
    if (value === "analytics" || value === "signals") {
      console.log(`${value} tab opened - refreshing prompt analysis`);
      fetchAndAnalyzePrompts();
    }
  };

  // Fetch Letta analytics data
  useEffect(() => {
    async function fetchLettaAnalytics() {
      setIsLoadingLetta(true);
      try {
        const response = await fetch('/api/letta-analytics');
        const data = await response.json();

        if (response.ok) {
          setLettaAnalytics(data);
          // Update competitors with Letta data if available
          if (data.competitors) {
            setCompetitors(data.competitors);
          }
        } else {
          console.error('Failed to fetch Letta analytics:', data.error);
        }
      } catch (error) {
        console.error('Error fetching Letta analytics:', error);
      } finally {
        setIsLoadingLetta(false);
      }
    }

    fetchLettaAnalytics();
  }, []);

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoadingData(true);

      try {
        // Get Nike's ads from Supabase
        const adsData = await getAdsForCompany("Nike"); // Optimized single query

        // Transform ads data to campaigns format
        const transformedCampaigns = adsData.map(ad => ({
          id: ad.id,
          name: ad.title,
          status: 'active' as const,
          image: ad.image_url || "/nike-athletic-shoe-advertisement.jpg", // Default Nike image
          remixes: Math.floor(Math.random() * 1000) + 100, // Temporary random data
          views: Math.floor(Math.random() * 100000) + 10000, // Temporary random data
          engagement: Math.floor(Math.random() * 10000) + 1000, // Temporary random data
          budget: 5000,
          spent: Math.floor(Math.random() * 5000),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        }));

        setCampaigns(transformedCampaigns);

        // Get Nike's prompts for top remixes
        const promptsData = await getPromptsForCompany("Nike"); // Optimized single query

        // Transform prompts to top remixes format and sort by random likes (until likes field is added)
        if (promptsData.length > 0) {
          const transformedRemixes = promptsData
            .map((prompt: any) => {
              const adImage = prompt.ads?.image_url || "/nike-athletic-shoe-advertisement.jpg";
              const adTitle = prompt.ads?.title || "Nike Campaign";
              // Generate random likes for now (replace with real likes when field is added)
              const likes = Math.floor(Math.random() * 10000) + 1000;

              return {
                id: prompt.id,
                creator: `User ${prompt.user_id?.slice(0, 8)}` || "Anonymous",
                image: adImage,
                likes: likes,
                views: likes * 5, // Estimate views based on likes
                campaign: adTitle,
                prompt: prompt.content,
              };
            })
            .sort((a: any, b: any) => b.likes - a.likes) // Sort by highest likes first
            .slice(0, 6); // Show top 6 remixes

          setTopRemixes(transformedRemixes);
        }
        setIsLoadingTopRemixes(false);

        // Run initial prompt analysis
        await fetchAndAnalyzePrompts();
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoadingData(false);
      }
    }

    fetchDashboardData();
  }, []);

  const handleAddCompetitor = (brandName: string) => {
    const newCompetitor = {
      brand: brandName,
      score: Math.floor(Math.random() * 40) + 50, // Random score between 50-90
      engagement: Math.random() > 0.5 ? "Medium" : "Low",
      color: `bg-${['blue', 'purple', 'green', 'orange', 'pink'][Math.floor(Math.random() * 5)]}-500`
    };
    setCompetitors([...competitors, newCompetitor]);
    setShowAddCompetitor(false);
    setSearchQuery("");
  };

  const handleRemoveCompetitor = (index: number) => {
    setCompetitors(competitors.filter((_, i) => i !== index));
  };

  const handleUpdateCompetitor = (index: number, brandName: string) => {
    const updatedCompetitors = [...competitors];
    updatedCompetitors[index] = {
      ...updatedCompetitors[index],
      brand: brandName
    };
    setCompetitors(updatedCompetitors);
    setEditingCompetitor(null);
    setSearchQuery("");
  };

  const filteredBrands = availableBrands.filter(brand =>
    brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCampaignViewMode = (campaignId: number) => {
    const newMode = campaignViewModes[campaignId] === 'conversion' ? 'reach' : 'conversion';
    const trackingEnabled = newMode === 'conversion';

    setCampaignViewModes(prev => ({
      ...prev,
      [campaignId]: newMode
    }));

    // Enable/disable Conversion tracking for this campaign
    setCampaignTracking(campaignId.toString(), trackingEnabled);

    console.log(`Conversion tracking ${trackingEnabled ? 'enabled' : 'disabled'} for campaign ${campaignId}`);
  };

  const getCampaignViewMode = (campaignId: number): 'reach' | 'conversion' => {
    return campaignViewModes[campaignId] || 'reach';
  };

  // Track campaign views when they're loaded and tracking is enabled
  useEffect(() => {
    if (campaigns.length > 0 && currentTab === 'campaigns') {
      campaigns.forEach(campaign => {
        if (isCampaignTrackingEnabled(campaign.id.toString())) {
          trackAdView(
            campaign.id.toString(),
            campaign.name,
            undefined, // userId - can be added if you have user authentication
            campaign.id.toString()
          );
        }
      });
    }
  }, [campaigns, currentTab]);

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <section className="relative py-16 px-4 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-primary/5 to-background">
          {/* Small scattered circles with different pulse timings */}
          <div className="absolute top-[10%] left-[15%] w-[150px] h-[150px] bg-primary/60 rounded-full blur-[60px] animate-float-1" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-[25%] right-[20%] w-[120px] h-[120px] bg-primary/55 rounded-full blur-[50px] animate-float-2" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute bottom-[30%] left-[10%] w-[180px] h-[180px] bg-primary/65 rounded-full blur-[70px] animate-float-3" style={{ animationDelay: '0.6s' }}></div>
          <div className="absolute top-[40%] left-[45%] w-[140px] h-[140px] bg-primary/50 rounded-full blur-[55px] animate-float-4" style={{ animationDelay: '0.9s' }}></div>
          <div className="absolute bottom-[20%] right-[15%] w-[160px] h-[160px] bg-primary/58 rounded-full blur-[65px] animate-float-1" style={{ animationDelay: '1.2s' }}></div>
          <div className="absolute top-[60%] right-[40%] w-[130px] h-[130px] bg-primary/52 rounded-full blur-[58px] animate-float-2" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-[15%] left-[60%] w-[145px] h-[145px] bg-primary/62 rounded-full blur-[62px] animate-float-3" style={{ animationDelay: '1.8s' }}></div>
          <div className="absolute bottom-[40%] right-[35%] w-[125px] h-[125px] bg-primary/48 rounded-full blur-[52px] animate-float-4" style={{ animationDelay: '2.1s' }}></div>
          <div className="absolute top-[70%] left-[30%] w-[170px] h-[170px] bg-primary/56 rounded-full blur-[68px] animate-float-1" style={{ animationDelay: '0.4s' }}></div>
          <div className="absolute bottom-[15%] left-[55%] w-[135px] h-[135px] bg-primary/54 rounded-full blur-[60px] animate-float-2" style={{ animationDelay: '0.7s' }}></div>
          <div className="absolute top-[35%] right-[10%] w-[155px] h-[155px] bg-primary/60 rounded-full blur-[64px] animate-float-3" style={{ animationDelay: '1.0s' }}></div>
          <div className="absolute bottom-[50%] left-[75%] w-[142px] h-[142px] bg-primary/51 rounded-full blur-[56px] animate-float-4" style={{ animationDelay: '1.3s' }}></div>
          <div className="absolute top-[50%] left-[5%] w-[165px] h-[165px] bg-primary/57 rounded-full blur-[66px] animate-float-1" style={{ animationDelay: '1.6s' }}></div>
          <div className="absolute bottom-[10%] right-[50%] w-[138px] h-[138px] bg-primary/53 rounded-full blur-[59px] animate-float-2" style={{ animationDelay: '1.9s' }}></div>
          <div className="absolute top-[80%] right-[25%] w-[148px] h-[148px] bg-primary/59 rounded-full blur-[63px] animate-float-3" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute top-[20%] left-[85%] w-[128px] h-[128px] bg-primary/49 rounded-full blur-[54px] animate-float-4" style={{ animationDelay: '0.5s' }}></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Brand Dashboard</h1>
              <p className="text-lg text-muted-foreground">Manage campaigns and predict ad performance</p>
            </div>
            <Button size="lg" className="bg-primary text-white hover:bg-primary/90 font-semibold">
              <Plus className="mr-2 h-5 w-5" />
              New Campaign
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 mt-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Remixes</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{campaignStats.totalRemixes.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+12.5%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{campaignStats.totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+18.2%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Engagement</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{campaignStats.totalEngagement.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+24.7%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Campaigns</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{campaignStats.activeCampaigns}</div>
              <p className="text-xs text-muted-foreground mt-1">2 ending this month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="campaigns" className="w-full" value={currentTab} onValueChange={handleTabChange}>
          <TabsList className="mb-6 bg-muted h-auto">
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="top-remixes" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Top Remixes
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="signals" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Signal Intelligence
            </TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-6">
            {isLoadingData ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted rounded-lg h-48"></div>
                  </div>
                ))}
              </div>
            ) : campaigns.length > 0 ? (
              campaigns.map((campaign) => {
                const viewMode = getCampaignViewMode(campaign.id);
                const isConversionMode = viewMode === 'conversion';

                return (
              <Card key={campaign.id} className="overflow-hidden hover:shadow-xl transition-all">
                <div className="grid md:grid-cols-[200px_1fr] gap-6">
                  <div className="relative h-48 md:h-auto">
                    <img
                      src={campaign.image || "/placeholder.svg"}
                      alt={campaign.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{campaign.name}</h3>
                        <Badge
                          variant={campaign.status === "active" ? "default" : "secondary"}
                          className={campaign.status === "active" ? "gradient-primary text-white" : ""}
                        >
                          {campaign.status === "active" ? "Active" : "Completed"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            Reach Out via Conversion
                          </span>
                          <button
                            onClick={() => toggleCampaignViewMode(campaign.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              isConversionMode ? "bg-purple-600" : "bg-slate-300 dark:bg-slate-600"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                isConversionMode ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Remixes</div>
                        <div className="text-2xl font-bold">{campaign.remixes.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Views</div>
                        <div className="text-2xl font-bold">{campaign.views.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Engagement</div>
                        <div className="text-2xl font-bold">{campaign.engagement.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          End Date
                        </div>
                        <div className="text-sm font-semibold">{campaign.endDate}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          Budget
                        </span>
                        <span className="font-semibold">
                          ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="gradient-primary h-2 rounded-full transition-all"
                          style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-muted-foreground">
                    <Upload className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No campaigns yet</p>
                    <p className="text-sm">Upload your first advertisement to get started</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="top-remixes" className="space-y-6">
            {isLoadingTopRemixes ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted rounded-lg h-80"></div>
                  </div>
                ))}
              </div>
            ) : topRemixes.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topRemixes.map((remix) => (
                  <Card key={remix.id} className="overflow-hidden hover:shadow-xl transition-all group">
                    <div className="relative overflow-hidden">
                      <img
                        src={remix.image || "/placeholder.svg"}
                        alt={`Remix by ${remix.creator}`}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="mb-2">
                        <div className="font-semibold mb-1">{remix.creator}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">{remix.campaign}</div>
                        {remix.prompt && (
                          <div className="text-xs text-muted-foreground italic mt-1 line-clamp-2">
                            "{remix.prompt}"
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4 text-muted-foreground" />
                          {remix.likes.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          {remix.views.toLocaleString()}
                        </span>
                        <Button variant="ghost" size="sm" className="ml-auto p-0 h-auto">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-muted-foreground">
                    <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No remixes yet</p>
                    <p className="text-sm">Nike prompts will appear here once users start remixing</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard
              lettaAnalytics={lettaAnalytics}
              isLoadingLetta={isLoadingLetta}
              promptAnalysis={promptAnalysis}
              isLoadingAnalysis={isLoadingAnalysis}
              campaigns={campaigns}
            />
          </TabsContent>

          <TabsContent value="signals" className="space-y-6">
            <SignalExtraction
              promptAnalysis={promptAnalysis}
              lettaAnalytics={lettaAnalytics}
              campaigns={campaigns}
              isLoadingAnalysis={isLoadingAnalysis}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
