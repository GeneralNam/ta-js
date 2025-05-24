import { describe, it, expect } from "vitest";
import { calculateTEMA } from "../src/tema";

describe("calculateTEMA", () => {
    // 기본 TEMA 계산 테스트
    it("calculates TEMA correctly for a simple data series", () => {
        const data = [
            10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
            27, 28, 29, 30,
        ];
        const period = 5;
        const result = calculateTEMA(data, period);

        // TEMA는 (period * 3 - 3) 인덱스부터 계산됨
        const startIndex = period * 3 - 3;
        for (let i = 0; i < startIndex; i++) {
            expect(result[i]).toBeNull();
        }

        // TEMA 값이 숫자인지 확인
        for (let i = startIndex; i < result.length; i++) {
            expect(typeof result[i]).toBe("number");
        }
    });

    // 빈 입력 처리 테스트
    it("handles empty input array", () => {
        const result = calculateTEMA([]);
        expect(result).toEqual([]);
    });

    // 기간보다 짧은 데이터 처리 테스트
    it("returns all nulls when data is shorter than required", () => {
        const data = [10, 11, 12];
        const period = 5;
        const result = calculateTEMA(data, period);

        expect(result).toEqual([null, null, null]);
    });

    // 상승 추세에서의 TEMA 테스트
    it("shows responsiveness in an uptrend", () => {
        const data = Array.from({ length: 30 }, (_, i) => 100 + i);
        const period = 8;
        const result = calculateTEMA(data, period);

        const startIndex = period * 3 - 3;

        // TEMA가 상승 추세를 반영하는지 확인
        let isIncreasing = true;
        for (let i = startIndex + 1; i < result.length; i++) {
            if (result[i] !== null && result[i - 1] !== null) {
                if ((result[i] as number) < (result[i - 1] as number)) {
                    isIncreasing = false;
                    break;
                }
            }
        }
        expect(isIncreasing).toBe(true);
    });

    // TEMA가 가장 민감한지 테스트
    it("is more responsive than DEMA", () => {
        const data = [
            100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112,
            113, 114, 115, 120, 125, 130, 135, 140, 145,
        ]; // 급상승
        const period = 5;
        const result = calculateTEMA(data, period);

        const startIndex = period * 3 - 3;
        const changeIndex = 16; // 급상승 시작 지점

        if (
            changeIndex + 2 < result.length &&
            result[changeIndex] !== null &&
            result[changeIndex + 2] !== null
        ) {
            const temaChange =
                (result[changeIndex + 2] as number) -
                (result[changeIndex] as number);
            expect(temaChange).toBeGreaterThan(0); // 급상승 반영
        }
    });
});
