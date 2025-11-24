import { NextRequest, NextResponse } from 'next/server';

interface PromptAnalysis {
  themes: string[];
  emotionalTone: string;
  styleReferences: string[];
  intent: string;
}

export async function POST(request: NextRequest) {
  try {
    const { prompts } = await request.json();
    
    if (!prompts || !Array.isArray(prompts)) {
      return NextResponse.json(
        { error: 'Missing or invalid prompts array' },
        { status: 400 }
      );
    }

    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      console.error('Missing CLAUDE_API_KEY in environment variables');
      return NextResponse.json(
        { error: 'Claude API key not configured' },
        { status: 500 }
      );
    }

    // Prepare the system prompt and user prompts for analysis
    const systemPrompt = `You are an expert in analyzing creative ad remixes and marketing content.
    Analyze the provided ad remix prompts and extract key information.

    Return ONLY valid JSON (no markdown, no code blocks, no extra text) with this exact structure:
    {
      "themes": ["list", "of", "main", "themes"],
      "emotionalTone": "overall emotional tone",
      "styleReferences": ["list", "of", "style", "references"],
      "intent": "summarized user intent"
    }`;

    const userPrompt = `Analyze these ad remix prompts and extract themes, emotional tone, style references, and intent:\n\n${prompts.join("\n")}`;

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Claude API error:', error);
      return NextResponse.json(
        { error: 'Failed to analyze prompts' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.content[0].text;

    // Extract JSON from markdown code blocks or plain text
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) ||
                     content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.error('No JSON found in Claude response:', content);
      return NextResponse.json(
        { error: 'Failed to parse analysis response' },
        { status: 500 }
      );
    }

    const jsonStr = jsonMatch[1] || jsonMatch[0];
    const analysis = JSON.parse(jsonStr);

    return NextResponse.json(analysis);

  } catch (error) {
    console.error('Error analyzing prompts:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
