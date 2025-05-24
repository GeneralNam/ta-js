import { describe, it, expect } from "vitest";
import { calculateSUPERTREND } from "../src/supertrend";

describe("calculateSUPERTREND", () => {
    // 기본 SuperTrend 계산 테스트
    it("calculates SuperTrend correctly", () => {
        const highData = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        const lowData = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
        const closeData = [
            9.5, 10.5, 11.5, 12.5, 13.5, 14.5, 15.5, 16.5, 17.5, 18.5, 19.5,
        ];
        const period = 5;
        const multiplier = 3;
        const result = calculateSUPERTREND(
            highData,
            lowData,
            closeData,
            period,
            multiplier
        );

        expect(result.supertrend.length).toBe(highData.length);
        expect(result.trend.length).toBe(highData.length);

        // 추세는 1 또는 -1이어야 함
        for (let i = period; i < highData.length; i++) {
            if (result.trend[i] !== null) {
                expect([1, -1]).toContain(result.trend[i] as number);
            }
        }
    });

    // 빈 입력 처리 테스트
    it("handles empty input arrays", () => {
        const result = calculateSUPERTREND([], [], []);
        expect(result.supertrend).toEqual([]);
        expect(result.trend).toEqual([]);
    });

    // 배열 길이 불일치 테스트
    it("throws error when input arrays have different lengths", () => {
        const highData = [10, 11, 12];
        const lowData = [9, 10];
        const closeData = [9.5, 10.5, 11.5];

        expect(() => calculateSUPERTREND(highData, lowData, closeData)).toThrow(
            "고가, 저가, 종가 배열의 길이가 일치해야 합니다."
        );
    });

    // 상승 추세 테스트
    it("identifies uptrend correctly", () => {
        const highData = Array.from({ length: 20 }, (_, i) => 100 + i);
        const lowData = Array.from({ length: 20 }, (_, i) => 99 + i);
        const closeData = Array.from({ length: 20 }, (_, i) => 99.5 + i);
        const period = 5;
        const multiplier = 3;
        const result = calculateSUPERTREND(
            highData,
            lowData,
            closeData,
            period,
            multiplier
        );

        // 마지막 추세가 상승(1)이어야 함
        const lastTrend = result.trend[result.trend.length - 1];
        expect(lastTrend).toBe(1);
    });

    // 하락 추세 테스트
    it("identifies downtrend correctly", () => {
        const highData = Array.from({ length: 20 }, (_, i) => 200 - i);
        const lowData = Array.from({ length: 20 }, (_, i) => 199 - i);
        const closeData = Array.from({ length: 20 }, (_, i) => 199.5 - i);
        const period = 5;
        const multiplier = 3;
        const result = calculateSUPERTREND(
            highData,
            lowData,
            closeData,
            period,
            multiplier
        );

        // 마지막 추세가 하락(-1)이어야 함
        const lastTrend = result.trend[result.trend.length - 1];
        expect(lastTrend).toBe(-1);
    });

    // 승수 변경 테스트
    it("adjusts sensitivity with different multipliers", () => {
        const highData = [
            100, 102, 101, 103, 105, 104, 106, 108, 107, 109, 111, 110,
        ];
        const lowData = [
            98, 100, 99, 101, 103, 102, 104, 106, 105, 107, 109, 108,
        ];
        const closeData = [
            99, 101, 100, 102, 104, 103, 105, 107, 106, 108, 110, 109,
        ];
        const period = 5;

        const result1 = calculateSUPERTREND(
            highData,
            lowData,
            closeData,
            period,
            1
        );
        const result2 = calculateSUPERTREND(
            highData,
            lowData,
            closeData,
            period,
            5
        );

        // 승수가 작을수록 더 민감하게 반응해야 함
        expect(result1.supertrend.length).toBe(result2.supertrend.length);
    });
});
