"use client";

import type { Idea } from "@/types/idea";
import {
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
  DURATION_LABELS,
} from "@/types/idea";
import { copyToClipboard } from "@/lib/utils";
import { useState } from "react";

interface IdeaCardProps {
  idea: Idea;
  featured?: boolean;
}

export default function IdeaCard({ idea, featured = false }: IdeaCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(featured);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await copyToClipboard(idea.vibePrompt);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`
        rounded-xl border border-border bg-surface hover:bg-surface-hover
        transition-all duration-200
        ${featured ? "glow-purple p-6 sm:p-8" : "p-4 sm:p-5 cursor-pointer"}
        ${featured ? "animate-card-in" : ""}
      `}
      onClick={() => !featured && setExpanded(!expanded)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3
          className={`font-mono font-bold ${featured ? "text-xl sm:text-2xl" : "text-base sm:text-lg"}`}
        >
          {idea.title}
        </h3>
        {idea.source === "ai" && (
          <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
            AI
          </span>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="text-xs px-2 py-1 rounded-md bg-accent-purple/10 text-accent-purple">
          {CATEGORY_LABELS[idea.category]}
        </span>
        <span className="text-xs px-2 py-1 rounded-md bg-accent-green/10 text-accent-green">
          {DIFFICULTY_LABELS[idea.difficulty]}
        </span>
        <span className="text-xs px-2 py-1 rounded-md bg-accent-cyan/10 text-accent-cyan">
          {DURATION_LABELS[idea.duration]}
        </span>
      </div>

      {/* Description */}
      <p className="text-muted text-sm leading-relaxed mb-4">
        {idea.description}
      </p>

      {/* Expanded content */}
      {(expanded || featured) && (
        <div className="space-y-4">
          {/* Vibe prompt */}
          <div className="rounded-lg bg-background p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">
                Vibe Prompt
              </span>
              <button
                onClick={handleCopy}
                className="text-xs px-2 py-1 rounded bg-accent-purple/10 text-accent-purple hover:bg-accent-purple/20 transition-colors"
              >
                {copied ? "✓ Copied!" : "📋 Copy"}
              </button>
            </div>
            <p className="text-sm leading-relaxed font-mono text-foreground/90">
              {idea.vibePrompt}
            </p>
          </div>

          {/* Tools */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted">Tools:</span>
            {idea.tools.map((tool) => (
              <span
                key={tool}
                className="text-xs px-2 py-0.5 rounded bg-accent-pink/10 text-accent-pink"
              >
                {tool}
              </span>
            ))}
          </div>

          {/* Tags */}
          {idea.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {idea.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-border text-muted"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Expand hint */}
      {!featured && !expanded && (
        <p className="text-xs text-muted mt-2">Click to see the vibe prompt →</p>
      )}
    </div>
  );
}
