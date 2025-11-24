import dotenv from 'dotenv';
import { LettaClient } from '@letta-ai/letta-client';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from frontend directory
dotenv.config({ path: join(__dirname, '../frontend/.env') });

const token = process.env.LETTA_API_KEY;
if (!token) {
  console.error('Missing LETTA_API_KEY in .env');
  process.exit(1);
}

const baseUrl = process.env.LETTA_BASE_URL || undefined;
const agentId = process.env.LETTA_AGENT_ID || 'agent-3af75001-7e1e-4029-a63a-2cabb24d34fd';

const client = new LettaClient(baseUrl ? { token, baseUrl } : { token });

// Define the analytics request prompt
const analyticsPrompt = `
Please analyze the Nike advertising campaign and provide detailed analytics data in JSON format.

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
    { "brand": "Adidas", "score": [number 0-100], "engagement": "High|Medium|Low", "color": "bg-blue-500" },
    { "brand": "Puma", "score": [number 0-100], "engagement": "High|Medium|Low", "color": "bg-purple-500" },
    { "brand": "Under Armour", "score": [number 0-100], "engagement": "High|Medium|Low", "color": "bg-green-500" }
  ]
}

Base your analysis on typical Nike campaign performance. Use realistic numbers that add up correctly (sentiment should total 100%, demographics should total 100% per category).
`;

try {
  const response = await client.agents.messages.create(agentId, {
    messages: [{ role: "user", content: analyticsPrompt }]
  });

  for (const msg of response.messages) {
    if (msg.messageType === "assistant_message") {
      // Try to extract JSON from the response
      const content = msg.content;

      // Remove markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) ||
                       content.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        try {
          const data = JSON.parse(jsonStr);
          console.log(JSON.stringify(data, null, 2));
        } catch (e) {
          console.error('Failed to parse JSON:', e.message);
          console.log('Raw response:', content);
        }
      } else {
        console.log('Raw response:', content);
      }
    }
  }
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
