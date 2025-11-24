import { NextResponse } from 'next/server';
import { LettaClient } from '@letta-ai/letta-client';

export async function GET(request: Request) {
  try {
    const token = process.env.LETTA_API_KEY;
    if (!token) {
      return NextResponse.json({ error: 'Missing LETTA_API_KEY' }, { status: 500 });
    }

    const baseUrl = process.env.LETTA_BASE_URL || undefined;
    const agentId = process.env.LETTA_AGENT_ID || 'agent-3af75001-7e1e-4029-a63a-2cabb24d34fd';

    const client = new LettaClient(baseUrl ? { token, baseUrl } : { token });

    // Detailed prompt for analytics
    const analyticsPrompt = `
Please analyze Nike advertising campaign data and provide analytics in JSON format.

Return ONLY valid JSON (no markdown, no extra text) with this exact structure:

{
  "sentiment": {
    "positive": [number 0-100],
    "neutral": [number 0-100],
    "negative": [number 0-100]
  },
  "demographics": {
    "ageGroups": [
      { "range": "18-24", "percentage": [number] },
      { "range": "25-34", "percentage": [number] },
      { "range": "35-44", "percentage": [number] },
      { "range": "45+", "percentage": [number] }
    ],
    "gender": [
      { "gender": "Female", "percentage": [number] },
      { "gender": "Male", "percentage": [number] },
      { "gender": "Other", "percentage": [number] }
    ],
    "locations": [
      { "location": "United States", "percentage": [number] },
      { "location": "United Kingdom", "percentage": [number] },
      { "location": "Canada", "percentage": [number] },
      { "location": "Australia", "percentage": [number] },
      { "location": "Other", "percentage": [number] }
    ]
  },
  "competitors": [
    { "brand": "Competitor A", "score": [number 0-100], "engagement": "High|Medium|Low", "color": "bg-blue-500" },
    { "brand": "Competitor B", "score": [number 0-100], "engagement": "High|Medium|Low", "color": "bg-purple-500" }
  ]
}

Use realistic numbers. All percentages in each category must total 100%.
`;

    const response = await client.agents.messages.create(agentId, {
      messages: [{ role: "user", content: analyticsPrompt }]
    });

    // Extract the assistant's response
    let analyticsData = null;
    for (const msg of response.messages) {
      if (msg.messageType === "assistant_message") {
        const content = msg.content;

        // Try to extract JSON (handle markdown code blocks)
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) ||
                         content.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
          const jsonStr = jsonMatch[1] || jsonMatch[0];
          try {
            analyticsData = JSON.parse(jsonStr);
          } catch (parseError) {
            console.error('JSON parse error:', parseError);
            return NextResponse.json({
              error: 'Failed to parse agent response as JSON',
              rawResponse: content
            }, { status: 500 });
          }
        } else {
          return NextResponse.json({
            error: 'No JSON found in agent response',
            rawResponse: content
          }, { status: 500 });
        }
      }
    }

    if (!analyticsData) {
      return NextResponse.json({ error: 'No response from agent' }, { status: 500 });
    }

    return NextResponse.json(analyticsData);
  } catch (error: any) {
    console.error('Error fetching Letta analytics:', error);
    return NextResponse.json({
      error: 'Failed to fetch analytics',
      details: error.message
    }, { status: 500 });
  }
}
