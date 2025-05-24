import { describe, it, expect } from "vitest";
import { calculateADX } from "../src/adx";

describe("calculateADX", () => {
    // 기본 ADX 계산 테스트
    it("calculates ADX correctly for a simple price series", () => {
        const highData = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        const lowData = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
        const closeData = [
            9.5, 10.5, 11.5, 12.5, 13.5, 14.5, 15.5, 16.5, 17.5, 18.5, 19.5,
        ];
        const period = 5;
        const result = calculateADX(highData, lowData, closeData, period);

        // 초기 period 기간은 null
        for (let i = 0; i < period; i++) {
            expect(result.adx[i]).toBeNull();
            expect(result.plusDI[i]).toBeNull();
            expect(result.minusDI[i]).toBeNull();
        }

        // 결과의 길이 확인
        expect(result.adx.length).toBe(highData.length);
        expect(result.plusDI.length).toBe(highData.length);
        expect(result.minusDI.length).toBe(highData.length);

        // ADX 값이 0과 100 사이인지 확인
        for (let i = period; i < result.adx.length; i++) {
            const adx = result.adx[i];
            if (adx !== null) {
                expect(adx).toBeGreaterThanOrEqual(0);
                expect(adx).toBeLessThanOrEqual(100);
            }
        }
    });

    // 빈 입력 처리 테스트
    it("handles empty input arrays", () => {
        const result = calculateADX([], [], []);
        expect(result.adx).toEqual([]);
        expect(result.plusDI).toEqual([]);
        expect(result.minusDI).toEqual([]);
    });

    // 배열 길이 불일치 테스트
    it("throws error when input arrays have different lengths", () => {
        const highData = [10, 11, 12];
        const lowData = [9, 10];
        const closeData = [9.5, 10.5, 11.5];

        expect(() => calculateADX(highData, lowData, closeData)).toThrow(
            "고가, 저가, 종가 배열의 길이가 일치해야 합니다."
        );
    });

    // 실제 데이터와 유사한 시나리오 테스트
    it("calculates ADX for a realistic price scenario", () => {
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
        const period = 5;
        const result = calculateADX(highData, lowData, closeData, period);

        // 결과의 길이 확인
        expect(result.adx.length).toBe(highData.length);
        expect(result.plusDI.length).toBe(highData.length);
        expect(result.minusDI.length).toBe(highData.length);

        // ADX, +DI, -DI 값의 범위 확인
        for (let i = period; i < result.adx.length; i++) {
            const adx = result.adx[i];
            const plusDI = result.plusDI[i];
            const minusDI = result.minusDI[i];

            if (adx !== null && plusDI !== null && minusDI !== null) {
                expect(adx).toBeGreaterThanOrEqual(0);
                expect(adx).toBeLessThanOrEqual(100);
                expect(plusDI).toBeGreaterThanOrEqual(0);
                expect(plusDI).toBeLessThanOrEqual(100);
                expect(minusDI).toBeGreaterThanOrEqual(0);
                expect(minusDI).toBeLessThanOrEqual(100);
            }
        }
    });
});
