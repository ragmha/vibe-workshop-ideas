export interface Idea {
  id: string;
  title: string;
  description: string;
  vibePrompt: string;
  category: Category;
  difficulty: Difficulty;
  duration: Duration;
  audience: Audience;
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
  | "devtools"
  | "business"
  | "education"
  | "fun";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type Duration = "15min" | "30min" | "1hr" | "2hr+";

export type Audience =
  | "general"
  | "kids"
  | "students"
  | "business"
  | "engineers";

export const CATEGORIES: Category[] = [
  "web",
  "game",
  "creative",
  "business",
  "education",
  "fun",
  "data",
  "mobile",
  "api",
  "cli",
  "devtools",
];

export const DIFFICULTIES: Difficulty[] = [
  "beginner",
  "intermediate",
  "advanced",
];

export const DURATIONS: Duration[] = ["15min", "30min", "1hr", "2hr+"];

export const AUDIENCES: Audience[] = [
  "general",
  "kids",
  "students",
  "business",
  "engineers",
];

export const CATEGORY_LABELS: Record<Category, string> = {
  web: "🌐 Web",
  api: "🔌 API",
  cli: "⌨️ CLI",
  game: "🎮 Game",
  data: "📊 Data",
  creative: "🎨 Creative",
  mobile: "📱 Mobile",
  devtools: "🛠️ DevTools",
  business: "💼 Business",
  education: "📚 Education",
  fun: "🎉 Fun",
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

export const AUDIENCE_LABELS: Record<Audience, string> = {
  general: "👥 General",
  kids: "🧒 Kids",
  students: "🎓 Students",
  business: "💼 Business",
  engineers: "👩‍💻 Engineers",
};
