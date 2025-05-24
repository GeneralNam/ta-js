import { describe, it, expect } from "vitest";
import { calculateIchimoku } from "../src/ichimoku";

describe("calculateIchimoku", () => {
    it("calculates Ichimoku Cloud correctly for a simple price series", () => {
        const highData = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        const lowData = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
        const closeData = [
            9.5, 10.5, 11.5, 12.5, 13.5, 14.5, 15.5, 16.5, 17.5, 18.5, 19.5,
        ];
        const conversionPeriod = 3;
        const basePeriod = 5;
        const spanBPeriod = 7;
        const displacement = 2;

        const result = calculateIchimoku(
            highData,
            lowData,
            closeData,
            conversionPeriod,
            basePeriod,
            spanBPeriod,
            displacement
        );

        const expectedLength = highData.length + displacement;
        expect(result.conversion.length).toBe(expectedLength);
        expect(result.base.length).toBe(expectedLength);
        expect(result.spanA.length).toBe(expectedLength);
        expect(result.spanB.length).toBe(expectedLength);
        expect(result.lagging.length).toBe(expectedLength);

        // 전환선 초기 null
        for (let i = 0; i < conversionPeriod - 1; i++) {
            expect(result.conversion[i]).toBeNull();
        }

        // 기준선 초기 null
        for (let i = 0; i < basePeriod - 1; i++) {
            expect(result.base[i]).toBeNull();
        }

        // 선행스팬1 초기 null
        const spanAStart =
            Math.max(conversionPeriod, basePeriod) - 1 + displacement;
        for (let i = 0; i < spanAStart; i++) {
            expect(result.spanA[i]).toBeNull();
        }

        // 선행스팬2 초기 null
        const spanBStart = spanBPeriod - 1 + displacement;
        for (let i = 0; i < spanBStart; i++) {
            expect(result.spanB[i]).toBeNull();
        }

        // 전환선 계산 값 확인 (i = 2)
        const firstConversionValue =
            (Math.max(...highData.slice(0, 3)) +
                Math.min(...lowData.slice(0, 3))) /
            2; // (12 + 9)/2
        expect(result.conversion[2]).toBeCloseTo(firstConversionValue, 5);

        // 기준선 계산 값 확인 (i = 4)
        const firstBaseValue =
            (Math.max(...highData.slice(0, 5)) +
                Math.min(...lowData.slice(0, 5))) /
            2; // (14 + 9)/2
        expect(result.base[4]).toBeCloseTo(firstBaseValue, 5);

        // 선행스팬1 계산 확인 (i = 4 → spanA[6])
        const conversionAt4 =
            (Math.max(...highData.slice(2, 5)) +
                Math.min(...lowData.slice(2, 5))) /
            2; // [12,13,14], [11,12,13] = (14 + 11)/2
        const spanAExpected = (conversionAt4 + firstBaseValue) / 2;
        expect(result.spanA[6]).toBeCloseTo(spanAExpected, 5);

        // 선행스팬2 계산 확인 (i = 6 → spanB[8])
        const spanBHigh = Math.max(...highData.slice(0, 7)); // [10~16]
        const spanBLow = Math.min(...lowData.slice(0, 7)); // [9~15]
        const spanBExpected = (spanBHigh + spanBLow) / 2;
        expect(result.spanB[8]).toBeCloseTo(spanBExpected, 5);

        // 후행스팬 계산 확인 (lagging[0] = closeData[2])
        expect(result.lagging[0]).toBe(closeData[2]);
    });

    it("handles empty input arrays", () => {
        const result = calculateIchimoku([], [], []);
        expect(result.conversion).toEqual([]);
        expect(result.base).toEqual([]);
        expect(result.spanA).toEqual([]);
        expect(result.spanB).toEqual([]);
        expect(result.lagging).toEqual([]);
    });

    it("throws error when input arrays have different lengths", () => {
        const highData = [10, 11, 12];
        const lowData = [9, 10];
        const closeData = [9.5, 10.5, 11.5];

        expect(() => calculateIchimoku(highData, lowData, closeData)).toThrow(
            "고가, 저가, 종가 배열의 길이가 일치해야 합니다."
        );
    });

    it("calculates Ichimoku Cloud for a realistic price scenario", () => {
        const highData = [
            100, 102, 101, 103, 105, 104, 106, 108, 107, 109, 111, 110, 112,
            114, 113, 115, 117, 116, 118, 120,
        ];
        const lowData = [
            98, 100, 99, 101, 103, 102, 104, 106, 105, 107, 109, 108, 110, 112,
            111, 113, 115, 114, 116, 118,
        ];
        const closeData = [
            99, 101, 100, 102, 104, 103, 105, 107, 106, 108, 110, 109, 111, 113,
            112, 114, 116, 115, 117, 119,
        ];
        const result = calculateIchimoku(highData, lowData, closeData);

        const expectedLength = highData.length + 26;
        expect(result.conversion.length).toBe(expectedLength);
        expect(result.base.length).toBe(expectedLength);
        expect(result.spanA.length).toBe(expectedLength);
        expect(result.spanB.length).toBe(expectedLength);
        expect(result.lagging.length).toBe(expectedLength);

        for (let i = 0; i < expectedLength; i++) {
            if (result.conversion[i] !== null) {
                expect(result.conversion[i]).toBeGreaterThan(0);
            }
            if (result.base[i] !== null) {
                expect(result.base[i]).toBeGreaterThan(0);
            }
            if (result.spanA[i] !== null) {
                expect(result.spanA[i]).toBeGreaterThan(0);
            }
            if (result.spanB[i] !== null) {
                expect(result.spanB[i]).toBeGreaterThan(0);
            }
            if (result.lagging[i] !== null) {
                expect(result.lagging[i]).toBeGreaterThan(0);
            }
        }
    });
});
