"use client";

import type { Idea } from "@/types/idea";
import {
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
  DURATION_LABELS,
  AUDIENCE_LABELS,
} from "@/types/idea";
import { copyToClipboard } from "@/lib/utils";
import { generateSteps } from "@/lib/steps";
import { useState, useMemo } from "react";

interface IdeaCardProps {
  idea: Idea;
  featured?: boolean;
}

export default function IdeaCard({ idea, featured = false }: IdeaCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(featured);
  const steps = useMemo(() => generateSteps(idea), [idea]);

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
        <span className="text-xs px-2 py-1 rounded-md bg-accent-pink/10 text-accent-pink">
          {AUDIENCE_LABELS[idea.audience]}
        </span>
      </div>

      {/* Description */}
      <p className="text-muted text-sm leading-relaxed mb-4">
        {idea.description}
      </p>

      {/* Expanded: step-by-step guide */}
      {(expanded || featured) && (
        <div className="space-y-5">
          {/* Step-by-step guide */}
          <div>
            <h4 className="font-mono font-bold text-sm mb-4 text-accent-purple">
              📍 Step-by-step guide
            </h4>
            <div className="space-y-4">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-accent-purple/10 text-accent-purple flex items-center justify-center font-mono font-bold text-sm shrink-0">
                      {step.emoji}
                    </div>
                    {step.number < steps.length && (
                      <div className="w-0.5 flex-1 bg-border mt-1" />
                    )}
                  </div>
                  <div className="pb-2">
                    <p className="font-mono font-bold text-sm">
                      Step {step.number}: {step.title}
                    </p>
                    <p className="text-xs text-muted mt-1 leading-relaxed">
                      {step.description}
                    </p>
                    {step.action && (
                      <p className="text-xs text-accent-cyan font-mono mt-1.5">
                        {step.action}
                      </p>
                    )}
                    {/* Show vibe prompt inline at step 2 */}
                    {step.number === 2 && (
                      <div className="mt-3 rounded-lg bg-background p-4 border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono text-muted uppercase tracking-wider">
                            Your Vibe Prompt
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
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted">Recommended tools:</span>
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
        <p className="text-xs text-muted mt-2">
          Click for step-by-step guide →
        </p>
      )}
    </div>
  );
}
