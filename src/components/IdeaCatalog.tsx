"use client";

import { useState, useMemo } from "react";
import type { Idea } from "@/types/idea";
import type { IdeaFilters } from "@/lib/utils";
import { filterIdeas } from "@/lib/utils";
import IdeaCard from "./IdeaCard";
import FilterBar from "./FilterBar";

interface IdeaCatalogProps {
  ideas: Idea[];
}

export default function IdeaCatalog({ ideas }: IdeaCatalogProps) {
  const [filters, setFilters] = useState<IdeaFilters>({
    category: "all",
    difficulty: "all",
    duration: "all",
    source: "all",
    search: "",
  });

  const filtered = useMemo(() => filterIdeas(ideas, filters), [ideas, filters]);

  return (
    <section className="py-12">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-mono font-bold mb-2">
          📚 Browse All Ideas
        </h2>
        <p className="text-muted">
          Filter and explore the full catalog of workshop ideas.
        </p>
      </div>

      <FilterBar
        filters={filters}
        onChange={setFilters}
        totalCount={ideas.length}
        filteredCount={filtered.length}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {filtered.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-muted text-lg">
            No ideas match your filters. Try broadening your search!
          </p>
        </div>
      )}
    </section>
  );
}
