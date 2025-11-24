"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingUp, TrendingDown, AlertCircle, Brain,
  Target, Users, Eye, Heart, MessageSquare, ArrowRight,
  Clock, Award, Activity
} from "lucide-react"

interface SignalExtractionProps {
  promptAnalysis: any
  lettaAnalytics: any
  campaigns: any[]
  isLoadingAnalysis: boolean
}

export function SignalExtraction({
  promptAnalysis,
  lettaAnalytics,
  campaigns,
  isLoadingAnalysis
}: SignalExtractionProps) {
  // Extracted signals from user behavior
  const creativeIntentSignals = [
    {
      signal: "High Demand for Urban Aesthetics",
      confidence: 94,
      source: "Prompt Analysis",
      trend: "up",
      impact: "high",
      frequency: 847,
      description: "Users consistently request urban, street-style modifications"
    },
    {
      signal: "Neon/Glow Effects Trending",
      confidence: 89,
      source: "Style Detection",
      trend: "up",
      impact: "high",
      frequency: 623,
      description: "34% increase in neon and glow-related prompts this week"
    },
    {
      signal: "Motion Blur Preference",
      confidence: 76,
      source: "Visual Analysis",
      trend: "stable",
      impact: "medium",
      frequency: 412,
      description: "Users prefer dynamic, action-oriented imagery"
    },
    {
      signal: "Minimalist Backgrounds",
      confidence: 82,
      source: "Composition Analysis",
      trend: "up",
      impact: "medium",
      frequency: 534,
      description: "Trend toward cleaner, less cluttered backgrounds"
    }
  ]

  const behavioralSignals = [
    {
      metric: "Peak Remix Hours",
      value: "6-9 PM EST",
      insight: "Users most active in evening hours",
      action: "Schedule content for peak engagement",
      icon: Clock,
      color: "purple"
    },
    {
      metric: "Avg. Remix Chain Length",
      value: "3.4 iterations",
      insight: "Users iterate multiple times per ad",
      action: "Encourage remix chains with rewards",
      icon: Activity,
      color: "blue"
    },
    {
      metric: "Viral Threshold",
      value: "500+ likes",
      insight: "Remixes with 500+ likes get 10x reach",
      action: "Boost high-performing remixes early",
      icon: TrendingUp,
      color: "orange"
    },
    {
      metric: "Conversion Window",
      value: "48 hours",
      insight: "Most conversions happen within 2 days",
      action: "Focus retargeting on 48hr window",
      icon: Target,
      color: "green"
    }
  ]

  const trendingSignals = [
    {
      trend: "AI-Generated Aesthetic",
      velocity: "+127%",
      timeframe: "Last 7 days",
      prediction: "Expected to grow",
      tags: ["futuristic", "tech", "digital art"]
    },
    {
      trend: "90s Nostalgia Theme",
      velocity: "+89%",
      timeframe: "Last 14 days",
      prediction: "Peaking soon",
      tags: ["retro", "vintage", "throwback"]
    },
    {
      trend: "Sustainability Messaging",
      velocity: "+64%",
      timeframe: "Last 30 days",
      prediction: "Long-term growth",
      tags: ["eco-friendly", "green", "sustainable"]
    }
  ]

  const aiInsights = [
    {
      type: "opportunity",
      title: "Untapped Audience Segment",
      description: "25-34 males showing 3x engagement but only 12% of targeting",
      action: "Expand targeting to capture high-intent segment",
      priority: "high"
    },
    {
      type: "alert",
      title: "Creative Fatigue Detected",
      description: "Engagement down 18% on ads older than 14 days",
      action: "Refresh creative assets weekly to maintain performance",
      priority: "high"
    },
    {
      type: "insight",
      title: "Cross-Platform Opportunity",
      description: "Vertical video remixes getting 2.3x more shares on mobile",
      action: "Create vertical format variants for mobile optimization",
      priority: "medium"
    },
    {
      type: "opportunity",
      title: "UGC Goldmine",
      description: "Top 5% of user remixes outperform original ads by 4x",
      action: "Feature best user remixes in official campaigns",
      priority: "high"
    }
  ]

  const performanceSignals = [
    {
      metric: "Remix-to-Conversion Rate",
      current: "12.4%",
      benchmark: "8.2%",
      status: "outperforming",
      lift: "+51%"
    },
    {
      metric: "Viral Coefficient",
      current: "1.8",
      benchmark: "1.2",
      status: "outperforming",
      lift: "+50%"
    },
    {
      metric: "Creative Resonance Score",
      current: "87/100",
      benchmark: "72/100",
      status: "outperforming",
      lift: "+21%"
    },
    {
      metric: "Brand Lift",
      current: "+34%",
      benchmark: "+18%",
      status: "outperforming",
      lift: "+89%"
    }
  ]

  const getSignalColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-purple-50 dark:bg-purple-950/10 border-purple-200 dark:border-purple-800"
      case "medium":
        return "bg-slate-50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800"
      default:
        return "bg-slate-50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800"
    }
  }

  const getIconColor = (color: string) => {
    const colors: Record<string, string> = {
      purple: "text-slate-700 dark:text-slate-400",
      blue: "text-slate-700 dark:text-slate-400",
      orange: "text-purple-600 dark:text-purple-400",
      green: "text-slate-700 dark:text-slate-400"
    }
    return colors[color] || "text-slate-500"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-slate-700 dark:text-slate-300" />
            Signal Extraction Intelligence
          </h2>
          <p className="text-muted-foreground mt-1">
            Real-time insights extracted from user behavior and ad performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Powered by Letta + Claude
          </Badge>
          <Badge variant="outline" className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400">
            Live
          </Badge>
        </div>
      </div>

      {/* Creative Intent Signals */}
      <Card>
        <CardHeader>
          <CardTitle>
            Creative Intent Signals
          </CardTitle>
          <p className="text-sm text-muted-foreground">What users want to create with your ads</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {creativeIntentSignals.map((signal, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getSignalColor(signal.impact)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{signal.signal}</h4>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${signal.impact === "high" ? "bg-purple-100 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400" : ""}`}
                      >
                        {signal.impact.toUpperCase()}
                      </Badge>
                      {signal.trend === "up" && (
                        <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{signal.description}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {signal.frequency} mentions
                      </span>
                      <span className="flex items-center gap-1">
                        <Brain className="h-3 w-3" />
                        {signal.confidence}% confidence
                      </span>
                      <span className="text-muted-foreground">{signal.source}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Behavioral Patterns */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Behavioral Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {behavioralSignals.map((signal, index) => {
                const Icon = signal.icon
                return (
                  <div key={index} className="p-4 bg-slate-50 dark:bg-slate-900/20 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                        <Icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">{signal.metric}</span>
                          <span className="text-lg font-bold">{signal.value}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{signal.insight}</p>
                        <div className="flex items-center gap-2 text-xs text-primary">
                          <ArrowRight className="h-3 w-3" />
                          <span>{signal.action}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Trending Signals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trendingSignals.map((signal, index) => (
                <div key={index} className="p-4 bg-slate-50 dark:bg-slate-900/20 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{signal.trend}</h4>
                    <Badge className="bg-purple-600 dark:bg-purple-500 text-white">{signal.velocity}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{signal.timeframe}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                      <span className="text-slate-700 dark:text-slate-300">{signal.prediction}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {signal.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI-Powered Insights */}
      <Card>
        <CardHeader>
          <CardTitle>
            AI-Powered Actionable Insights
          </CardTitle>
          <p className="text-sm text-muted-foreground">Automatically generated recommendations based on extracted signals</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Insight</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Finding</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Recommended Action</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Priority</th>
                </tr>
              </thead>
              <tbody>
                {aiInsights.map((insight, index) => {
                  const isOpportunity = insight.type === "opportunity"
                  const isAlert = insight.type === "alert"

                  return (
                    <tr
                      key={index}
                      className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {isAlert && <AlertCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
                          {isOpportunity && <Target className="h-4 w-4 text-slate-600 dark:text-slate-400" />}
                          {!isAlert && !isOpportunity && <MessageSquare className="h-4 w-4 text-slate-600 dark:text-slate-400" />}
                          <span className="text-sm font-medium capitalize">{insight.type}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-semibold">{insight.title}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-muted-foreground">{insight.description}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-purple-600 dark:text-purple-400">{insight.action}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${insight.priority === "high" ? "bg-purple-100 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800" : ""}`}
                        >
                          {insight.priority}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Performance Signals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Performance Signals vs. Industry Benchmarks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {performanceSignals.map((signal, index) => {
              // Parse numeric values for visualization
              const currentValue = parseFloat(signal.current.replace(/[^0-9.]/g, ''))
              const benchmarkValue = parseFloat(signal.benchmark.replace(/[^0-9.]/g, ''))
              const maxValue = Math.max(currentValue, benchmarkValue) * 1.2

              return (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">{signal.metric}</h4>
                      <p className="text-xs text-muted-foreground">Industry benchmark: {signal.benchmark}</p>
                    </div>
                    <Badge className="bg-purple-600 dark:bg-purple-500 text-white">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {signal.lift}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {/* Your Performance Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">Your Performance</span>
                        <span className="text-sm font-bold text-purple-700 dark:text-purple-400">{signal.current}</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-8 overflow-hidden">
                        <div
                          className="h-full bg-purple-600 dark:bg-purple-500 rounded-full flex items-center justify-end pr-3 transition-all"
                          style={{ width: `${(currentValue / maxValue) * 100}%` }}
                        >
                          <span className="text-xs text-white font-medium">{signal.current}</span>
                        </div>
                      </div>
                    </div>

                    {/* Benchmark Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-muted-foreground">Industry Average</span>
                        <span className="text-sm font-medium text-muted-foreground">{signal.benchmark}</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-6 overflow-hidden">
                        <div
                          className="h-full bg-slate-400 dark:bg-slate-600 rounded-full flex items-center justify-end pr-3 transition-all"
                          style={{ width: `${(benchmarkValue / maxValue) * 100}%` }}
                        >
                          <span className="text-xs text-white font-medium">{signal.benchmark}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
