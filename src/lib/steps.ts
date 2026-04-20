import type { Idea } from "@/types/idea";

export interface GuidedStep {
  number: number;
  emoji: string;
  title: string;
  description: string;
  action?: string;
}

export function generateSteps(idea: Idea): GuidedStep[] {
  const isEngineer = idea.audience === "engineers";
  const isKid = idea.audience === "kids";
  const isBusiness = idea.audience === "business";

  const steps: GuidedStep[] = [];

  // Step 1: Choose your tool
  steps.push({
    number: 1,
    emoji: "🛠️",
    title: "Pick your starting point",
    description: isKid
      ? "Open VS Code or go to github.com — ask a parent or teacher to help you set up GitHub Copilot if you haven't already!"
      : isBusiness
        ? "Open VS Code with GitHub Copilot installed, or use the Cloud Agent on github.com — no local setup needed."
        : isEngineer
          ? "Open your IDE with Copilot, the Copilot CLI, or assign to Copilot Cloud Agent on github.com."
          : "Open VS Code with GitHub Copilot installed. If you prefer, you can also use the terminal (CLI) or github.com.",
    action: isEngineer ? undefined : "Choose: 🖥️ IDE  ·  ⌨️ CLI  ·  ☁️ Cloud",
  });

  // Step 2: Start with a plan
  steps.push({
    number: 2,
    emoji: "📋",
    title: "Start with a plan",
    description: isKid
      ? `Tell Copilot: "I want to build ${idea.title.toLowerCase()}." It will make a plan for you — read through it and say if you want to change anything!`
      : `Paste the vibe prompt below into Copilot Chat. ${isEngineer ? "Use Shift+Tab for Plan mode in VS Code, or prefix with [[PLAN]] in CLI." : "Copilot will create a plan showing what it's going to build."} Review it before moving on.`,
    action: "📋 Copy the vibe prompt below and paste it into Copilot",
  });

  // Step 3: Let the agent build
  steps.push({
    number: 3,
    emoji: "🤖",
    title: "Let Copilot build it",
    description: isKid
      ? "Say \"This looks good, please build it!\" and watch Copilot create your project. It will make files, write code, and set everything up for you!"
      : isBusiness
        ? "Approve the plan and Copilot will start building — creating files, writing content, and styling the layout. You can watch it work in real time."
        : isEngineer
          ? "Approve the plan to enter Agent mode. Copilot will scaffold the project, install dependencies, and implement features. Use Autopilot for fully autonomous execution."
          : "Approve the plan and Copilot starts building automatically. It will create files, write code, and put everything together.",
  });

  // Step 4: Customize / make it yours
  steps.push({
    number: 4,
    emoji: "✏️",
    title: "Make it yours",
    description: isKid
      ? "Now the fun part! Change the colors, add your name, pick different pictures. Tell Copilot what you want to change and it will help!"
      : isBusiness
        ? `Review what Copilot built. Ask it to adjust the design, update the copy, or add your branding. Say things like "Change the color scheme to our brand colors" or "Add a section for testimonials."`
        : isEngineer
          ? "Review the generated code. Ask Copilot to refactor, add tests, improve error handling, or extend functionality. Iterate until it meets your standards."
          : "Look at what Copilot built and tell it what to change. You can say things like \"Make the header bigger\" or \"Change the background color to blue.\"",
  });

  // Step 5: Test / preview
  steps.push({
    number: 5,
    emoji: "👀",
    title: isKid ? "See it in action!" : "Preview and test",
    description: isKid
      ? "Open your project in the browser and try everything! Click all the buttons, fill in the forms. Show your friends!"
      : isEngineer
        ? `Run locally with \`npm run dev\` or \`bun run dev\`. Test across devices. Ask Copilot to write tests: "Add tests for the main features."`
        : "Open the preview in your browser and try everything out. Click through all the pages, test the forms, and check it looks good on your phone too.",
  });

  // Step 6: Ship it
  steps.push({
    number: 6,
    emoji: "🚀",
    title: isKid ? "Share it with everyone!" : "Deploy and share",
    description: isKid
      ? "Ask Copilot: \"Help me put this on the internet so my friends can see it.\" It can set up GitHub Pages for you — then share the link!"
      : isBusiness
        ? "Ask Copilot to deploy to GitHub Pages or your preferred hosting. Share the URL with your team or clients for feedback."
        : isEngineer
          ? "Deploy to GitHub Pages, Vercel, or your preferred platform. Set up CI/CD with GitHub Actions. Share the repo and live URL."
          : "Ask Copilot: \"Help me deploy this to GitHub Pages.\" Once it's live, share the link with anyone!",
  });

  // Step 7: Show and tell
  steps.push({
    number: 7,
    emoji: "🎉",
    title: "Show and tell",
    description: isKid
      ? "Show what you built to the group! Tell them your favorite part and what you'd add next time."
      : "Demo your project to the group. Share what you learned, what surprised you, and what you'd add next.",
  });

  return steps;
}
