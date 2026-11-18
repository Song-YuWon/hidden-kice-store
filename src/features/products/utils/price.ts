export function getDiscountedPrice(price: number, discountRate: number): number {
  if (discountRate <= 0) return price;
  return Math.round((price * (100 - discountRate)) / 100 / 10) * 10;
}

export function formatKrw(value: number): string {
  return `${value.toLocaleString("ko-KR")}원`;
}
