"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Figma에서 내보낼 수 있는 배너 이미지가 1장뿐이라 더미로 5번 반복 사용합니다.
// 슬라이드 이미지가 늘어나면 SLIDES 배열만 교체하면 되도록 렌더링 로직과 분리했습니다.
const SLIDES = [
  "/images/banner-1.webp",
  "/images/banner-1.webp",
  "/images/banner-1.webp",
  "/images/banner-1.webp",
  "/images/banner-1.webp",
];

const AUTO_SLIDE_INTERVAL_MS = 4000;

export function PromoBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, AUTO_SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[490px] w-full overflow-hidden border-b border-[#e5e5e5] bg-[#f2f5f8]">
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {SLIDES.map((src, i) => (
          <div key={i} className="relative h-full w-full shrink-0">
            <Image
              src={src}
              alt={`프로모션 배너 ${i + 1}`}
              fill
              priority={i === 0}
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <span className="absolute bottom-[29px] right-[80px] flex items-center justify-center rounded-full bg-black/30 px-[10px] py-1 text-sm font-semibold text-white">
        {index + 1}
        <span className="font-medium">/{SLIDES.length}</span>
      </span>
    </section>
  );
}
