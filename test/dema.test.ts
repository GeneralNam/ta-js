import { describe, it, expect } from "vitest";
import { calculateDEMA } from "../src/dema";

describe("calculateDEMA", () => {
    // 기본 DEMA 계산 테스트
    it("calculates DEMA correctly for a simple data series", () => {
        const data = [
            10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
            27, 28, 29, 30,
        ];
        const period = 5;
        const result = calculateDEMA(data, period);

        // DEMA는 (period * 2 - 2) 인덱스부터 계산됨
        const startIndex = period * 2 - 2;
        for (let i = 0; i < startIndex; i++) {
            expect(result[i]).toBeNull();
        }

        // 결과의 길이 확인
        expect(result.length).toBe(data.length);

        // DEMA 값이 숫자인지 확인
        for (let i = startIndex; i < result.length; i++) {
            expect(typeof result[i]).toBe("number");
        }
    });

    // 빈 입력 처리 테스트
    it("handles empty input array", () => {
        const result = calculateDEMA([]);
        expect(result).toEqual([]);
    });

    // 기간보다 짧은 데이터 처리 테스트
    it("returns all nulls when data is shorter than required", () => {
        const data = [10, 11, 12];
        const period = 5;
        const result = calculateDEMA(data, period);

        expect(result).toEqual([null, null, null]);
    });

    // 상승 추세에서의 DEMA 테스트
    it("shows responsiveness in an uptrend", () => {
        const data = Array.from({ length: 30 }, (_, i) => 100 + i);
        const period = 10;
        const result = calculateDEMA(data, period);

        const startIndex = period * 2 - 2;

        // DEMA가 상승 추세를 반영하는지 확인
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

    // 하락 추세에서의 DEMA 테스트
    it("shows responsiveness in a downtrend", () => {
        const data = Array.from({ length: 30 }, (_, i) => 200 - i);
        const period = 10;
        const result = calculateDEMA(data, period);

        const startIndex = period * 2 - 2;

        // DEMA가 하락 추세를 반영하는지 확인
        let isDecreasing = true;
        for (let i = startIndex + 1; i < result.length; i++) {
            if (result[i] !== null && result[i - 1] !== null) {
                if ((result[i] as number) > (result[i - 1] as number)) {
                    isDecreasing = false;
                    break;
                }
            }
        }
        expect(isDecreasing).toBe(true);
    });

    // DEMA가 단순 EMA보다 민감한지 테스트
    it("is more responsive than simple EMA", () => {
        const data = [
            100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112,
            113, 114, 115, 120, 125, 130, 135, 140,
        ]; // 급상승
        const period = 5;

        // 단순 EMA 계산
        const calculateSimpleEMA = (
            sourceData: number[],
            emaPeriod: number
        ): (number | null)[] => {
            const ema: (number | null)[] = [];
            const k = 2 / (emaPeriod + 1);

            for (let i = 0; i < emaPeriod - 1; i++) {
                ema.push(null);
            }

            let sum = 0;
            for (let i = 0; i < emaPeriod; i++) {
                sum += sourceData[i];
            }
            ema.push(sum / emaPeriod);

            for (let i = emaPeriod; i < sourceData.length; i++) {
                const prevEMA = ema[ema.length - 1] as number;
                ema.push(sourceData[i] * k + prevEMA * (1 - k));
            }

            return ema;
        };

        const emaResult = calculateSimpleEMA(data, period);
        const demaResult = calculateDEMA(data, period);

        // 급상승 구간에서 DEMA가 EMA보다 더 빠르게 반응하는지 확인
        const dataChangeIndex = 16; // 급상승 시작 지점
        const emaChange =
            (emaResult[dataChangeIndex + 2] as number) -
            (emaResult[dataChangeIndex] as number);
        const demaChange =
            (demaResult[dataChangeIndex + 2] as number) -
            (demaResult[dataChangeIndex] as number);

        expect(demaChange).toBeGreaterThan(emaChange);
    });

    // 실제 데이터와 유사한 시나리오 테스트
    it("calculates DEMA for a realistic price scenario", () => {
        const data = [
            100, 102, 101, 103, 105, 104, 106, 108, 107, 109, 111, 110, 112,
            114, 113, 115, 117, 116, 118, 120, 122, 121, 123, 125, 124, 126,
            128, 127, 129, 131,
        ];
        const period = 8;
        const result = calculateDEMA(data, period);

        // 결과의 길이 확인
        expect(result.length).toBe(data.length);

        const startIndex = period * 2 - 2;

        // DEMA 값의 범위가 합리적인지 확인
        for (let i = startIndex; i < result.length; i++) {
            const dema = result[i];
            if (dema !== null) {
                expect(dema).toBeGreaterThan(90);
                expect(dema).toBeLessThan(140);
            }
        }
    });
});
