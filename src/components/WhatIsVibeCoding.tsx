export default function WhatIsVibeCoding() {
  const tools = [
    {
      name: "GitHub Copilot",
      url: "https://github.com/features/copilot",
      emoji: "🤖",
      description: "AI pair programmer that suggests code in your editor",
    },
    {
      name: "Copilot Chat",
      url: "https://docs.github.com/en/copilot/using-github-copilot/asking-github-copilot-questions-in-your-ide",
      emoji: "💬",
      description: "Chat with Copilot to explain, refactor, or generate code",
    },
    {
      name: "Copilot SDK",
      url: "https://github.com/github/copilot-sdk",
      emoji: "🧰",
      description: "Build your own apps powered by GitHub Copilot",
    },
    {
      name: "Goose",
      url: "https://block.github.io/goose/",
      emoji: "🪿",
      description: "Open-source AI coding agent from Block",
    },
    {
      name: "Ollama",
      url: "https://ollama.com",
      emoji: "🦙",
      description: "Run large language models locally on your machine",
    },
  ];

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-mono font-bold mb-4">
          🤔 What is Vibe Coding?
        </h2>

        <div className="prose prose-invert max-w-none mb-8">
          <p className="text-muted text-lg leading-relaxed">
            <strong className="text-foreground">Vibe coding</strong> is a style
            of programming where you describe what you want to build in natural
            language, and an AI assistant helps you write the code. Instead of
            typing every line yourself, you focus on the <em>what</em> and let
            the AI help with the <em>how</em>.
          </p>
          <p className="text-muted leading-relaxed mt-4">
            In a vibe coding workshop, participants pick a project idea, write a
            prompt describing what they want, and build it with AI tools like
            GitHub Copilot. It&apos;s collaborative, creative, and perfect for
            all skill levels — from first-time coders to seasoned developers
            exploring new tech.
          </p>
        </div>

        {/* Tools grid */}
        <h3 className="text-lg font-mono font-bold mb-4 text-muted">
          Tools for Vibe Coding
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-4 rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors group"
            >
              <span className="text-2xl">{tool.emoji}</span>
              <div>
                <p className="font-mono font-bold text-sm group-hover:text-accent-purple transition-colors">
                  {tool.name}
                </p>
                <p className="text-xs text-muted mt-1">{tool.description}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Workshop tips */}
        <div className="mt-10 p-6 rounded-xl border border-accent-purple/20 bg-accent-purple/5">
          <h3 className="font-mono font-bold mb-3">
            💡 Tips for Running a Vibe Coding Workshop
          </h3>
          <ul className="space-y-2 text-sm text-muted">
            <li>
              ✅ Have participants install their AI tool of choice{" "}
              <em>before</em> the workshop
            </li>
            <li>
              ✅ Start with a 5-minute demo showing how vibe coding works
            </li>
            <li>
              ✅ Use the random idea generator to give everyone a starting
              point
            </li>
            <li>
              ✅ Encourage sharing — have a show-and-tell at the end
            </li>
            <li>
              ✅ Remind everyone: it&apos;s about exploration, not perfection
            </li>
            <li>
              ✅ Pair beginners with experienced devs for collaborative vibes
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
