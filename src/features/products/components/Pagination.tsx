"use client";

import Image from "next/image";

export function Pagination({
  page,
  pageSize,
  totalCount,
  onPageChange,
}: {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  if (totalPages <= 1) return null;

  const windowSize = 5;
  const start = Math.max(
    1,
    Math.min(page - Math.floor(windowSize / 2), totalPages - windowSize + 1),
  );
  const end = Math.min(totalPages, start + windowSize - 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="페이지네이션">
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="flex size-10 cursor-pointer items-center justify-center rounded-md border border-primary bg-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Image src="/icons/chevron-left.svg" alt="" width={20} height={20} />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={
            p === page
              ? "flex size-10 cursor-pointer items-center justify-center rounded-md bg-primary text-sm font-medium text-white"
              : "flex size-10 cursor-pointer items-center justify-center rounded-md border border-primary text-sm font-medium text-primary"
          }
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        aria-label="다음 페이지"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="flex size-10 cursor-pointer items-center justify-center rounded-md border border-primary bg-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Image src="/icons/chevron-right.svg" alt="" width={20} height={20} />
      </button>
    </nav>
  );
}
