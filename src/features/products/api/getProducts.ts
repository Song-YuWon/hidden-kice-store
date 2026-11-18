import { supabase } from "@/lib/supabase/client";
import type { ProductListParams, ProductListResult } from "../types/product";

export async function getProducts({
  search,
  filter,
  page,
  pageSize,
}: ProductListParams): Promise<ProductListResult> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filter !== "전체") {
    query = query.eq("type", filter);
  }

  const trimmedSearch = search.trim();
  if (trimmedSearch) {
    query = query.ilike("name", `%${trimmedSearch}%`);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    items: data ?? [],
    totalCount: count ?? 0,
  };
}
