import { describe, it, expect } from "vitest";
import { calculateEMA } from "../src/ema";

describe("calculateEMA", () => {
  it("should return all nulls if data is shorter than period", () => {
    const data = [100, 101];
    const period = 5;
    const result = calculateEMA(data, period);
    expect(result).toEqual([null, null]);
  });

  it("should return correct EMA values", () => {
    const data = [100, 102, 104, 106, 108];
    const period = 3;
    const result = calculateEMA(data, period);

    // 설명용 계산 흐름
    // SMA 초기값 = (100+102+104)/3 = 102
    // EMA(3) = α * 가격 + (1-α) * 이전 EMA
    // α = 2 / (3 + 1) = 0.5
    // next: 106 * 0.5 + 102 * 0.5 = 104
    // next: 108 * 0.5 + 104 * 0.5 = 106

    expect(result).toEqual([
      null,
      null,
      null, // 초기 null
      102, // 초기 SMA
      104, // EMA1
      106, // EMA2
    ]);
  });

  it("should handle empty input", () => {
    const result = calculateEMA([], 3);
    expect(result).toEqual([]);
  });
});
