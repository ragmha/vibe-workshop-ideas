"use client";

import { useState, useRef, useEffect } from "react";
import type { PlannerState, PlannerStep, GeneratedPlan } from "@/lib/planner";
import { PLAN_QUESTIONS, generatePlan } from "@/lib/planner";
import { copyToClipboard } from "@/lib/utils";

const STEP_ORDER: PlannerStep[] = [
  "idea",
  "goal",
  "style",
  "audience",
  "priority",
  "result",
];

function stepIndex(step: PlannerStep): number {
  return STEP_ORDER.indexOf(step);
}

export default function PlannerPage() {
  const [state, setState] = useState<PlannerState>({
    step: "idea",
    idea: "",
    goal: "",
    style: "",
    audience: "",
    priority: "",
  });
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.step]);

  useEffect(() => {
    if (state.step === "idea") inputRef.current?.focus();
  }, [state.step]);

  const currentStepIdx = stepIndex(state.step);
  const progress =
    state.step === "result" ? 100 : (currentStepIdx / (STEP_ORDER.length - 1)) * 100;

  function submitIdea(e: React.FormEvent) {
    e.preventDefault();
    if (!state.idea.trim()) return;
    setState((s) => ({ ...s, step: "goal" }));
  }

  function selectOption(field: string, value: string) {
    const next = STEP_ORDER[stepIndex(state.step as PlannerStep) + 1];
    const updated = { ...state, [field]: value, step: next };
    setState(updated);
    if (next === "result") {
      setPlan(generatePlan(updated));
    }
  }

  function goBack() {
    const prev = STEP_ORDER[currentStepIdx - 1];
    if (prev) setState((s) => ({ ...s, step: prev }));
  }

  function startOver() {
    setState({ step: "idea", idea: "", goal: "", style: "", audience: "", priority: "" });
    setPlan(null);
  }

  async function handleCopy() {
    if (!plan) return;
    const ok = await copyToClipboard(plan.vibePrompt);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-mono font-bold mb-2">
          <span className="text-gradient">Plan your project</span>
        </h1>
        <p className="text-muted">
          Describe what you want to build — no technical knowledge needed.
          We&apos;ll create a plan you can hand to GitHub Copilot.
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between text-xs text-muted font-mono mb-2">
          <span>
            Step {Math.min(currentStepIdx + 1, STEP_ORDER.length - 1)} of{" "}
            {STEP_ORDER.length - 1}
          </span>
          {currentStepIdx > 0 && state.step !== "result" && (
            <button onClick={goBack} className="text-accent-purple hover:underline">
              ← Back
            </button>
          )}
        </div>
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-purple to-accent-cyan rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Chat-like conversation history */}
      <div className="space-y-6 mb-8">
        {/* Step: Idea */}
        {currentStepIdx >= 0 && (
          <div className="animate-card-in">
            <div className="chat-bubble-system">
              <p className="font-bold mb-1">
                💡 What do you want to build?
              </p>
              <p className="text-sm text-muted">
                Describe your idea in everyday words. For example: &quot;a pet
                sitting service&quot;, &quot;a birthday party planner&quot;, or
                &quot;a school homework tracker&quot;.
              </p>
            </div>
            {state.step === "idea" ? (
              <form onSubmit={submitIdea} className="mt-3">
                <div className="flex gap-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={state.idea}
                    onChange={(e) =>
                      setState((s) => ({ ...s, idea: e.target.value }))
                    }
                    placeholder="I want to build..."
                    className="flex-1 bg-surface border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent-purple/50 font-mono"
                  />
                  <button
                    type="submit"
                    disabled={!state.idea.trim()}
                    className="px-6 py-3 rounded-xl bg-accent-purple text-white font-mono font-bold disabled:opacity-30 hover:bg-accent-purple/90 transition-colors"
                  >
                    Next →
                  </button>
                </div>
              </form>
            ) : (
              <div className="chat-bubble-user mt-3">
                <p className="font-mono">{state.idea}</p>
              </div>
            )}
          </div>
        )}

        {/* Structured questions */}
        {PLAN_QUESTIONS.map((q) => {
          const qIdx = stepIndex(q.id);
          if (currentStepIdx < qIdx) return null;
          const answered = state[q.id as keyof PlannerState] as string;

          return (
            <div key={q.id} className="animate-card-in">
              <div className="chat-bubble-system">
                <p className="font-bold mb-1">{q.question}</p>
                <p className="text-sm text-muted">{q.subtitle}</p>
              </div>

              {state.step === q.id ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {q.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => selectOption(q.id, opt.value)}
                      className="flex items-start gap-3 p-4 rounded-xl border border-border bg-surface hover:bg-surface-hover hover:border-accent-purple/50 transition-all text-left group"
                    >
                      <span className="text-2xl">{opt.emoji}</span>
                      <div>
                        <p className="font-mono font-bold text-sm group-hover:text-accent-purple transition-colors">
                          {opt.label}
                        </p>
                        <p className="text-xs text-muted mt-0.5">
                          {opt.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : answered ? (
                <div className="chat-bubble-user mt-3">
                  <p className="font-mono">
                    {q.options.find((o) => o.value === answered)?.emoji}{" "}
                    {q.options.find((o) => o.value === answered)?.label}
                  </p>
                </div>
              ) : null}
            </div>
          );
        })}

        {/* Generated plan */}
        {state.step === "result" && plan && (
          <div className="animate-card-in space-y-6">
            <div className="chat-bubble-system">
              <p className="font-bold text-lg mb-1">
                🎉 Your plan is ready!
              </p>
              <p className="text-sm text-muted">
                Here&apos;s a structured plan for{" "}
                <strong className="text-foreground">{state.idea}</strong>.
                Copy the vibe prompt and paste it into GitHub Copilot to start
                building.
              </p>
            </div>

            {/* Plan summary */}
            <div className="p-6 rounded-xl border border-border bg-surface space-y-6">
              <div>
                <h3 className="font-mono font-bold text-lg mb-1">
                  {plan.projectName}
                </h3>
                <p className="text-muted text-sm">{plan.summary}</p>
              </div>

              <div>
                <h4 className="font-mono font-bold text-sm text-muted uppercase tracking-wider mb-2">
                  Approach
                </h4>
                <p className="text-sm leading-relaxed">{plan.approach}</p>
              </div>

              {/* Phases */}
              {plan.phases.map((phase) => (
                <div key={phase.name}>
                  <h4 className="font-mono font-bold mb-2">{phase.name}</h4>
                  <p className="text-xs text-muted mb-2">
                    {phase.description}
                  </p>
                  <ul className="space-y-1">
                    {phase.items.map((item, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted flex items-start gap-2"
                      >
                        <span className="text-accent-green mt-0.5">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Vibe prompt — the main output */}
            <div className="p-6 rounded-xl border-2 border-accent-purple/30 bg-accent-purple/5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-mono font-bold text-sm uppercase tracking-wider text-accent-purple">
                  Your Vibe Prompt
                </h4>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-accent-purple text-white text-sm font-mono font-bold hover:bg-accent-purple/90 transition-colors"
                >
                  {copied ? "✓ Copied!" : "📋 Copy prompt"}
                </button>
              </div>
              <p className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {plan.vibePrompt}
              </p>
            </div>

            {/* Exercise steps */}
            <div className="p-6 rounded-xl border border-border bg-surface">
              <h4 className="font-mono font-bold mb-4 flex items-center gap-2">
                <span>📋</span> Workshop Exercise Steps
              </h4>
              <p className="text-xs text-muted mb-4">
                Follow these steps in your workshop — use the{" "}
                <a
                  href="https://github.com/skills/exercise-toolkit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-cyan hover:underline"
                >
                  exercise-toolkit
                </a>{" "}
                and{" "}
                <a
                  href="https://github.com/skills/exercise-creator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-cyan hover:underline"
                >
                  exercise-creator
                </a>{" "}
                to turn this into a guided GitHub Skills exercise.
              </p>
              <div className="space-y-4">
                {plan.exerciseSteps.map((step) => (
                  <div key={step.number} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent-purple/10 text-accent-purple flex items-center justify-center font-mono font-bold text-sm shrink-0">
                      {step.number}
                    </div>
                    <div>
                      <p className="font-mono font-bold text-sm">
                        {step.title}
                      </p>
                      <p className="text-xs text-muted mt-0.5">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How to start */}
            <div className="p-6 rounded-xl border border-accent-cyan/20 bg-accent-cyan/5">
              <h4 className="font-mono font-bold mb-4">🚀 Start building</h4>
              <div className="grid gap-3 sm:grid-cols-3">
                <a
                  href="https://docs.github.com/en/copilot/using-github-copilot/using-copilot-coding-agent-in-your-ide"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-lg border border-border bg-surface hover:bg-surface-hover transition-colors text-center group"
                >
                  <p className="text-2xl mb-1">🖥️</p>
                  <p className="font-mono font-bold text-sm group-hover:text-accent-cyan transition-colors">
                    Open in IDE
                  </p>
                  <p className="text-xs text-muted mt-1">
                    Paste prompt into Copilot Agent
                  </p>
                </a>
                <a
                  href="https://docs.github.com/en/copilot/how-tos/copilot-cli/install-copilot-cli"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-lg border border-border bg-surface hover:bg-surface-hover transition-colors text-center group"
                >
                  <p className="text-2xl mb-1">⌨️</p>
                  <p className="font-mono font-bold text-sm group-hover:text-accent-cyan transition-colors">
                    Use the CLI
                  </p>
                  <p className="text-xs text-muted mt-1">
                    Run with [[PLAN]] prefix
                  </p>
                </a>
                <a
                  href="https://docs.github.com/en/copilot/using-github-copilot/using-copilot-coding-agent-to-work-on-issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-lg border border-border bg-surface hover:bg-surface-hover transition-colors text-center group"
                >
                  <p className="text-2xl mb-1">☁️</p>
                  <p className="font-mono font-bold text-sm group-hover:text-accent-cyan transition-colors">
                    Cloud Agent
                  </p>
                  <p className="text-xs text-muted mt-1">
                    Assign to Copilot on github.com
                  </p>
                </a>
              </div>
            </div>

            {/* Copilot resources */}
            {plan.copilotResources.length > 0 && (
              <details className="rounded-xl border border-border bg-surface">
                <summary className="px-6 py-4 cursor-pointer font-mono font-bold text-sm text-muted hover:text-foreground transition-colors">
                  ⚡ Recommended Copilot agents & instructions (optional)
                </summary>
                <div className="px-6 pb-4 space-y-2">
                  {plan.copilotResources.map((r) => (
                    <a
                      key={r.name}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-hover transition-colors"
                    >
                      <span className="text-xs px-2 py-0.5 rounded bg-accent-purple/10 text-accent-purple font-mono">
                        {r.type}
                      </span>
                      <div>
                        <p className="text-sm font-bold">{r.name}</p>
                        <p className="text-xs text-muted">{r.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </details>
            )}

            {/* Start over */}
            <div className="text-center">
              <button
                onClick={startOver}
                className="text-sm text-muted hover:text-accent-purple transition-colors font-mono"
              >
                ← Plan something else
              </button>
            </div>
          </div>
        )}
      </div>

      <div ref={bottomRef} />
    </div>
  );
}
