import type { Idea, Category, Difficulty, Duration } from "@/types/idea";

export function getRandomIdea(ideas: Idea[]): Idea | null {
  if (ideas.length === 0) return null;
  return ideas[Math.floor(Math.random() * ideas.length)];
}

export function getRandomIdeaExcluding(
  ideas: Idea[],
  excludeId?: string
): Idea | null {
  const pool = excludeId ? ideas.filter((i) => i.id !== excludeId) : ideas;
  return getRandomIdea(pool);
}

export interface IdeaFilters {
  category?: Category | "all";
  difficulty?: Difficulty | "all";
  duration?: Duration | "all";
  search?: string;
  source?: "curated" | "ai" | "all";
}

export function filterIdeas(ideas: Idea[], filters: IdeaFilters): Idea[] {
  return ideas.filter((idea) => {
    if (filters.category && filters.category !== "all") {
      if (idea.category !== filters.category) return false;
    }
    if (filters.difficulty && filters.difficulty !== "all") {
      if (idea.difficulty !== filters.difficulty) return false;
    }
    if (filters.duration && filters.duration !== "all") {
      if (idea.duration !== filters.duration) return false;
    }
    if (filters.source && filters.source !== "all") {
      if (idea.source !== filters.source) return false;
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase();
      const searchable = [
        idea.title,
        idea.description,
        idea.vibePrompt,
        ...idea.tags,
      ]
        .join(" ")
        .toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    return true;
  });
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
