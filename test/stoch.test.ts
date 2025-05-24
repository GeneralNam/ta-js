import { describe, it, expect } from "vitest";
import { calculateStochastic } from "../src/stoch";

describe("calculateStochastic", () => {
    it("returns all nulls if any data array is shorter than periodK", () => {
        const highData = [100, 101, 102];
        const lowData = [98, 99, 100];
        const closeData = [99, 100, 101];
        const periodK = 14;
        const periodD = 3;

        const result = calculateStochastic(
            highData,
            lowData,
            closeData,
            periodK,
            periodD
        );

        const expectedNulls = highData.length;
        expect(result.k.length).toBe(expectedNulls);
        expect(result.d.length).toBe(expectedNulls);
        expect(result.k.every((val) => val === null)).toBe(true);
        expect(result.d.every((val) => val === null)).toBe(true);
    });

    // 모든 가격이 계속 상승하는 경우 (K, D가 100에 가까워야 함)
    it("calculates Stochastic when all prices go up (K and D should be near 100)", () => {
        const dataLength = 30;
        const periodK = 14;
        const periodD = 3;

        // 가격이 꾸준히 상승하는 시나리오
        // 종가가 항상 최고가에 근접하도록 설정
        const highData = Array.from(
            { length: dataLength },
            (_, i) => 100 + i * 2 + 10
        ); // 최고가
        const lowData = Array.from(
            { length: dataLength },
            (_, i) => 100 + i * 2
        ); // 최저가
        const closeData = Array.from(
            { length: dataLength },
            (_, i) => 100 + i * 2 + 9
        ); // 종가가 최고가에 가깝도록

        const result = calculateStochastic(
            highData,
            lowData,
            closeData,
            periodK,
            periodD
        );

        // 첫 번째 유효한 %K 값은 97.2222... (35/36 * 100)
        const expectedK_allUp = 97.22222;
        // %D는 %K의 이동평균이므로, %K가 일정하면 %D도 같아집니다.
        const expectedD_allUp = 97.22222;

        for (let i = 0; i < result.k.length; i++) {
            if (i < periodK - 1) {
                // %K 계산 전
                expect(result.k[i]).toBeNull();
            } else {
                expect(result.k[i]).toBeCloseTo(expectedK_allUp, 4); // 기대 값 수정
            }

            if (i < periodK - 1 + periodD - 1) {
                // %D 계산 전
                expect(result.d[i]).toBeNull();
            } else {
                expect(result.d[i]).toBeCloseTo(expectedD_allUp, 4); // 기대 값 수정
            }
        }
    });

    // 모든 가격이 계속 하락하는 경우 (K, D가 0에 가까워야 함)
    it("calculates Stochastic when all prices go down (K and D should be near 0)", () => {
        const dataLength = 30;
        const periodK = 14;
        const periodD = 3;

        // 가격이 꾸준히 하락하는 시나리오
        // 종가가 항상 최저가에 근접하도록 설정
        const highData = Array.from(
            { length: dataLength },
            (_, i) => 200 - i * 2
        ); // 최고가
        const lowData = Array.from(
            { length: dataLength },
            (_, i) => 200 - i * 2 - 10
        ); // 최저가
        const closeData = Array.from(
            { length: dataLength },
            (_, i) => 200 - i * 2 - 9
        ); // 종가가 최저가에 가깝도록

        const result = calculateStochastic(
            highData,
            lowData,
            closeData,
            periodK,
            periodD
        );

        // 첫 번째 유효한 %K 값은 2.7777... (1/36 * 100)
        const expectedK_allDown = 2.77778;
        // %D는 %K의 이동평균이므로, %K가 일정하면 %D도 같아집니다.
        const expectedD_allDown = 2.77778;

        for (let i = 0; i < result.k.length; i++) {
            if (i < periodK - 1) {
                expect(result.k[i]).toBeNull();
            } else {
                expect(result.k[i]).toBeCloseTo(expectedK_allDown, 4); // 기대 값 수정
            }

            if (i < periodK - 1 + periodD - 1) {
                expect(result.d[i]).toBeNull();
            } else {
                expect(result.d[i]).toBeCloseTo(expectedD_allDown, 4); // 기대 값 수정
            }
        }
    });

    // 고가와 저가가 같은 경우 (분모 0 방지 처리 확인)
    it("handles cases where highestHigh equals lowestLow in the period", () => {
        const highData = Array.from({ length: 20 }, () => 100);
        const lowData = Array.from({ length: 20 }, () => 100);
        const closeData = Array.from({ length: 20 }, () => 100);
        const periodK = 3;
        const periodD = 3;

        const result = calculateStochastic(
            highData,
            lowData,
            closeData,
            periodK,
            periodD
        );

        // 함수가 0으로 처리하도록 구현되어 있으므로, 모든 유효한 K와 D는 0이어야 함
        for (let i = 0; i < result.k.length; i++) {
            if (i < periodK - 1) {
                expect(result.k[i]).toBeNull();
            } else {
                expect(result.k[i]).toBeCloseTo(0, 5);
            }

            if (i < periodK - 1 + periodD - 1) {
                expect(result.d[i]).toBeNull();
            } else {
                expect(result.d[i]).toBeCloseTo(0, 5);
            }
        }
    });

    // 빈 입력 처리
    it("handles empty input arrays", () => {
        const result = calculateStochastic([], [], [], 14, 3);
        expect(result.k).toEqual([]);
        expect(result.d).toEqual([]);
    });

    // 실제 데이터에 가까운 시나리오 테스트
    it("calculates Stochastic for a mixed price movement scenario", () => {
        const highPrices = [
            105, 107, 106, 110, 112, 111, 115, 118, 117, 120, 122, 125, 124,
            128, 130, 132, 135, 133, 138, 140,
        ];
        const lowPrices = [
            100, 102, 101, 104, 106, 105, 109, 110, 110, 112, 114, 117, 116,
            120, 122, 125, 127, 126, 130, 132,
        ];
        const closePrices = [
            102, 104, 103, 108, 110, 109, 113, 115, 114, 118, 120, 123, 122,
            126, 128, 130, 132, 130, 135, 137,
        ];
        const periodK = 14;
        const periodD = 3;

        const result = calculateStochastic(
            highPrices,
            lowPrices,
            closePrices,
            periodK,
            periodD
        );

        // 예상되는 첫 번째 유효 %K (인덱스 13)
        // (126 - 100) / (128 - 100) * 100 = 26 / 28 * 100 = 92.8571428...
        expect(result.k[13]).toBeCloseTo(92.85714, 4);

        // 예상되는 두 번째 유효 %K (인덱스 14)
        // (128 - 101) / (130 - 101) * 100 = 27 / 29 * 100 = 93.1034482...
        expect(result.k[14]).toBeCloseTo(93.10345, 4);

        // 예상되는 세 번째 유효 %K (인덱스 15)
        // (130 - 101) / (132 - 101) * 100 = 29 / 31 * 100 = 93.548387...
        expect(result.k[15]).toBeCloseTo(93.54839, 4);

        // 예상되는 첫 번째 유효 %D (인덱스 15)
        // %D[15]는 k[13], k[14], k[15]의 평균
        // (92.85714 + 93.10345 + 93.54839) / 3 = 93.16966
        expect(result.d[15]).toBeCloseTo(93.16966, 4);

        // null 값들의 위치 확인
        for (let i = 0; i < result.k.length; i++) {
            if (i < periodK - 1) {
                // periodK-1까지 %K는 null
                expect(result.k[i]).toBeNull();
            } else {
                expect(typeof result.k[i]).toBe("number");
            }

            if (i < periodK - 1 + periodD - 1) {
                // (periodK-1) + (periodD-1)까지 %D는 null
                expect(result.d[i]).toBeNull();
            } else {
                expect(typeof result.d[i]).toBe("number");
            }
        }
    });
});
