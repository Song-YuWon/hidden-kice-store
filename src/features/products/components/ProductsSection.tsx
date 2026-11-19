"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useProducts } from "../hooks/useProducts";
import type { ProductFilter } from "../types/product";
import { FilterTabs } from "./FilterTabs";
import { Pagination } from "./Pagination";
import { ProductGrid } from "./ProductGrid";
import { ProductsSkeleton } from "./ProductsSkeleton";
import { SearchBar } from "./SearchBar";

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 300;
const VALID_FILTERS: ProductFilter[] = ["전체", "패스", "단품"];

function parseFilter(value: string | null): ProductFilter {
  return (VALID_FILTERS as string[]).includes(value ?? "") ? (value as ProductFilter) : "전체";
}

function parsePage(value: string | null): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export function ProductsSection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 검색어/필터/페이지는 URL 쿼리스트링이 기준값입니다.
  // 새로고침, 뒤로가기, 링크 공유를 해도 같은 화면이 다시 보이도록 하기 위해서입니다.
  const search = searchParams.get("q") ?? "";
  const filter = parseFilter(searchParams.get("filter"));
  const page = parsePage(searchParams.get("page"));

  const [searchInput, setSearchInput] = useState(search);

  // URL의 검색어(뒤로가기 등으로 바뀐 경우)와 입력창 상태를 렌더 중에 동기화합니다.
  // (useEffect에서 setState하면 리렌더가 한 번 더 발생해 React 공식 문서가 권장하지 않는 패턴입니다)
  const [prevSearch, setPrevSearch] = useState(search);
  if (search !== prevSearch) {
    setPrevSearch(search);
    setSearchInput(search);
  }

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchInput.trim();
      if (trimmed !== search) {
        updateParams({ q: trimmed || null, page: null });
      }
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const { data, isLoading, isError, error } = useProducts({
    search,
    filter,
    page,
    pageSize: PAGE_SIZE,
  });

  const handleFilterChange = (next: ProductFilter) => {
    updateParams({ filter: next === "전체" ? null : next, page: null });
  };

  const handlePageChange = (next: number) => {
    updateParams({ page: next === 1 ? null : String(next) });
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
          <ProductsSkeleton count={PAGE_SIZE} />
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
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </section>
  );
}
