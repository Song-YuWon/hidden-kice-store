import { describe, expect, it } from "vitest";
import { formatKrw, getDiscountedPrice } from "./price";

describe("getDiscountedPrice", () => {
  it("할인율이 0이면 정가를 그대로 반환한다", () => {
    expect(getDiscountedPrice(40000, 0)).toBe(40000);
  });

  it("할인율만큼 할인된 가격을 10원 단위로 반올림해 반환한다", () => {
    expect(getDiscountedPrice(76000, 5)).toBe(72200);
    expect(getDiscountedPrice(76000, 15)).toBe(64600);
  });

  it("음수 할인율은 할인하지 않은 것으로 취급한다", () => {
    expect(getDiscountedPrice(40000, -10)).toBe(40000);
  });
});

describe("formatKrw", () => {
  it("천 단위 콤마와 '원'을 붙여 반환한다", () => {
    expect(formatKrw(40000)).toBe("40,000원");
    expect(formatKrw(0)).toBe("0원");
  });
});
