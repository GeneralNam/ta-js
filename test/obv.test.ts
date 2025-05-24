import { describe, it, expect } from "vitest";
import { calculateOBV } from "../src/obv";

describe("calculateOBV", () => {
    // 기본 OBV 계산 테스트
    it("calculates OBV correctly for a simple price and volume series", () => {
        const closeData = [10, 11, 10, 12, 11];
        const volumeData = [100, 200, 150, 300, 250];
        const result = calculateOBV(closeData, volumeData);

        // 첫 번째 값은 첫 거래량과 동일
        expect(result[0]).toBe(100);

        // 두 번째 값: 100 + 200 (상승)
        expect(result[1]).toBe(300);

        // 세 번째 값: 300 - 150 (하락)
        expect(result[2]).toBe(150);

        // 네 번째 값: 150 + 300 (상승)
        expect(result[3]).toBe(450);

        // 다섯 번째 값: 450 - 250 (하락)
        expect(result[4]).toBe(200);
    });

    // 빈 입력 처리 테스트
    it("handles empty input arrays", () => {
        const result = calculateOBV([], []);
        expect(result).toEqual([]);
    });

    // 배열 길이 불일치 테스트
    it("throws error when input arrays have different lengths", () => {
        const closeData = [10, 11, 12];
        const volumeData = [100, 200];

        expect(() => calculateOBV(closeData, volumeData)).toThrow(
            "종가와 거래량 배열의 길이가 일치해야 합니다."
        );
    });

    // 실제 데이터와 유사한 시나리오 테스트
    it("calculates OBV for a realistic price and volume scenario", () => {
        const closeData = [100, 102, 101, 103, 105, 104, 106, 108, 107, 109];
        const volumeData = [
            1000, 1200, 800, 1500, 2000, 1800, 2200, 2500, 2100, 2300,
        ];

        const result = calculateOBV(closeData, volumeData);

        // 결과의 길이 확인
        expect(result.length).toBe(closeData.length);

        // OBV가 누적되는지 확인
        for (let i = 1; i < result.length; i++) {
            if (closeData[i] > closeData[i - 1]) {
                expect(result[i]).toBeGreaterThan(result[i - 1]);
            } else if (closeData[i] < closeData[i - 1]) {
                expect(result[i]).toBeLessThan(result[i - 1]);
            } else {
                expect(result[i]).toBe(result[i - 1]);
            }
        }
    });
});
