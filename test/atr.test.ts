import { describe, it, expect } from "vitest";
import { calculateATR } from "../src/atr";

describe("calculateATR", () => {
    // 기본 ATR 계산 테스트
    it("calculates ATR correctly for a simple price series", () => {
        const highData = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        const lowData = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
        const closeData = [
            9.5, 10.5, 11.5, 12.5, 13.5, 14.5, 15.5, 16.5, 17.5, 18.5, 19.5,
        ];
        const period = 3;
        const result = calculateATR(highData, lowData, closeData, period);

        // 초기 period 기간은 null
        for (let i = 0; i < period; i++) {
            expect(result[i]).toBeNull();
        }

        // 첫 번째 ATR 값 계산 확인
        const tr1 = Math.max(11 - 10, Math.abs(11 - 9.5), Math.abs(10 - 9.5)); // 1.5
        const tr2 = Math.max(12 - 11, Math.abs(12 - 10.5), Math.abs(11 - 10.5)); // 1.5
        const tr3 = Math.max(13 - 12, Math.abs(13 - 11.5), Math.abs(12 - 11.5)); // 1.5
        const firstATR = (tr1 + tr2 + tr3) / 3;
        expect(result[3]).toBeCloseTo(firstATR, 5);

        // 두 번째 ATR 값 계산 확인 (지수이동평균)
        const tr4 = Math.max(14 - 13, Math.abs(14 - 12.5), Math.abs(13 - 12.5)); // 1.5
        const secondATR = (firstATR * 2 + tr4) / 3;
        expect(result[4]).toBeCloseTo(secondATR, 5);
    });

    // 빈 입력 처리 테스트
    it("handles empty input arrays", () => {
        const result = calculateATR([], [], []);
        expect(result).toEqual([]);
    });

    // 배열 길이 불일치 테스트
    it("throws error when input arrays have different lengths", () => {
        const highData = [10, 11, 12];
        const lowData = [9, 10];
        const closeData = [9.5, 10.5, 11.5];

        expect(() => calculateATR(highData, lowData, closeData)).toThrow(
            "고가, 저가, 종가 배열의 길이가 일치해야 합니다."
        );
    });

    // 실제 데이터와 유사한 시나리오 테스트
    it("calculates ATR for a realistic price scenario", () => {
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
        const result = calculateATR(highData, lowData, closeData, period);

        // 결과의 길이 확인
        expect(result.length).toBe(highData.length);

        // ATR 값이 양수인지 확인
        for (let i = period; i < result.length; i++) {
            const atr = result[i];
            if (atr !== null) {
                expect(atr).toBeGreaterThan(0);
            }
        }

        // ATR이 변동성을 반영하는지 확인
        // 고가와 저가의 차이가 클수록 ATR도 커져야 함
        const highVolatilityATR = result[result.length - 1];
        const lowVolatilityATR = result[period];
        if (highVolatilityATR !== null && lowVolatilityATR !== null) {
            expect(highVolatilityATR).toBeGreaterThan(lowVolatilityATR);
        }
    });
});
