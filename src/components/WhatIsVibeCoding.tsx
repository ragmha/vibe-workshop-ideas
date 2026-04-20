export default function WhatIsVibeCoding() {
  const startingPoints = [
    {
      id: "ide",
      emoji: "🖥️",
      title: "Start from the IDE",
      subtitle: "VS Code / JetBrains / Xcode",
      steps: [
        "Install the GitHub Copilot extension",
        "Open a new project folder",
        "Press Shift+Tab to enter Plan mode — describe what you want to build",
        "Review the plan, then switch to Agent mode to let Copilot build it",
        "Use Autopilot for fully autonomous execution",
      ],
      link: "https://docs.github.com/en/copilot/using-github-copilot/using-copilot-coding-agent-in-your-ide",
      linkText: "IDE setup guide →",
    },
    {
      id: "cli",
      emoji: "⌨️",
      title: "Start from the CLI",
      subtitle: "Copilot CLI in your terminal",
      steps: [
        "Install Copilot CLI: npm install -g @github/copilot-cli",
        "Authenticate: copilot auth login",
        "Start with a plan: prefix your prompt with [[PLAN]]",
        "Approve the plan and let the agent implement it",
        "Use autopilot mode for hands-free execution",
      ],
      link: "https://docs.github.com/en/copilot/how-tos/copilot-cli/install-copilot-cli",
      linkText: "CLI setup guide →",
    },
    {
      id: "cloud",
      emoji: "☁️",
      title: "Start from the Cloud",
      subtitle: "Copilot on github.com",
      steps: [
        "Open any repository on github.com",
        "Assign a GitHub Issue to Copilot to work on",
        "Copilot creates a branch, writes code, and opens a PR",
        "Review the PR, request changes, or merge",
        "No local setup needed — runs entirely in the cloud",
      ],
      link: "https://docs.github.com/en/copilot/using-github-copilot/using-copilot-coding-agent-to-work-on-issues",
      linkText: "Cloud agent guide →",
    },
  ];

  const workflow = [
    {
      step: "1",
      name: "Plan",
      color: "accent-purple",
      description:
        "Describe what you want to build. Copilot creates a structured plan with architecture, files, and tasks.",
      hint: "Shift+Tab in VS Code · [[PLAN]] prefix in CLI",
    },
    {
      step: "2",
      name: "Agent",
      color: "accent-cyan",
      description:
        "Approve the plan and Copilot starts building — creating files, writing code, installing dependencies.",
      hint: "Default mode in VS Code · Normal mode in CLI",
    },
    {
      step: "3",
      name: "Autopilot",
      color: "accent-green",
      description:
        "Fully autonomous execution. Copilot builds without pausing for approval between steps.",
      hint: "Auto-approve in VS Code · Autopilot in CLI",
    },
  ];

  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto">
        {/* What is Vibe Coding */}
        <h2 className="text-2xl sm:text-3xl font-mono font-bold mb-4">
          🤔 What is Vibe Coding?
        </h2>

        <div className="mb-12">
          <p className="text-muted text-lg leading-relaxed">
            <strong className="text-foreground">Vibe coding</strong> is a style
            of programming where you describe what you want to build in natural
            language, and{" "}
            <strong className="text-accent-purple">GitHub Copilot</strong> helps
            you plan, write, and ship the code. Instead of typing every line
            yourself, you focus on the <em>what</em> — Copilot handles the{" "}
            <em>how</em>.
          </p>
          <p className="text-muted leading-relaxed mt-4">
            Modern vibe coding goes beyond chat. You start with a{" "}
            <strong className="text-foreground">plan</strong>, let the{" "}
            <strong className="text-foreground">agent</strong> execute it, and
            optionally go full{" "}
            <strong className="text-foreground">autopilot</strong> for
            autonomous development.
          </p>
        </div>

        {/* Workflow: Plan → Agent → Autopilot */}
        <h3 className="text-xl font-mono font-bold mb-6">
          🔄 The Vibe Coding Workflow
        </h3>
        <div className="grid gap-4 sm:grid-cols-3 mb-14">
          {workflow.map((w) => (
            <div
              key={w.step}
              className="relative p-5 rounded-xl border border-border bg-surface"
            >
              <div
                className={`text-3xl font-mono font-bold text-${w.color} mb-2`}
              >
                {w.step}.
              </div>
              <h4 className="font-mono font-bold text-lg mb-2">{w.name}</h4>
              <p className="text-sm text-muted leading-relaxed mb-3">
                {w.description}
              </p>
              <p className="text-xs font-mono text-muted/60">{w.hint}</p>
            </div>
          ))}
        </div>

        {/* Getting Started — 3 paths */}
        <h3 className="text-xl font-mono font-bold mb-6">
          🚀 Getting Started
        </h3>
        <p className="text-muted mb-6">
          Choose your starting point — GitHub Copilot works wherever you do.
        </p>

        <div className="grid gap-4 sm:grid-cols-3 mb-14">
          {startingPoints.map((sp) => (
            <div
              key={sp.id}
              className="p-5 rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors"
            >
              <div className="text-3xl mb-2">{sp.emoji}</div>
              <h4 className="font-mono font-bold mb-1">{sp.title}</h4>
              <p className="text-xs text-muted mb-4">{sp.subtitle}</p>
              <ol className="space-y-2 text-sm text-muted list-decimal list-inside">
                {sp.steps.map((step, i) => (
                  <li key={i} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
              <a
                href={sp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-sm text-accent-purple hover:underline font-mono"
              >
                {sp.linkText}
              </a>
            </div>
          ))}
        </div>

        {/* Awesome Copilot */}
        <div className="p-6 rounded-xl border border-accent-cyan/20 bg-accent-cyan/5 mb-14">
          <h3 className="font-mono font-bold mb-2 flex items-center gap-2">
            <span className="text-xl">⚡</span> Awesome Copilot
          </h3>
          <p className="text-sm text-muted leading-relaxed mb-4">
            Supercharge your workshop with community-contributed agents,
            instructions, skills, and hooks from the{" "}
            <a
              href="https://awesome-copilot.github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-cyan hover:underline"
            >
              Awesome Copilot
            </a>{" "}
            collection.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                name: "Agents",
                desc: "Custom agents for specialized tasks",
                href: "https://awesome-copilot.github.com/agents/",
              },
              {
                name: "Instructions",
                desc: "Coding standards & best practices",
                href: "https://awesome-copilot.github.com/instructions/",
              },
              {
                name: "Skills",
                desc: "Self-contained folders with resources",
                href: "https://awesome-copilot.github.com/skills/",
              },
              {
                name: "Hooks",
                desc: "Automation triggers & workflows",
                href: "https://awesome-copilot.github.com/hooks/",
              },
            ].map((r) => (
              <a
                key={r.name}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg border border-border bg-surface hover:bg-surface-hover transition-colors group"
              >
                <p className="font-mono font-bold text-sm group-hover:text-accent-cyan transition-colors">
                  {r.name}
                </p>
                <p className="text-xs text-muted mt-1">{r.desc}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Workshop tips */}
        <div className="p-6 rounded-xl border border-accent-purple/20 bg-accent-purple/5">
          <h3 className="font-mono font-bold mb-3">
            💡 Tips for Running a Vibe Coding Workshop
          </h3>
          <ul className="space-y-2 text-sm text-muted">
            <li>
              ✅ Have participants set up Copilot in their preferred environment{" "}
              <em>before</em> the workshop (IDE, CLI, or cloud)
            </li>
            <li>
              ✅ Demo the Plan → Agent → Autopilot workflow live in 5 minutes
            </li>
            <li>
              ✅ Use the random idea generator to give everyone a starting
              point
            </li>
            <li>
              ✅ Install relevant{" "}
              <a
                href="https://awesome-copilot.github.com/agents/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-purple hover:underline"
              >
                Awesome Copilot agents
              </a>{" "}
              to guide participants
            </li>
            <li>
              ✅ Encourage sharing — have a show-and-tell at the end
            </li>
            <li>
              ✅ Remind everyone: it&apos;s about exploration, not perfection
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
