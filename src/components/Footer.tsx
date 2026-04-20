export default function Footer() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
        <p>
          Powered by{" "}
          <a
            href="https://github.com/features/copilot"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-purple hover:underline"
          >
            GitHub Copilot
          </a>{" "}
          — available in your IDE, CLI, and the cloud ✨
        </p>

        <div className="flex gap-6">
          <a
            href="https://awesome-copilot.github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Awesome Copilot
          </a>
          <a
            href="https://docs.github.com/en/copilot"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Docs
          </a>
          <a
            href="https://github.com/github/copilot-sdk"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            SDK
          </a>
        </div>
      </div>
    </footer>
  );
}
