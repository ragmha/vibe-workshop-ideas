"use client";

import type { IdeaFilters } from "@/lib/utils";
import {
  CATEGORIES,
  DIFFICULTIES,
  DURATIONS,
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
  DURATION_LABELS,
} from "@/types/idea";

interface FilterBarProps {
  filters: IdeaFilters;
  onChange: (filters: IdeaFilters) => void;
  totalCount: number;
  filteredCount: number;
}

export default function FilterBar({
  filters,
  onChange,
  totalCount,
  filteredCount,
}: FilterBarProps) {
  const update = (partial: Partial<IdeaFilters>) =>
    onChange({ ...filters, ...partial });

  const selectClass =
    "bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple/50 appearance-none cursor-pointer";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search ideas..."
          value={filters.search || ""}
          onChange={(e) => update({ search: e.target.value })}
          className="flex-1 min-w-[200px] bg-surface border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
        />

        {/* Category */}
        <select
          value={filters.category || "all"}
          onChange={(e) => update({ category: e.target.value as IdeaFilters["category"] })}
          className={selectClass}
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>

        {/* Difficulty */}
        <select
          value={filters.difficulty || "all"}
          onChange={(e) =>
            update({ difficulty: e.target.value as IdeaFilters["difficulty"] })
          }
          className={selectClass}
        >
          <option value="all">All Levels</option>
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>
              {DIFFICULTY_LABELS[d]}
            </option>
          ))}
        </select>

        {/* Duration */}
        <select
          value={filters.duration || "all"}
          onChange={(e) =>
            update({ duration: e.target.value as IdeaFilters["duration"] })
          }
          className={selectClass}
        >
          <option value="all">Any Duration</option>
          {DURATIONS.map((d) => (
            <option key={d} value={d}>
              {DURATION_LABELS[d]}
            </option>
          ))}
        </select>

        {/* Source */}
        <select
          value={filters.source || "all"}
          onChange={(e) =>
            update({ source: e.target.value as IdeaFilters["source"] })
          }
          className={selectClass}
        >
          <option value="all">All Sources</option>
          <option value="curated">✍️ Curated</option>
          <option value="ai">🤖 AI Generated</option>
        </select>
      </div>

      {/* Result count */}
      <p className="text-sm text-muted">
        Showing {filteredCount} of {totalCount} ideas
        {filters.search && (
          <button
            onClick={() => update({ search: "", category: "all", difficulty: "all", duration: "all", source: "all" })}
            className="ml-2 text-accent-purple hover:underline"
          >
            Clear filters
          </button>
        )}
      </p>
    </div>
  );
}
