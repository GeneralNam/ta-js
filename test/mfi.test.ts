import { describe, it, expect } from "vitest";
import { calculateMFI } from "../src/mfi";

describe("calculateMFI", () => {
    // 기본 MFI 계산 테스트
    it("calculates MFI correctly for a simple price and volume series", () => {
        const highData = [
            10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        ];
        const lowData = [
            9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
        ];
        const closeData = [
            9.5, 10.5, 11.5, 12.5, 13.5, 14.5, 15.5, 16.5, 17.5, 18.5, 19.5,
            20.5, 21.5, 22.5, 23.5,
        ];
        const volumeData = [
            100, 200, 150, 300, 250, 180, 220, 270, 190, 320, 280, 160, 240,
            300, 350,
        ];
        const period = 5;
        const result = calculateMFI(
            highData,
            lowData,
            closeData,
            volumeData,
            period
        );

        // 초기 period 기간은 null
        for (let i = 0; i < period; i++) {
            expect(result[i]).toBeNull();
        }

        // 결과의 길이 확인
        expect(result.length).toBe(highData.length);

        // MFI 값이 0과 100 사이인지 확인
        for (let i = period; i < result.length; i++) {
            const mfi = result[i];
            if (mfi !== null) {
                expect(mfi).toBeGreaterThanOrEqual(0);
                expect(mfi).toBeLessThanOrEqual(100);
            }
        }
    });

    // 빈 입력 처리 테스트
    it("handles empty input arrays", () => {
        const result = calculateMFI([], [], [], []);
        expect(result).toEqual([]);
    });

    // 배열 길이 불일치 테스트
    it("throws error when input arrays have different lengths", () => {
        const highData = [10, 11, 12];
        const lowData = [9, 10];
        const closeData = [9.5, 10.5, 11.5];
        const volumeData = [100, 200, 150];

        expect(() =>
            calculateMFI(highData, lowData, closeData, volumeData)
        ).toThrow("고가, 저가, 종가, 거래량 배열의 길이가 일치해야 합니다.");
    });

    // 기간보다 짧은 데이터 처리 테스트
    it("returns all nulls when data is shorter than period + 1", () => {
        const highData = [10, 11, 12];
        const lowData = [9, 10, 11];
        const closeData = [9.5, 10.5, 11.5];
        const volumeData = [100, 200, 150];
        const period = 5;
        const result = calculateMFI(
            highData,
            lowData,
            closeData,
            volumeData,
            period
        );

        expect(result).toEqual([null, null, null]);
    });

    // 상승 추세에서의 MFI 테스트
    it("shows high MFI in an uptrend", () => {
        const dataLength = 20;
        const highData = Array.from({ length: dataLength }, (_, i) => 100 + i);
        const lowData = Array.from({ length: dataLength }, (_, i) => 99 + i);
        const closeData = Array.from(
            { length: dataLength },
            (_, i) => 99.5 + i
        );
        const volumeData = Array.from(
            { length: dataLength },
            (_, i) => 1000 + i * 10
        );
        const period = 10;
        const result = calculateMFI(
            highData,
            lowData,
            closeData,
            volumeData,
            period
        );

        // 상승 추세에서는 MFI가 높아야 함
        const lastMFI = result[result.length - 1];
        expect(lastMFI).toBeGreaterThan(70);
    });

    // 하락 추세에서의 MFI 테스트
    it("shows low MFI in a downtrend", () => {
        const dataLength = 20;
        const highData = Array.from({ length: dataLength }, (_, i) => 200 - i);
        const lowData = Array.from({ length: dataLength }, (_, i) => 199 - i);
        const closeData = Array.from(
            { length: dataLength },
            (_, i) => 199.5 - i
        );
        const volumeData = Array.from(
            { length: dataLength },
            (_, i) => 1000 + i * 10
        );
        const period = 10;
        const result = calculateMFI(
            highData,
            lowData,
            closeData,
            volumeData,
            period
        );

        // 하락 추세에서는 MFI가 낮아야 함
        const lastMFI = result[result.length - 1];
        expect(lastMFI).toBeLessThan(30);
    });

    // Negative Money Flow가 0인 경우 테스트
    it("returns 100 when negative money flow is zero", () => {
        const dataLength = 20;
        const highData = Array.from(
            { length: dataLength },
            (_, i) => 100 + i * 2
        );
        const lowData = Array.from(
            { length: dataLength },
            (_, i) => 99 + i * 2
        );
        const closeData = Array.from(
            { length: dataLength },
            (_, i) => 99.5 + i * 2
        );
        const volumeData = Array(dataLength).fill(1000);
        const period = 10;
        const result = calculateMFI(
            highData,
            lowData,
            closeData,
            volumeData,
            period
        );

        // 계속 상승하면 negative money flow가 0이므로 MFI는 100
        for (let i = period; i < result.length; i++) {
            expect(result[i]).toBe(100);
        }
    });

    // 실제 데이터와 유사한 시나리오 테스트
    it("calculates MFI for a realistic price and volume scenario", () => {
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
        const volumeData = [
            1000, 1200, 800, 1500, 2000, 1800, 2200, 2500, 2100, 2300, 1900,
            1600, 2100, 2400, 2000, 2600, 2800, 2300, 2700, 3000,
        ];
        const period = 10;
        const result = calculateMFI(
            highData,
            lowData,
            closeData,
            volumeData,
            period
        );

        // 결과의 길이 확인
        expect(result.length).toBe(highData.length);

        // MFI 값의 범위 확인
        for (let i = period; i < result.length; i++) {
            const mfi = result[i];
            if (mfi !== null) {
                expect(mfi).toBeGreaterThanOrEqual(0);
                expect(mfi).toBeLessThanOrEqual(100);
            }
        }
    });
});
