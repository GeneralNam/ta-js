import { describe, it, expect } from "vitest";
import { calculateSTDDEV } from "../src/stddev";

describe("calculateSTDDEV", () => {
    // 기본 표준편차 계산 테스트
    it("calculates standard deviation correctly", () => {
        const data = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
        const period = 5;
        const result = calculateSTDDEV(data, period);

        // 초기 period-1 기간은 null
        for (let i = 0; i < period - 1; i++) {
            expect(result[i]).toBeNull();
        }

        // 모든 표준편차 값이 0 이상
        for (let i = period - 1; i < result.length; i++) {
            if (result[i] !== null) {
                expect(result[i]).toBeGreaterThanOrEqual(0);
            }
        }
    });

    // 동일한 값들의 표준편차는 0
    it("returns 0 for identical values", () => {
        const data = Array(10).fill(100);
        const period = 5;
        const result = calculateSTDDEV(data, period);

        for (let i = period - 1; i < result.length; i++) {
            expect(result[i]).toBe(0);
        }
    });

    // 빈 입력 처리 테스트
    it("handles empty input array", () => {
        const result = calculateSTDDEV([]);
        expect(result).toEqual([]);
    });

    // 변동성이 높은 데이터의 표준편차
    it("shows higher stddev for volatile data", () => {
        const volatileData = [100, 80, 120, 90, 110, 75, 125, 85, 115, 95];
        const stableData = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109];
        const period = 5;

        const volatileResult = calculateSTDDEV(volatileData, period);
        const stableResult = calculateSTDDEV(stableData, period);

        const volatileStddev = volatileResult[
            volatileResult.length - 1
        ] as number;
        const stableStddev = stableResult[stableResult.length - 1] as number;

        expect(volatileStddev).toBeGreaterThan(stableStddev);
    });
});
