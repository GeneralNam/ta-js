import { describe, it, expect } from "vitest";
import { calculateVWAP, calculateIntradayVWAP } from "../src/vwap";

describe("calculateVWAP", () => {
    // 기본 VWAP 계산 테스트
    it("calculates VWAP correctly for a simple price and volume series", () => {
        const highData = [10, 11, 12, 13, 14];
        const lowData = [9, 10, 11, 12, 13];
        const closeData = [9.5, 10.5, 11.5, 12.5, 13.5];
        const volumeData = [100, 200, 150, 300, 250];
        const period = 3;
        const result = calculateVWAP(
            highData,
            lowData,
            closeData,
            volumeData,
            period
        );

        // 초기 period-1 기간은 null
        for (let i = 0; i < period - 1; i++) {
            expect(result[i]).toBeNull();
        }

        // 첫 번째 VWAP 계산 확인
        const tp1 = (10 + 9 + 9.5) / 3;
        const tp2 = (11 + 10 + 10.5) / 3;
        const tp3 = (12 + 11 + 11.5) / 3;
        const expectedVWAP =
            (tp1 * 100 + tp2 * 200 + tp3 * 150) / (100 + 200 + 150);
        expect(result[2]).toBeCloseTo(expectedVWAP, 5);
    });

    // 빈 입력 처리 테스트
    it("handles empty input arrays", () => {
        const result = calculateVWAP([], [], [], []);
        expect(result).toEqual([]);
    });

    // 배열 길이 불일치 테스트
    it("throws error when input arrays have different lengths", () => {
        const highData = [10, 11, 12];
        const lowData = [9, 10];
        const closeData = [9.5, 10.5, 11.5];
        const volumeData = [100, 200, 150];

        expect(() =>
            calculateVWAP(highData, lowData, closeData, volumeData)
        ).toThrow("고가, 저가, 종가, 거래량 배열의 길이가 일치해야 합니다.");
    });

    // 거래량이 0인 경우 테스트
    it("handles zero volume", () => {
        const highData = [10, 11, 12, 13, 14];
        const lowData = [9, 10, 11, 12, 13];
        const closeData = [9.5, 10.5, 11.5, 12.5, 13.5];
        const volumeData = [0, 0, 0, 0, 0];
        const period = 3;
        const result = calculateVWAP(
            highData,
            lowData,
            closeData,
            volumeData,
            period
        );

        // 거래량이 0이면 VWAP는 null
        for (let i = period - 1; i < result.length; i++) {
            expect(result[i]).toBeNull();
        }
    });

    // 전체 기간 누적 VWAP 테스트
    it("calculates cumulative VWAP when period is 0", () => {
        const highData = [10, 11, 12, 13, 14];
        const lowData = [9, 10, 11, 12, 13];
        const closeData = [9.5, 10.5, 11.5, 12.5, 13.5];
        const volumeData = [100, 200, 150, 300, 250];
        const result = calculateVWAP(
            highData,
            lowData,
            closeData,
            volumeData,
            0
        );

        // 모든 값이 계산되어야 함
        for (let i = 0; i < result.length; i++) {
            expect(result[i]).not.toBeNull();
            expect(typeof result[i]).toBe("number");
        }

        // 마지막 값은 전체 기간의 VWAP
        const totalPV = highData.reduce((sum, high, i) => {
            const tp = (high + lowData[i] + closeData[i]) / 3;
            return sum + tp * volumeData[i];
        }, 0);
        const totalVolume = volumeData.reduce((sum, vol) => sum + vol, 0);
        const expectedFinalVWAP = totalPV / totalVolume;
        expect(result[result.length - 1]).toBeCloseTo(expectedFinalVWAP, 5);
    });
});

describe("calculateIntradayVWAP", () => {
    // 기본 일중 VWAP 계산 테스트
    it("calculates intraday VWAP correctly", () => {
        const highData = [10, 11, 12, 13, 14];
        const lowData = [9, 10, 11, 12, 13];
        const closeData = [9.5, 10.5, 11.5, 12.5, 13.5];
        const volumeData = [100, 200, 150, 300, 250];
        const result = calculateIntradayVWAP(
            highData,
            lowData,
            closeData,
            volumeData
        );

        // 결과의 길이 확인
        expect(result.length).toBe(highData.length);

        // 첫 번째 값 확인
        const firstTP = (10 + 9 + 9.5) / 3;
        expect(result[0]).toBeCloseTo(firstTP, 5);

        // 두 번째 값 확인
        const secondTP = (11 + 10 + 10.5) / 3;
        const expectedSecondVWAP =
            (firstTP * 100 + secondTP * 200) / (100 + 200);
        expect(result[1]).toBeCloseTo(expectedSecondVWAP, 5);
    });

    // 빈 입력 처리 테스트
    it("handles empty input arrays", () => {
        const result = calculateIntradayVWAP([], [], [], []);
        expect(result).toEqual([]);
    });

    // 배열 길이 불일치 테스트
    it("throws error when input arrays have different lengths", () => {
        const highData = [10, 11, 12];
        const lowData = [9, 10];
        const closeData = [9.5, 10.5, 11.5];
        const volumeData = [100, 200, 150];

        expect(() =>
            calculateIntradayVWAP(highData, lowData, closeData, volumeData)
        ).toThrow("고가, 저가, 종가, 거래량 배열의 길이가 일치해야 합니다.");
    });

    // 실제 데이터와 유사한 시나리오 테스트
    it("calculates intraday VWAP for a realistic scenario", () => {
        const highData = [100, 102, 101, 103, 105, 104, 106, 108, 107, 109];
        const lowData = [98, 100, 99, 101, 103, 102, 104, 106, 105, 107];
        const closeData = [99, 101, 100, 102, 104, 103, 105, 107, 106, 108];
        const volumeData = [
            1000, 1200, 800, 1500, 2000, 1800, 2200, 2500, 2100, 2300,
        ];
        const result = calculateIntradayVWAP(
            highData,
            lowData,
            closeData,
            volumeData
        );

        // 결과의 길이 확인
        expect(result.length).toBe(highData.length);

        // 모든 값이 양수인지 확인
        for (let i = 0; i < result.length; i++) {
            if (result[i] !== null) {
                expect(result[i]).toBeGreaterThan(0);
            }
        }

        // VWAP가 증가하는지 확인 (상승 추세)
        const firstVWAP = result[0] as number;
        const lastVWAP = result[result.length - 1] as number;
        expect(lastVWAP).toBeGreaterThan(firstVWAP);
    });
});
