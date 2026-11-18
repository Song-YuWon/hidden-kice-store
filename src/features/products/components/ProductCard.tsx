import Image from "next/image";
import type { Product } from "../types/product";
import { formatKrw, getDiscountedPrice } from "../utils/price";

export function ProductCard({ product }: { product: Product }) {
  const isPass = product.type === "패스";
  const discountedPrice = isPass
    ? getDiscountedPrice(product.price, product.discount_rate)
    : product.price;

  return (
    <article className="flex flex-col gap-1">
      <div className="relative h-[320px] w-full overflow-hidden rounded-md border border-gray-50 bg-white">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 250px, 25vw"
          className="object-contain"
        />
      </div>
      <div className="flex flex-col">
        <p className="text-base font-semibold text-gray-300">{product.type}</p>
        <div className="flex flex-col gap-2 pt-1">
          <p className="text-base font-semibold text-gray-800">{product.name}</p>
          {isPass ? (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-200 line-through">
                {formatKrw(product.price)}
              </span>
              <span className="flex items-center gap-1.5 text-base font-semibold">
                <span className="text-secondary">{product.discount_rate}%</span>
                <span className="text-gray-800">{formatKrw(discountedPrice)}</span>
              </span>
            </div>
          ) : (
            <span className="text-base font-semibold text-gray-800">
              {formatKrw(product.price)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
