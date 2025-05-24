import { describe, it, expect } from "vitest";
import { calculateKELTNER } from "../src/keltner";

describe("calculateKELTNER", () => {
    // 기본 켈트너 채널 계산 테스트
    it("calculates Keltner channel correctly", () => {
        const highData = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        const lowData = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
        const closeData = [
            9.5, 10.5, 11.5, 12.5, 13.5, 14.5, 15.5, 16.5, 17.5, 18.5, 19.5,
        ];
        const period = 5;
        const multiplier = 2;
        const result = calculateKELTNER(
            highData,
            lowData,
            closeData,
            period,
            multiplier
        );

        expect(result.upper.length).toBe(highData.length);
        expect(result.middle.length).toBe(highData.length);
        expect(result.lower.length).toBe(highData.length);

        // 상단 > 중간 > 하단 관계 확인
        for (let i = period; i < highData.length; i++) {
            if (
                result.upper[i] !== null &&
                result.middle[i] !== null &&
                result.lower[i] !== null
            ) {
                expect(result.upper[i] as number).toBeGreaterThan(
                    result.middle[i] as number
                );
                expect(result.middle[i] as number).toBeGreaterThan(
                    result.lower[i] as number
                );
            }
        }
    });

    // 빈 입력 처리 테스트
    it("handles empty input arrays", () => {
        const result = calculateKELTNER([], [], []);
        expect(result.upper).toEqual([]);
        expect(result.middle).toEqual([]);
        expect(result.lower).toEqual([]);
    });

    // 배열 길이 불일치 테스트
    it("throws error when input arrays have different lengths", () => {
        const highData = [10, 11, 12];
        const lowData = [9, 10];
        const closeData = [9.5, 10.5, 11.5];

        expect(() => calculateKELTNER(highData, lowData, closeData)).toThrow(
            "고가, 저가, 종가 배열의 길이가 일치해야 합니다."
        );
    });

    // 기간보다 짧은 데이터 처리 테스트
    it("returns all nulls when data is shorter than period", () => {
        const highData = [10, 11, 12];
        const lowData = [9, 10, 11];
        const closeData = [9.5, 10.5, 11.5];
        const period = 5;
        const result = calculateKELTNER(highData, lowData, closeData, period);

        expect(result.upper).toEqual([null, null, null]);
        expect(result.middle).toEqual([null, null, null]);
        expect(result.lower).toEqual([null, null, null]);
    });

    // 승수 변경 테스트
    it("changes band width with different multipliers", () => {
        const highData = [100, 102, 101, 103, 105, 104, 106, 108, 107, 109];
        const lowData = [98, 100, 99, 101, 103, 102, 104, 106, 105, 107];
        const closeData = [99, 101, 100, 102, 104, 103, 105, 107, 106, 108];
        const period = 5;

        const result1 = calculateKELTNER(
            highData,
            lowData,
            closeData,
            period,
            1
        );
        const result2 = calculateKELTNER(
            highData,
            lowData,
            closeData,
            period,
            2
        );

        const lastIndex = highData.length - 1;
        if (
            result1.upper[lastIndex] !== null &&
            result2.upper[lastIndex] !== null
        ) {
            const width1 =
                (result1.upper[lastIndex] as number) -
                (result1.lower[lastIndex] as number);
            const width2 =
                (result2.upper[lastIndex] as number) -
                (result2.lower[lastIndex] as number);

            expect(width2).toBeGreaterThan(width1);
        }
    });
});
