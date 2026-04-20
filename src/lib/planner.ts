export interface PlannerState {
  step: PlannerStep;
  idea: string;
  goal: string;
  style: string;
  audience: string;
  priority: string;
}

export type PlannerStep =
  | "idea"
  | "goal"
  | "style"
  | "audience"
  | "priority"
  | "result";

export interface PlanQuestion {
  id: PlannerStep;
  question: string;
  subtitle: string;
  options: PlanOption[];
  allowCustom?: boolean;
}

export interface PlanOption {
  value: string;
  label: string;
  emoji: string;
  description: string;
}

export interface GeneratedPlan {
  projectName: string;
  summary: string;
  approach: string;
  phases: PlanPhase[];
  vibePrompt: string;
  copilotResources: CopilotResource[];
  exerciseSteps: ExerciseStep[];
}

export interface PlanPhase {
  name: string;
  description: string;
  items: string[];
}

export interface CopilotResource {
  type: "agent" | "instruction" | "skill";
  name: string;
  description: string;
  url: string;
}

export interface ExerciseStep {
  number: number;
  title: string;
  description: string;
}

export const PLAN_QUESTIONS: PlanQuestion[] = [
  {
    id: "goal",
    question: "What's the main goal?",
    subtitle: "What should your project do for people?",
    options: [
      {
        value: "inform",
        label: "Share information",
        emoji: "📖",
        description: "Show content, tell a story, or educate people",
      },
      {
        value: "collect",
        label: "Collect input",
        emoji: "📝",
        description: "Forms, surveys, bookings, or sign-ups",
      },
      {
        value: "connect",
        label: "Connect people",
        emoji: "🤝",
        description: "Messaging, matching, or community features",
      },
      {
        value: "sell",
        label: "Sell or showcase",
        emoji: "🛍️",
        description: "Products, services, or a portfolio",
      },
      {
        value: "track",
        label: "Track or organize",
        emoji: "📊",
        description: "Dashboards, lists, progress tracking",
      },
      {
        value: "create",
        label: "Create or play",
        emoji: "🎨",
        description: "Games, art tools, or creative apps",
      },
    ],
  },
  {
    id: "style",
    question: "How should it look and feel?",
    subtitle: "Pick the shape that fits best — you can always change later",
    options: [
      {
        value: "onepage",
        label: "Simple one-page site",
        emoji: "📄",
        description: "Everything on a single scrollable page — fast to build",
      },
      {
        value: "multipage",
        label: "Multi-page website",
        emoji: "📑",
        description: "Several pages with navigation — good for more content",
      },
      {
        value: "app",
        label: "Interactive app",
        emoji: "⚡",
        description: "Dynamic features, user accounts, real-time updates",
      },
      {
        value: "mobile",
        label: "Mobile-first",
        emoji: "📱",
        description: "Designed for phones first, works on desktop too",
      },
    ],
  },
  {
    id: "audience",
    question: "Who will use it?",
    subtitle: "This helps decide how simple or advanced to make things",
    options: [
      {
        value: "personal",
        label: "Just me",
        emoji: "🙋",
        description: "A personal project or tool for yourself",
      },
      {
        value: "team",
        label: "My team or class",
        emoji: "👥",
        description: "A small group of known people",
      },
      {
        value: "public",
        label: "The public",
        emoji: "🌍",
        description: "Anyone on the internet can find and use it",
      },
      {
        value: "clients",
        label: "Clients or customers",
        emoji: "💼",
        description: "Professional audience, needs to look polished",
      },
    ],
  },
  {
    id: "priority",
    question: "What matters most right now?",
    subtitle: "You can do everything eventually — what's the first win?",
    options: [
      {
        value: "speed",
        label: "Get it live fast",
        emoji: "🚀",
        description: "Ship an MVP, iterate later",
      },
      {
        value: "design",
        label: "Make it beautiful",
        emoji: "✨",
        description: "Great design and user experience first",
      },
      {
        value: "features",
        label: "Core features work",
        emoji: "⚙️",
        description: "The main functionality is solid and reliable",
      },
      {
        value: "learn",
        label: "Learn by building",
        emoji: "🎓",
        description: "The process matters more than the result",
      },
    ],
  },
];

export function generatePlan(state: PlannerState): GeneratedPlan {
  const projectName = toProjectName(state.idea);
  const approach = pickApproach(state);

  return {
    projectName,
    summary: `A ${approach.label} for "${state.idea}" that helps people ${goalVerb(state.goal)}.`,
    approach: approach.description,
    phases: buildPhases(state),
    vibePrompt: buildVibePrompt(state),
    copilotResources: pickResources(state),
    exerciseSteps: buildExerciseSteps(state),
  };
}

function toProjectName(idea: string): string {
  return idea
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 40);
}

function goalVerb(goal: string): string {
  const map: Record<string, string> = {
    inform: "find information and learn",
    collect: "submit information and book services",
    connect: "connect with each other",
    sell: "discover and purchase products or services",
    track: "track progress and stay organized",
    create: "create, play, and express themselves",
  };
  return map[goal] || "get things done";
}

