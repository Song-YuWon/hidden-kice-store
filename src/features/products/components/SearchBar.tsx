"use client";

import Image from "next/image";

export function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex w-[250px] items-center gap-2 rounded-md border border-gray-100 p-2">
      <Image src="/icons/search.svg" alt="" width={20} height={20} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="검색"
        aria-label="교재 검색"
        className="w-full min-w-0 flex-1 bg-transparent text-base font-semibold text-gray-800 placeholder:text-gray-300 focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="검색어 지우기"
          className="shrink-0 cursor-pointer"
        >
          <Image src="/icons/x.svg" alt="" width={16} height={16} />
        </button>
      )}
    </div>
  );
}
