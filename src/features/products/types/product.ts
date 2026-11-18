export type ProductType = "단품" | "패스";

export type ProductFilter = "전체" | ProductType;

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  price: number;
  discount_rate: number;
  image_url: string;
  created_at: string;
}

export interface ProductListParams {
  search: string;
  filter: ProductFilter;
  page: number;
  pageSize: number;
}

export interface ProductListResult {
  items: Product[];
  totalCount: number;
}
