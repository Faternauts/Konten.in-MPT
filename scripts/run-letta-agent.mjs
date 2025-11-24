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
const agentId = process.env.LETTA_AGENT_ID;
if (!agentId) {
  console.error('Missing LETTA_AGENT_ID in .env');
  process.exit(1);
}
const [, , ...args] = process.argv;
const userMessage = args.length ? args.join(' ') : "What do you know about me?";

const client = new LettaClient(baseUrl ? { token, baseUrl } : { token });

try {
  const response = await client.agents.messages.create(agentId, {
    messages: [{ role: "user", content: userMessage }]
  });

  for (const msg of response.messages) {
    if (msg.messageType === "assistant_message") {
      console.log(msg.content);
    }
  }
} catch (err) {
  console.error('Letta call failed:', err?.message || err);
  if (err?.statusCode) console.error('statusCode:', err.statusCode);
  if (err?.body) console.error('body:', err.body);
  if (err?.rawResponse) console.error('rawResponse:', err.rawResponse);
  process.exit(1);
}
// node scripts/run-letta-agent.mjs "hi"
