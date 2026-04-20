export default function Footer() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
        <p>
          Built with{" "}
          <a
            href="https://github.com/github/copilot-sdk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-purple hover:underline"
          >
            GitHub Copilot SDK
          </a>{" "}
          ✨
        </p>

        <div className="flex gap-6">
          <a
            href="https://github.com/features/copilot"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub Copilot
          </a>
          <a
            href="https://block.github.io/goose/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Goose
          </a>
          <a
            href="https://ollama.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Ollama
          </a>
        </div>
      </div>
    </footer>
  );
}
