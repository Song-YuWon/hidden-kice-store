"use client";

import type { ProductFilter } from "../types/product";

const FILTERS: ProductFilter[] = ["전체", "패스", "단품"];

export function FilterTabs({
  value,
  onChange,
}: {
  value: ProductFilter;
  onChange: (filter: ProductFilter) => void;
}) {
  return (
    <div className="flex items-center gap-[11px]">
      {FILTERS.map((filter, index) => (
        <div key={filter} className="flex items-center gap-[11px]">
          {index > 0 && <span className="text-base font-semibold text-gray-300">|</span>}
          <button
            type="button"
            onClick={() => onChange(filter)}
            aria-pressed={value === filter}
            className={
              value === filter
                ? "cursor-pointer text-base font-semibold text-gray-800"
                : "cursor-pointer text-base font-semibold text-gray-300 transition-colors hover:text-gray-800"
            }
          >
            {filter}
          </button>
        </div>
      ))}
    </div>
  );
}
