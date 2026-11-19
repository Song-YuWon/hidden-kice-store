"use client";

import Image from "next/image";
import { useState } from "react";

// Figma에서 내보낸 배너 배경 이미지가 1장뿐이라 더미로 5번 반복 사용합니다.
// 슬라이드 수가 늘어나도 SLIDES 배열만 교체하면 되도록 구조를 분리했습니다.
const SLIDES = [
  "/images/banner-1.png",
  "/images/banner-1.png",
  "/images/banner-1.png",
  "/images/banner-1.png",
  "/images/banner-1.png",
];

export function PromoBanner() {
  const [index, setIndex] = useState(0);

  return (
    <section className="relative h-[490px] w-full overflow-hidden border-b border-[#e5e5e5] bg-[#f2f5f8]">
      <Image
        src={SLIDES[index]}
        alt={`프로모션 배너 ${index + 1}`}
        fill
        priority
        className="object-cover"
      />
      <button
        type="button"
        onClick={() => setIndex((prev) => (prev + 1) % SLIDES.length)}
        aria-label="다음 배너 보기"
        className="absolute bottom-[29px] right-[80px] flex cursor-pointer items-center justify-center rounded-full bg-black/30 px-[10px] py-1 text-sm font-semibold text-white"
      >
        {index + 1}
        <span className="font-medium">/{SLIDES.length}</span>
      </button>
    </section>
  );
}
