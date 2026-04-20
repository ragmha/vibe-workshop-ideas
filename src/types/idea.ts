export interface Idea {
  id: string;
  title: string;
  description: string;
  vibePrompt: string;
  category: Category;
  difficulty: Difficulty;
  duration: Duration;
  tools: string[];
  tags: string[];
  source: "curated" | "ai";
}

export type Category =
  | "web"
  | "api"
  | "cli"
  | "game"
  | "data"
  | "creative"
  | "mobile"
  | "devtools";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type Duration = "15min" | "30min" | "1hr" | "2hr+";

export const CATEGORIES: Category[] = [
  "web",
  "api",
  "cli",
  "game",
  "data",
  "creative",
  "mobile",
  "devtools",
];

export const DIFFICULTIES: Difficulty[] = [
  "beginner",
  "intermediate",
  "advanced",
];

export const DURATIONS: Duration[] = ["15min", "30min", "1hr", "2hr+"];

export const CATEGORY_LABELS: Record<Category, string> = {
  web: "🌐 Web",
  api: "🔌 API",
  cli: "⌨️ CLI",
  game: "🎮 Game",
  data: "📊 Data",
  creative: "🎨 Creative",
  mobile: "📱 Mobile",
  devtools: "🛠️ DevTools",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: "🟢 Beginner",
  intermediate: "🟡 Intermediate",
  advanced: "🔴 Advanced",
};

export const DURATION_LABELS: Record<Duration, string> = {
  "15min": "⚡ 15 min",
  "30min": "⏱️ 30 min",
  "1hr": "🕐 1 hour",
  "2hr+": "🕑 2+ hours",
};
