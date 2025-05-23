import { describe, it, expect } from "vitest";
import { calculateSMA } from "../src/sma";

describe("calculateSMA", () => {
  it("returns correct SMA", () => {
    const result = calculateSMA([1, 2, 3, 4, 5], 3);
    expect(result).toEqual([null, null, 2, 3, 4]);
  });
});
