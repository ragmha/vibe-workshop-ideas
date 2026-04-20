import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✨</span>
          <span className="font-mono font-bold text-lg text-gradient">
            vibe workshop ideas
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://awesome-copilot.github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-foreground transition-colors hidden sm:block"
          >
            Awesome Copilot
          </a>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
