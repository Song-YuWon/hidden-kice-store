"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/getProducts";
import type { ProductListParams } from "../types/product";

export function useProducts(params: ProductListParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
    placeholderData: keepPreviousData,
  });
}
