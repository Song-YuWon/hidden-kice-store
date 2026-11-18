"use client";

import { useEffect, useState } from "react";
import { useProducts } from "../hooks/useProducts";
import type { ProductFilter } from "../types/product";
import { FilterTabs } from "./FilterTabs";
import { Pagination } from "./Pagination";
import { ProductGrid } from "./ProductGrid";
import { SearchBar } from "./SearchBar";

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 300;

export function ProductsSection() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ProductFilter>("전체");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError, error } = useProducts({
    search,
    filter,
    page,
    pageSize: PAGE_SIZE,
  });

  const handleFilterChange = (next: ProductFilter) => {
    setFilter(next);
    setPage(1);
  };

  return (
    <section className="flex flex-col gap-9">
      <div className="flex flex-wrap items-center justify-end gap-[17px]">
        <SearchBar value={searchInput} onChange={setSearchInput} />
        <FilterTabs value={filter} onChange={handleFilterChange} />
      </div>

      <div className="flex flex-col gap-[46px]">
        {isError ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center gap-2 text-gray-500">
            <p className="text-base font-semibold">상품을 불러오지 못했습니다.</p>
            <p className="text-sm">
              {error instanceof Error ? error.message : "잠시 후 다시 시도해주세요."}
            </p>
          </div>
        ) : isLoading && !data ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-[93px]">
            {Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <div key={index} className="flex animate-pulse flex-col gap-2">
                <div className="h-[320px] w-full rounded-md bg-gray-50" />
                <div className="h-4 w-16 rounded bg-gray-50" />
                <div className="h-5 w-full rounded bg-gray-50" />
                <div className="h-5 w-24 rounded bg-gray-50" />
              </div>
            ))}
          </div>
        ) : data && data.items.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center gap-2 text-gray-500">
            <p className="text-base font-semibold">검색 결과가 없습니다.</p>
            <p className="text-sm">다른 검색어나 필터를 사용해보세요.</p>
          </div>
        ) : (
          <ProductGrid products={data?.items ?? []} />
        )}

        {data && data.totalCount > 0 && (
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            totalCount={data.totalCount}
            onPageChange={setPage}
          />
        )}
      </div>
    </section>
  );
}
