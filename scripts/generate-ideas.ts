/**
 * Generate vibe coding workshop ideas using the GitHub Copilot SDK.
 *
 * Usage:
 *   bun scripts/generate-ideas.ts [count]
 *
 * Prerequisites:
 *   - Copilot CLI installed and authenticated (`copilot auth login`)
 *   - @github/copilot-sdk installed (`bun install`)
 */

import { CopilotClient } from "@github/copilot-sdk";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";

const AI_IDEAS_PATH = resolve(import.meta.dir, "../src/data/ai-ideas.json");
const CURATED_IDEAS_PATH = resolve(import.meta.dir, "../src/data/ideas.json");

const SYSTEM_PROMPT = `You are a creative workshop facilitator who generates project ideas for "vibe coding" workshops.
Vibe coding is a style of programming where participants describe what they want to build in natural language, and an AI assistant (like GitHub Copilot) helps write the code.

Generate unique, fun, and practical project ideas that workshop participants can build using AI-assisted coding tools.

IMPORTANT: Respond ONLY with a valid JSON array of idea objects. No markdown, no explanation, no code blocks — just the JSON array.

Each idea object must have this exact schema:
{
  "id": "kebab-case-unique-id",
  "title": "Short Catchy Title",
  "description": "2-3 sentence description of what to build and why it's fun",
  "vibePrompt": "The exact prompt a participant would give to GitHub Copilot to start building this project. Be specific and detailed.",
  "category": "web" | "api" | "cli" | "game" | "data" | "creative" | "mobile" | "devtools",
  "difficulty": "beginner" | "intermediate" | "advanced",
  "duration": "15min" | "30min" | "1hr" | "2hr+",
  "tools": ["GitHub Copilot", ...other relevant tools],
  "tags": ["tag1", "tag2", "tag3"],
  "source": "ai"
}

Guidelines:
- Mix categories and difficulty levels
- Make vibePrompts detailed enough that someone could paste them into Copilot and start building
- Ideas should be achievable in the stated duration using AI-assisted coding
- Be creative — think of projects that would be fun and impressive to demo at the end of a workshop
- Don't repeat ideas that already exist in the workshop`;

interface Idea {
  id: string;
  title: string;
  [key: string]: unknown;
}

async function loadExistingIds(): Promise<Set<string>> {
  const ids = new Set<string>();

  if (existsSync(CURATED_IDEAS_PATH)) {
    const curated: Idea[] = JSON.parse(
      readFileSync(CURATED_IDEAS_PATH, "utf-8")
    );
    curated.forEach((i) => ids.add(i.id));
  }

  if (existsSync(AI_IDEAS_PATH)) {
    const ai: Idea[] = JSON.parse(readFileSync(AI_IDEAS_PATH, "utf-8"));
    ai.forEach((i) => ids.add(i.id));
  }

  return ids;
}

async function generateIdeas(count: number): Promise<void> {
  console.log(`\n✨ Generating ${count} vibe coding workshop ideas...\n`);

  const existingIds = await loadExistingIds();
  const existingTitles = existsSync(CURATED_IDEAS_PATH)
    ? JSON.parse(readFileSync(CURATED_IDEAS_PATH, "utf-8")).map(
        (i: Idea) => i.title
      )
    : [];

  const client = new CopilotClient();

  try {
    const session = await client.createSession({ model: "gpt-4.1" });

    const prompt = `Generate exactly ${count} unique vibe coding workshop ideas.

Here are titles of ideas that already exist (do NOT repeat these):
${existingTitles.join(", ")}

Generate ${count} new, unique ideas that are different from the above. Return ONLY the JSON array.`;

    console.log("💬 Sending prompt to Copilot...");

    const response = await session.sendAndWait({
      prompt: `${SYSTEM_PROMPT}\n\n${prompt}`,
    });

    if (!response?.data.content) {
      console.error("❌ No response from Copilot");
      process.exit(1);
    }

    let content = response.data.content.trim();

    // Strip markdown code blocks if present
    if (content.startsWith("```")) {
      content = content.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    let newIdeas: Idea[];
    try {
      newIdeas = JSON.parse(content);
    } catch (e) {
      console.error("❌ Failed to parse response as JSON:", e);
      console.error("Raw response:", content);
      process.exit(1);
    }

    if (!Array.isArray(newIdeas)) {
      console.error("❌ Response is not an array");
      process.exit(1);
    }

    // Deduplicate
    const uniqueIdeas = newIdeas.filter((idea) => !existingIds.has(idea.id));

    // Load existing AI ideas and merge
    let existingAiIdeas: Idea[] = [];
    if (existsSync(AI_IDEAS_PATH)) {
      existingAiIdeas = JSON.parse(readFileSync(AI_IDEAS_PATH, "utf-8"));
    }

    const merged = [...existingAiIdeas, ...uniqueIdeas];

    writeFileSync(AI_IDEAS_PATH, JSON.stringify(merged, null, 2) + "\n");

    console.log(`✅ Generated ${uniqueIdeas.length} new ideas`);
    console.log(`📁 Total AI ideas: ${merged.length}`);
    console.log(`📄 Saved to: ${AI_IDEAS_PATH}\n`);

    uniqueIdeas.forEach((idea) => {
      console.log(`  • ${idea.title} (${idea.id})`);
    });

    await session.disconnect();
  } finally {
    await client.stop();
  }
}

const count = parseInt(process.argv[2] || "10", 10);
generateIdeas(count).catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
