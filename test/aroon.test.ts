import { describe, it, expect } from "vitest";
import { calculateAROON } from "../src/aroon";

describe("calculateAROON", () => {
    // 기본 AROON 계산 테스트
    it("calculates AROON correctly", () => {
        const highData = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        const lowData = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
        const period = 5;
        const result = calculateAROON(highData, lowData, period);

        expect(result.up.length).toBe(highData.length);
        expect(result.down.length).toBe(highData.length);
        expect(result.oscillator.length).toBe(highData.length);

        // AROON 값이 0-100 범위인지 확인
        for (let i = period - 1; i < highData.length; i++) {
            if (result.up[i] !== null && result.down[i] !== null) {
                expect(result.up[i]).toBeGreaterThanOrEqual(0);
                expect(result.up[i]).toBeLessThanOrEqual(100);
                expect(result.down[i]).toBeGreaterThanOrEqual(0);
                expect(result.down[i]).toBeLessThanOrEqual(100);
            }
        }
    });

    // 빈 입력 처리 테스트
    it("handles empty input arrays", () => {
        const result = calculateAROON([], []);
        expect(result.up).toEqual([]);
        expect(result.down).toEqual([]);
        expect(result.oscillator).toEqual([]);
    });

    // 배열 길이 불일치 테스트
    it("throws error when input arrays have different lengths", () => {
        const highData = [10, 11, 12];
        const lowData = [9, 10];

        expect(() => calculateAROON(highData, lowData)).toThrow(
            "고가, 저가 배열의 길이가 일치해야 합니다."
        );
    });

    // 상승 추세에서의 AROON Up 테스트
    it("shows high AROON Up in uptrend", () => {
        const highData = Array.from({ length: 20 }, (_, i) => 100 + i);
        const lowData = Array.from({ length: 20 }, (_, i) => 99 + i);
        const period = 10;
        const result = calculateAROON(highData, lowData, period);

        // 상승 추세에서는 AROON Up이 높아야 함
        const lastAroonUp = result.up[result.up.length - 1];
        expect(lastAroonUp).toBeGreaterThan(80);
    });

    // 하락 추세에서의 AROON Down 테스트
    it("shows high AROON Down in downtrend", () => {
        const highData = Array.from({ length: 20 }, (_, i) => 200 - i);
        const lowData = Array.from({ length: 20 }, (_, i) => 199 - i);
        const period = 10;
        const result = calculateAROON(highData, lowData, period);

        // 하락 추세에서는 AROON Down이 높아야 함
        const lastAroonDown = result.down[result.down.length - 1];
        expect(lastAroonDown).toBeGreaterThan(80);
    });

    // Oscillator 계산 확인
    it("calculates oscillator as up minus down", () => {
        const highData = [100, 102, 101, 103, 105, 104, 106, 108, 107, 109];
        const lowData = [98, 100, 99, 101, 103, 102, 104, 106, 105, 107];
        const period = 5;
        const result = calculateAROON(highData, lowData, period);

        for (let i = period - 1; i < highData.length; i++) {
            if (
                result.up[i] !== null &&
                result.down[i] !== null &&
                result.oscillator[i] !== null
            ) {
                const expectedOscillator =
                    (result.up[i] as number) - (result.down[i] as number);
                expect(result.oscillator[i]).toBeCloseTo(
                    expectedOscillator,
                    10
                );
            }
        }
    });
});
