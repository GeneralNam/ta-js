import { describe, it, expect } from "vitest";
import { calculateWMA } from "../src/wma";

describe("calculateWMA", () => {
  it("returns nulls for initial insufficient data", () => {
    const data = [1, 2];
    const period = 3;
    const result = calculateWMA(data, period);
    expect(result).toEqual([null, null]);
  });

  it("calculates correct WMA for period = 3", () => {
    const data = [1, 2, 3, 4, 5, 6];
    const period = 3;
    const result = calculateWMA(data, period);

    // 수작업 검증:
    // index 2: (3×3 + 2×2 + 1×1) / 6 = (9 + 4 + 1) / 6 = 14 / 6 ≈ 2.333...
    // index 3: (4×3 + 3×2 + 2×1) / 6 = 20 / 6 = 3.333...
    // index 4: (5×3 + 4×2 + 3×1) / 6 = 26 / 6 = 4.333...
    // index 5: (6×3 + 5×2 + 4×1) / 6 = 32 / 6 = 5.333...

    expect(result).toEqual([
      null,
      null,
      14 / 6, //
      20 / 6, //
      26 / 6, //
      32 / 6, //
    ]);
  });

  it("handles empty input", () => {
    const result = calculateWMA([], 3);
    expect(result).toEqual([]);
  });
});