function pickApproach(state: PlannerState) {
  if (state.style === "onepage")
    return { label: "simple one-page website", description: "A clean, single-page site hosted on GitHub Pages. No backend needed — just HTML, CSS, and a touch of JavaScript. Perfect for getting live quickly." };
  if (state.style === "app")
    return { label: "interactive web application", description: "A dynamic web app with interactive features. Uses a modern framework like Next.js or React for a rich user experience." };
  if (state.style === "mobile")
    return { label: "mobile-first web app", description: "A responsive web app designed for mobile screens first. Works as a progressive web app (PWA) that feels native on phones." };
  return { label: "multi-page website", description: "A structured website with multiple pages and navigation. Great for projects with different sections of content." };
}

function buildPhases(state: PlannerState): PlanPhase[] {
  const phases: PlanPhase[] = [
    {
      name: "🏗️ Phase 1 — Foundation",
      description: "Get the basics up and running",
      items: [
        "Set up the project structure",
        `Create the main ${state.style === "onepage" ? "page layout" : "page layouts and navigation"}`,
        "Add placeholder content and styling",
        state.priority === "design" ? "Polish the visual design and typography" : "Get a working prototype deployed",
      ],
    },
    {
      name: "⚡ Phase 2 — Core Features",
      description: "Build the thing that makes it useful",
      items: buildCoreFeatures(state),
    },
    {
      name: "✨ Phase 3 — Polish & Share",
      description: "Make it ready for real people",
      items: [
        "Test on different devices and browsers",
        "Add finishing touches (animations, loading states)",
        "Write a clear README with setup instructions",
        state.audience === "public" ? "Set up a custom domain" : "Share with your intended audience",
      ],
    },
  ];
  return phases;
}

function buildCoreFeatures(state: PlannerState): string[] {
  const features: string[] = [];
  switch (state.goal) {
    case "inform":
      features.push("Write and organize your content", "Add images and media", "Create a search or filter feature");
      break;
    case "collect":
      features.push("Build input forms with validation", "Set up form submission handling", "Add confirmation and thank-you flows");
      break;
    case "connect":
      features.push("Create user profiles or listings", "Build a messaging or matching feature", "Add notifications or alerts");
      break;
    case "sell":
      features.push("Create product/service listings", "Build a showcase or gallery", "Add call-to-action buttons and contact forms");
      break;
    case "track":
      features.push("Build the dashboard or tracking view", "Add data entry and editing", "Create progress visualizations");
      break;
    case "create":
      features.push("Build the creative canvas or game area", "Add interactive controls", "Include save/share/export features");
      break;
  }
  return features;
}

function buildVibePrompt(state: PlannerState): string {
  const style = state.style === "onepage" ? "a simple one-page website" :
    state.style === "app" ? "an interactive web application" :
    state.style === "mobile" ? "a mobile-first web app" : "a multi-page website";

  const audience = state.audience === "personal" ? "for personal use" :
    state.audience === "team" ? "for a small team" :
    state.audience === "clients" ? "for a professional audience" : "for the general public";

  const priority = state.priority === "speed" ? "Focus on getting a working MVP deployed quickly." :
    state.priority === "design" ? "Focus on beautiful design and great user experience." :
    state.priority === "features" ? "Focus on making the core features work reliably." :
    "Focus on clean, well-structured code that I can learn from.";

  return `I want to build ${style} for a ${state.idea} ${audience}.

The main goal is to help people ${goalVerb(state.goal)}.

${priority}

Plan the project structure, design approach, and feature breakdown first. Then implement it phase by phase, starting with the foundation.`;
}

function pickResources(state: PlannerState): CopilotResource[] {
  const resources: CopilotResource[] = [
    {
      type: "instruction",
      name: "Accessibility",
      description: "Ensure your project is usable by everyone",
      url: "https://awesome-copilot.github.com/instructions/",
    },
  ];

  if (state.style === "app" || state.style === "multipage") {
    resources.push({
      type: "agent",
      name: "API Architect",
      description: "Design clean, well-structured APIs",
      url: "https://awesome-copilot.github.com/agents/",
    });
  }

  if (state.goal === "sell" || state.audience === "clients") {
    resources.push({
      type: "instruction",
      name: "SEO Best Practices",
      description: "Make your site discoverable on search engines",
      url: "https://awesome-copilot.github.com/instructions/",
    });
  }

  if (state.priority === "learn") {
    resources.push({
      type: "agent",
      name: "Code Reviewer",
      description: "Get feedback on your code as you build",
      url: "https://awesome-copilot.github.com/agents/",
    });
  }

  return resources;
}

function buildExerciseSteps(state: PlannerState): ExerciseStep[] {
  return [
    {
      number: 1,
      title: "Set up your project",
      description: `Create a new repository and scaffold your ${state.style === "onepage" ? "one-page site" : "project"} using Copilot Agent mode.`,
    },
    {
      number: 2,
      title: "Build the foundation",
      description: "Use the vibe prompt to generate the initial layout, styling, and navigation structure.",
    },
    {
      number: 3,
      title: "Add core features",
      description: `Implement the main functionality: ${goalVerb(state.goal)}. Ask Copilot to build each feature one at a time.`,
    },
    {
      number: 4,
      title: "Polish and deploy",
      description: "Review the result, make improvements, and deploy to GitHub Pages or your preferred hosting.",
    },
    {
      number: 5,
      title: "Show and tell",
      description: "Share what you built! Demo it to the group and explain what you learned.",
    },
  ];
}
