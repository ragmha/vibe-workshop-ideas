# ✨ Vibe Workshop Ideas

A fun, visually appealing website that helps you discover and generate ideas for **vibe coding workshops** — workshops where participants use AI-assisted coding tools (like GitHub Copilot) to build projects by describing what they want.

## Features

- ✨ **Random Idea Generator** — hit a button, get a project idea with a ready-to-use vibe prompt
- 📚 **Filterable Catalog** — browse 40+ ideas by category, difficulty, duration, and keyword search
- 🤖 **AI-Generated Ideas** — fresh ideas generated weekly by the GitHub Copilot SDK via GitHub Actions
- 🌙 **Dark Mode Default** — neon gradients, monospace headings, projector-friendly design
- 📋 **Copy Prompts** — one-click copy of vibe prompts to paste into your AI tool of choice

## Tech Stack

- **[Next.js 15](https://nextjs.org)** (App Router, static export)
- **[Bun](https://bun.sh)** (runtime & package manager)
- **[Tailwind CSS v4](https://tailwindcss.com)**
- **[GitHub Copilot SDK](https://github.com/github/copilot-sdk)** (AI idea generation)
- **GitHub Actions** (CI/CD + AI idea generation)
- **GitHub Pages** (hosting)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.0+
- [Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/install-copilot-cli) (for AI idea generation only)

### Local Development

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/vibe-workshop-ideas.git
cd vibe-workshop-ideas

# Install dependencies
bun install

# Start dev server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Generate AI Ideas Locally

```bash
# Authenticate with Copilot CLI (one-time)
copilot auth login

# Generate 10 new ideas
bun scripts/generate-ideas.ts 10
```

### Build for Production

```bash
bun run build
```

Static files are output to the `out/` directory.

## GitHub Actions Workflows

### Deploy (`deploy.yml`)
Automatically builds and deploys to GitHub Pages on push to `main`.

### Generate Ideas (`generate-ideas.yml`)
Runs the Copilot SDK to generate new AI ideas:
- **Scheduled**: Every Monday at 9am UTC
- **Manual**: Trigger via GitHub Actions UI with custom idea count
- Generated ideas are committed to `src/data/ai-ideas.json`

## Project Structure

```
├── .github/workflows/
│   ├── deploy.yml              # GitHub Pages deployment
│   └── generate-ideas.yml      # AI idea generation
├── scripts/
│   └── generate-ideas.ts       # Copilot SDK generation script
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # React components
│   ├── data/
│   │   ├── ideas.json          # 40+ curated ideas
│   │   └── ai-ideas.json       # AI-generated ideas
│   ├── lib/                    # Utilities
│   └── types/                  # TypeScript types
└── next.config.ts              # Static export config
```

## What is Vibe Coding?

Vibe coding is a style of programming where you describe what you want to build in natural language, and an AI assistant helps you write the code. Tools include:

- [GitHub Copilot](https://github.com/features/copilot) — AI pair programmer
- [Copilot SDK](https://github.com/github/copilot-sdk) — Build apps powered by Copilot
- [Goose](https://block.github.io/goose/) — Open-source AI coding agent
- [Ollama](https://ollama.com) — Run LLMs locally

## License

MIT
