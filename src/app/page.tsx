import { ProductsSection } from "@/features/products/components/ProductsSection";
import { PromoBanner } from "@/shared/layout/PromoBanner";

export default function Home() {
  return (
    <>
      <PromoBanner />
      <div className="mx-auto w-full max-w-[1280px] px-20 py-[50px]">
        <ProductsSection />
      </div>
    </>
  );
}
