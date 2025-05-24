import { describe, it, expect } from "vitest";
import { calculateBBands } from "../src/bbands";

describe("calculateBBands", () => {
    // 기본 볼린저 밴드 계산 테스트
    it("calculates Bollinger Bands correctly for a simple price series", () => {
        const closeData = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        const period = 5;
        const multiplier = 2;
        const result = calculateBBands(closeData, period, multiplier);

        // 초기 period-1 기간은 null
        for (let i = 0; i < period - 1; i++) {
            expect(result.middle[i]).toBeNull();
            expect(result.upper[i]).toBeNull();
            expect(result.lower[i]).toBeNull();
        }

        // 첫 번째 유효한 값 (인덱스 4)
        const firstSMA = (10 + 11 + 12 + 13 + 14) / 5;
        const firstStdDev = Math.sqrt(
            (Math.pow(10 - firstSMA, 2) +
                Math.pow(11 - firstSMA, 2) +
                Math.pow(12 - firstSMA, 2) +
                Math.pow(13 - firstSMA, 2) +
                Math.pow(14 - firstSMA, 2)) /
                5
        );

        expect(result.middle[4]).toBeCloseTo(firstSMA, 5);
        expect(result.upper[4]).toBeCloseTo(
            firstSMA + multiplier * firstStdDev,
            5
        );
        expect(result.lower[4]).toBeCloseTo(
            firstSMA - multiplier * firstStdDev,
            5
        );
    });

    // 빈 입력 처리 테스트
    it("handles empty input array", () => {
        const result = calculateBBands([]);
        expect(result.middle).toEqual([]);
        expect(result.upper).toEqual([]);
        expect(result.lower).toEqual([]);
    });

    // 기간보다 짧은 입력 처리 테스트
    it("handles input array shorter than period", () => {
        const closeData = [10, 11, 12];
        const period = 5;
        const result = calculateBBands(closeData, period);

        expect(result.middle).toEqual([null, null, null]);
        expect(result.upper).toEqual([null, null, null]);
        expect(result.lower).toEqual([null, null, null]);
    });

    // 실제 데이터와 유사한 시나리오 테스트
    it("calculates Bollinger Bands for a realistic price scenario", () => {
        const closeData = [
            100, 102, 101, 103, 105, 104, 106, 108, 107, 109, 111, 110, 112,
            114, 113, 115, 117, 116, 118, 120,
        ];
        const period = 5;
        const multiplier = 2;
        const result = calculateBBands(closeData, period, multiplier);

        // 결과의 길이 확인
        expect(result.middle.length).toBe(closeData.length);
        expect(result.upper.length).toBe(closeData.length);
        expect(result.lower.length).toBe(closeData.length);

        // 밴드의 관계 확인
        for (let i = period - 1; i < closeData.length; i++) {
            const middle = result.middle[i];
            const upper = result.upper[i];
            const lower = result.lower[i];

            if (middle !== null && upper !== null && lower !== null) {
                expect(upper).toBeGreaterThan(middle);
                expect(middle).toBeGreaterThan(lower);
                expect(upper - middle).toBeCloseTo(middle - lower, 5);
            }
        }
    });
});
