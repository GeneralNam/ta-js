import { describe, it, expect } from "vitest";
import { calculateMACD } from "../src/macd";

describe("calculateMACD", () => {
    // 기본 MACD 계산 테스트
    it("calculates MACD correctly for a simple price series", () => {
        const closeData = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        const result = calculateMACD(closeData, 3, 5, 2);

        // 결과 배열의 길이 확인
        expect(result.macd.length).toBeGreaterThan(0);
        expect(result.signal.length).toBeGreaterThan(0);
        expect(result.histogram.length).toBeGreaterThan(0);

        // MACD 값이 숫자인지 확인
        expect(result.macd.every((val) => typeof val === "number")).toBe(true);
        expect(result.signal.every((val) => typeof val === "number")).toBe(
            true
        );
        expect(result.histogram.every((val) => typeof val === "number")).toBe(
            true
        );
    });

    // 상승 추세에서의 MACD 테스트
    it("shows positive MACD in an uptrend", () => {
        const closeData = Array.from({ length: 30 }, (_, i) => 100 + i * 2);
        const result = calculateMACD(closeData);

        // 상승 추세에서는 MACD가 양수여야 함
        const lastMacd = result.macd[result.macd.length - 1];
        expect(lastMacd).toBeGreaterThan(0);
    });

    // 하락 추세에서의 MACD 테스트
    it("shows negative MACD in a downtrend", () => {
        const closeData = Array.from({ length: 30 }, (_, i) => 200 - i * 2);
        const result = calculateMACD(closeData);

        // 하락 추세에서는 MACD가 음수여야 함
        const lastMacd = result.macd[result.macd.length - 1];
        expect(lastMacd).toBeLessThan(0);
    });

    // 빈 입력 처리 테스트
    it("handles empty input array", () => {
        const result = calculateMACD([]);
        expect(result.macd).toEqual([]);
        expect(result.signal).toEqual([]);
        expect(result.histogram).toEqual([]);
    });

    // 실제 데이터와 유사한 시나리오 테스트
    it("calculates MACD for a realistic price scenario", () => {
        const closeData = [
            100, 102, 101, 103, 105, 104, 106, 108, 107, 109, 111, 110, 112,
            114, 113, 115, 117, 116, 118, 120,
        ];
        const result = calculateMACD(closeData, 5, 10, 3);

        // 결과의 유효성 검사
        expect(result.macd.length).toBe(11); // 20 - 10 + 1
        expect(result.signal.length).toBe(9); // 11 - 3 + 1
        expect(result.histogram.length).toBe(9); // 시그널과 동일

        // MACD와 시그널의 관계 검사
        for (let i = 0; i < result.histogram.length; i++) {
            expect(result.histogram[i]).toBeCloseTo(
                result.macd[i + 2] - result.signal[i],
                5
            );
        }
    });
});
