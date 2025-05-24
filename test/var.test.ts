import { describe, it, expect } from "vitest";
import { calculateVAR } from "../src/var";

describe("calculateVAR", () => {
    // 기본 분산 계산 테스트
    it("calculates variance correctly", () => {
        const data = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
        const period = 5;
        const result = calculateVAR(data, period);

        // 초기 period-1 기간은 null
        for (let i = 0; i < period - 1; i++) {
            expect(result[i]).toBeNull();
        }

        // 모든 분산 값이 0 이상
        for (let i = period - 1; i < result.length; i++) {
            if (result[i] !== null) {
                expect(result[i]).toBeGreaterThanOrEqual(0);
            }
        }
    });

    // 동일한 값들의 분산은 0
    it("returns 0 for identical values", () => {
        const data = Array(10).fill(100);
        const period = 5;
        const result = calculateVAR(data, period);

        for (let i = period - 1; i < result.length; i++) {
            expect(result[i]).toBe(0);
        }
    });

    // 빈 입력 처리 테스트
    it("handles empty input array", () => {
        const result = calculateVAR([]);
        expect(result).toEqual([]);
    });

    // 변동성이 높은 데이터의 분산
    it("shows higher variance for volatile data", () => {
        const volatileData = [100, 80, 120, 90, 110, 75, 125, 85, 115, 95];
        const stableData = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109];
        const period = 5;

        const volatileResult = calculateVAR(volatileData, period);
        const stableResult = calculateVAR(stableData, period);

        const volatileVar = volatileResult[volatileResult.length - 1] as number;
        const stableVar = stableResult[stableResult.length - 1] as number;

        expect(volatileVar).toBeGreaterThan(stableVar);
    });

    // 분산이 표준편차의 제곱인지 확인
    it("variance is square of standard deviation", () => {
        const data = [1, 4, 7, 2, 8, 5, 9, 3, 6];
        const period = 5;
        const result = calculateVAR(data, period);

        // 수동으로 마지막 5개 값의 분산 계산
        const lastFive = data.slice(-5);
        const mean = lastFive.reduce((sum, val) => sum + val, 0) / 5;
        const expectedVar =
            lastFive.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / 5;

        expect(result[result.length - 1]).toBeCloseTo(expectedVar, 10);
    });
});
