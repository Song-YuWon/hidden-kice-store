import { Suspense } from "react";
import { ProductsSection } from "@/features/products/components/ProductsSection";
import { ProductsSkeleton } from "@/features/products/components/ProductsSkeleton";
import { PromoBanner } from "@/shared/layout/PromoBanner";

export default function Home() {
  return (
    <>
      <PromoBanner />
      <div className="mx-auto w-full max-w-[1280px] px-20 py-[50px]">
        <Suspense fallback={<ProductsSkeleton />}>
          <ProductsSection />
        </Suspense>
      </div>
    </>
  );
}
