"use client";

import { useState, useCallback } from "react";
import type { Idea } from "@/types/idea";
import IdeaCard from "./IdeaCard";
import SlotMachine from "./SlotMachine";

interface HeroProps {
  ideas: Idea[];
}

export default function Hero({ ideas }: HeroProps) {
  const [currentIdea, setCurrentIdea] = useState<Idea | null>(null);
  const [key, setKey] = useState(0);

  const handleLand = useCallback((idea: Idea) => {
    setCurrentIdea(idea);
    setKey((k) => k + 1);
  }, []);

  return (
    <section className="relative py-16 sm:py-24">
      {/* Heading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-6xl font-mono font-bold mb-4">
          <span className="text-gradient">vibe coding</span>
          <br />
          <span className="text-foreground">workshop ideas</span>
        </h1>
        <p className="text-muted text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
          Pull the lever. Get an idea. Start building with{" "}
          <span className="text-accent-purple">GitHub Copilot</span> and vibes
          only.
        </p>
      </div>

      {/* Slot machine */}
      <SlotMachine ideas={ideas} onLand={handleLand} />

      {/* Landed idea card */}
      {currentIdea && (
        <div className="max-w-2xl mx-auto mt-10" key={key}>
          <IdeaCard idea={currentIdea} featured />
        </div>
      )}
    </section>
  );
}
