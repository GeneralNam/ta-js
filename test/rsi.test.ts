import { describe, it, expect } from "vitest";
import { calculateRSI } from "../src/rsi";

describe("calculateRSI", () => {
  it("returns all nulls if data is shorter than period", () => {
    const data = [100, 101, 102];
    const result = calculateRSI(data, 14);
    expect(result).toEqual([null, null, null]);
  });

  it("calculates RSI when all prices go up", () => {
    const data = Array.from({ length: 20 }, (_, i) => 100 + i); // [100, 101, ..., 119]
    const result = calculateRSI(data, 14);

    for (let i = 0; i < result.length; i++) {
      if (i < 14) expect(result[i]).toBeNull();
      else expect(result[i]).toBeCloseTo(100, 5);
    }
  });

  it("calculates RSI when all prices go down", () => {
    const data = Array.from({ length: 20 }, (_, i) => 120 - i); // [120, 119, ..., 101]
    const result = calculateRSI(data, 14);

    for (let i = 0; i < result.length; i++) {
      if (i < 14) expect(result[i]).toBeNull(); // 0~13: null
      else expect(result[i]).toBeCloseTo(0, 5); // 14부터는 0
    }
  });

  it("handles empty input", () => {
    const result = calculateRSI([], 14);
    expect(result).toEqual([]);
  });
});
