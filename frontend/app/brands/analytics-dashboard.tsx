"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp, TrendingDown, Users, Eye, Heart, Share2, Sparkles,
  MessageSquare, BarChart3, DollarSign, Target, Zap, Calendar
} from "lucide-react"

interface AnalyticsDashboardProps {
  lettaAnalytics: any
  isLoadingLetta: boolean
  promptAnalysis: any
  isLoadingAnalysis: boolean
  campaigns: any[]
}

export function AnalyticsDashboard({
  lettaAnalytics,
  isLoadingLetta,
  promptAnalysis,
  isLoadingAnalysis,
  campaigns
}: AnalyticsDashboardProps) {
  // Mock data for comprehensive analytics
  const performanceMetrics = {
    totalSpend: 24985,
    totalRevenue: 89234,
    roi: 257,
    conversionRate: 12.4,
    avgEngagementRate: 8.3,
    totalReach: 1234567,
    totalImpressions: 3456789,
    avgCPC: 1.24
  }

  const topAds = [
    { name: "Summer Collection Hero", spend: 8430, revenue: 30285, roi: 259, status: "active", color: "bg-purple-100 dark:bg-purple-900/20" },
    { name: "Tech Innovation Video", spend: 6540, revenue: 23400, roi: 258, status: "active", color: "bg-blue-100 dark:bg-blue-900/20" },
    { name: "Holiday Special Banner", spend: 5430, revenue: 19845, roi: 265, status: "active", color: "bg-pink-100 dark:bg-pink-900/20" },
    { name: "Product Launch Teaser", spend: 2985, revenue: 8976, roi: 201, status: "active", color: "bg-yellow-100 dark:bg-yellow-900/20" },
    { name: "Brand Story Series", spend: 1600, revenue: 6728, roi: 320, status: "active", color: "bg-green-100 dark:bg-green-900/20" }
  ]

  const engagementTrends = [
    { date: "Week 1", engagement: 7.2, reach: 89000, conversions: 1120 },
    { date: "Week 2", engagement: 8.1, reach: 124000, conversions: 1540 },
    { date: "Week 3", engagement: 7.8, reach: 145000, conversions: 1820 },
    { date: "Week 4", engagement: 8.9, reach: 198000, conversions: 2450 },
    { date: "Week 5", engagement: 9.2, reach: 234000, conversions: 2880 },
    { date: "Week 6", engagement: 8.6, reach: 212000, conversions: 2650 }
  ]

  const audienceInsights = [
    { segment: "High Intent Shoppers", percentage: 34, color: "bg-slate-700 dark:bg-slate-400" },
    { segment: "Brand Enthusiasts", percentage: 28, color: "bg-purple-600 dark:bg-purple-500" },
    { segment: "Price Sensitive", percentage: 22, color: "bg-slate-500" },
    { segment: "New Visitors", percentage: 16, color: "bg-slate-400 dark:bg-slate-600" }
  ]

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Campaigns */}
        <Card className="bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              <span>Total Campaigns</span>
              <Target className="h-4 w-4 text-slate-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{campaigns.length}</div>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <TrendingUp className="h-3 w-3 text-purple-600 dark:text-purple-400" />
              <span className="text-purple-600 dark:text-purple-400 font-medium">+12.5%</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Spend */}
        <Card className="bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              <span>Total Ad Spend</span>
              <DollarSign className="h-4 w-4 text-slate-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${performanceMetrics.totalSpend.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <TrendingUp className="h-3 w-3 text-purple-600 dark:text-purple-400" />
              <span className="text-purple-600 dark:text-purple-400 font-medium">+18.2%</span>
              <span className="text-muted-foreground">efficient spending</span>
            </div>
          </CardContent>
        </Card>

        {/* ROI */}
        <Card className="bg-purple-50 dark:bg-purple-950/10 border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              <span>Average ROI</span>
              <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700 dark:text-purple-400">{performanceMetrics.roi}%</div>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <TrendingUp className="h-3 w-3 text-purple-600 dark:text-purple-400" />
              <span className="text-purple-600 dark:text-purple-400 font-medium">+24.7%</span>
              <span className="text-muted-foreground">above industry avg</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Reach */}
        <Card className="bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              <span>Total Reach</span>
              <Eye className="h-4 w-4 text-slate-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{(performanceMetrics.totalReach / 1000000).toFixed(2)}M</div>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <TrendingUp className="h-3 w-3 text-purple-600 dark:text-purple-400" />
              <span className="text-purple-600 dark:text-purple-400 font-medium">+32.1%</span>
              <span className="text-muted-foreground">audience growth</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Performing Ads */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Top 5 Ads by Performance
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Powered by Letta
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topAds.map((ad, index) => (
                  <div key={index} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold">{ad.name}</div>
                          <Badge variant="secondary" className="mt-1 text-xs">{ad.status}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{ad.roi}%</div>
                        <div className="text-xs text-muted-foreground">ROI</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                      <div>
                        <div className="text-muted-foreground text-xs">Spend</div>
                        <div className="font-semibold">${ad.spend.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs">Revenue</div>
                        <div className="font-semibold text-green-600 dark:text-green-400">${ad.revenue.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Engagement Trends Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Engagement & Performance Trends
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  Last 6 weeks
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/20 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="text-2xl font-bold">
                      {performanceMetrics.avgEngagementRate}%
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Avg Engagement</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/10 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                      {(performanceMetrics.totalReach / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Avg Weekly Reach</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/20 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="text-2xl font-bold">
                      {performanceMetrics.conversionRate}%
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Conversion Rate</div>
                  </div>
                </div>

                {/* Trend visualization */}
                <div className="space-y-3">
                  {engagementTrends.map((trend, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-20 text-sm text-muted-foreground">{trend.date}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-purple-600 dark:bg-purple-500 rounded-full transition-all"
                              style={{ width: `${(trend.engagement / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold w-12 text-right">{trend.engagement}%</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {(trend.reach / 1000).toFixed(0)}K
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {trend.conversions} conv.
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Sentiment Analysis */}
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Sentiment Analysis</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Letta
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">Campaign reception</div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingLetta ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-8 bg-muted rounded"></div>
                  <div className="h-8 bg-muted rounded"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                        Positive
                      </span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        {lettaAnalytics?.sentiment?.positive ?? 68}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3">
                      <div className="bg-slate-700 dark:bg-slate-400 h-3 rounded-full transition-all" style={{ width: `${lettaAnalytics?.sentiment?.positive ?? 68}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                        Neutral
                      </span>
                      <span className="text-lg font-bold text-gray-600 dark:text-gray-400">
                        {lettaAnalytics?.sentiment?.neutral ?? 24}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3">
                      <div className="bg-gray-400 h-3 rounded-full transition-all" style={{ width: `${lettaAnalytics?.sentiment?.neutral ?? 24}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                        Negative
                      </span>
                      <span className="text-lg font-bold text-red-600 dark:text-red-400">
                        {lettaAnalytics?.sentiment?.negative ?? 8}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3">
                      <div className="bg-purple-600 dark:bg-purple-500 h-3 rounded-full transition-all" style={{ width: `${lettaAnalytics?.sentiment?.negative ?? 8}%` }}></div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Audience Segments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Audience Segments</CardTitle>
                <Badge variant="outline" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Letta
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {audienceInsights.map((segment, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{segment.segment}</span>
                      <span className="text-sm font-bold">{segment.percentage}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2.5">
                      <div className={`${segment.color} h-2.5 rounded-full transition-all`} style={{ width: `${segment.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/20 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium">Engagement Rate</span>
                </div>
                <span className="font-bold">{performanceMetrics.avgEngagementRate}%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950/10 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium">Share Rate</span>
                </div>
                <span className="font-bold text-purple-700 dark:text-purple-400">4.2%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/20 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium">Conversion Rate</span>
                </div>
                <span className="font-bold">{performanceMetrics.conversionRate}%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/20 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium">Avg CPC</span>
                </div>
                <span className="font-bold">${performanceMetrics.avgCPC}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Demographics & Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demographics */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Audience Demographics
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                Powered by Letta
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingLetta ? (
              <div className="animate-pulse grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Age Groups</h4>
                  <div className="space-y-2">
                    {(lettaAnalytics?.demographics?.ageGroups ?? [
                      { range: "18-24", percentage: 35 },
                      { range: "25-34", percentage: 42 },
                      { range: "35-44", percentage: 18 },
                      { range: "45+", percentage: 5 },
                    ]).map((age: any) => (
                    <div key={age.range}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>{age.range}</span>
                        <span className="font-semibold">{age.percentage}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-slate-700 dark:bg-slate-400 h-2 rounded-full" style={{ width: `${age.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Gender</h4>
                  <div className="space-y-2">
                    {(lettaAnalytics?.demographics?.gender ?? [
                      { gender: "Female", percentage: 52 },
                      { gender: "Male", percentage: 46 },
                      { gender: "Other", percentage: 2 },
                    ]).map((item: any) => (
                    <div key={item.gender}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>{item.gender}</span>
                        <span className="font-semibold">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-purple-600 dark:bg-purple-500 h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Top Locations</h4>
                  <div className="space-y-2">
                    {(lettaAnalytics?.demographics?.locations ?? [
                      { location: "United States", percentage: 45 },
                      { location: "United Kingdom", percentage: 22 },
                      { location: "Canada", percentage: 15 },
                      { location: "Australia", percentage: 10 },
                    ]).map((loc: any) => (
                    <div key={loc.location} className="flex items-center justify-between text-sm">
                      <span className="text-xs">{loc.location}</span>
                      <span className="font-semibold">{loc.percentage}%</span>
                    </div>
                  ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prompt Analysis */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Creative Insights
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                Powered by Claude
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Common Themes
                </h4>
                {isLoadingAnalysis ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-6 bg-muted rounded w-full" />
                  </div>
                ) : promptAnalysis ? (
                  <div className="flex flex-wrap gap-2">
                    {promptAnalysis.themes.map((theme: string) => (
                      <Badge key={theme} variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No analysis available</p>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Emotional Tone</h4>
                {isLoadingAnalysis ? (
                  <div className="animate-pulse h-4 bg-muted rounded w-full" />
                ) : promptAnalysis ? (
                  <p className="text-sm bg-slate-50 dark:bg-slate-900/20 p-3 rounded-lg border border-slate-200 dark:border-slate-800">{promptAnalysis.emotionalTone}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">No analysis available</p>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">User Intent</h4>
                {isLoadingAnalysis ? (
                  <div className="animate-pulse h-4 bg-muted rounded w-full" />
                ) : promptAnalysis ? (
                  <p className="text-sm bg-purple-50 dark:bg-purple-950/10 p-3 rounded-lg border border-purple-200 dark:border-purple-800">{promptAnalysis.intent}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">No analysis available</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
