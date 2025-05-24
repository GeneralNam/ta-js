import { describe, it, expect } from "vitest";
import { calculateCCI } from "../src/cci";

describe("calculateCCI", () => {
    // 기본 CCI 계산 테스트
    it("calculates CCI correctly for a simple price series", () => {
        const highData = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        const lowData = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
        const closeData = [
            9.5, 10.5, 11.5, 12.5, 13.5, 14.5, 15.5, 16.5, 17.5, 18.5, 19.5,
        ];
        const period = 5;
        const result = calculateCCI(highData, lowData, closeData, period);

        // 초기 period-1 기간은 null
        for (let i = 0; i < period - 1; i++) {
            expect(result[i]).toBeNull();
        }

        // 결과의 길이 확인
        expect(result.length).toBe(highData.length);

        // CCI 값이 숫자인지 확인
        for (let i = period - 1; i < result.length; i++) {
            expect(typeof result[i]).toBe("number");
        }
    });

    // 빈 입력 처리 테스트
    it("handles empty input arrays", () => {
        const result = calculateCCI([], [], []);
        expect(result).toEqual([]);
    });

    // 배열 길이 불일치 테스트
    it("throws error when input arrays have different lengths", () => {
        const highData = [10, 11, 12];
        const lowData = [9, 10];
        const closeData = [9.5, 10.5, 11.5];

        expect(() => calculateCCI(highData, lowData, closeData)).toThrow(
            "고가, 저가, 종가 배열의 길이가 일치해야 합니다."
        );
    });

    // 기간보다 짧은 데이터 처리 테스트
    it("returns all nulls when data is shorter than period", () => {
        const highData = [10, 11, 12];
        const lowData = [9, 10, 11];
        const closeData = [9.5, 10.5, 11.5];
        const period = 5;
        const result = calculateCCI(highData, lowData, closeData, period);

        expect(result).toEqual([null, null, null]);
    });

    // 평균 편차가 0인 경우 테스트
    it("handles case when mean deviation is zero", () => {
        const highData = Array(10).fill(100);
        const lowData = Array(10).fill(100);
        const closeData = Array(10).fill(100);
        const period = 5;
        const result = calculateCCI(highData, lowData, closeData, period);

        // 모든 가격이 같으면 CCI는 0이어야 함
        for (let i = period - 1; i < result.length; i++) {
            expect(result[i]).toBe(0);
        }
    });

    // 상승 추세에서의 CCI 테스트
    it("shows positive CCI in an uptrend", () => {
        const dataLength = 30;
        const highData = Array.from({ length: dataLength }, (_, i) => 100 + i);
        const lowData = Array.from({ length: dataLength }, (_, i) => 99 + i);
        const closeData = Array.from(
            { length: dataLength },
            (_, i) => 99.5 + i
        );
        const period = 14;
        const result = calculateCCI(highData, lowData, closeData, period);

        // 상승 추세에서는 마지막 CCI가 양수여야 함
        const lastCCI = result[result.length - 1];
        expect(lastCCI).toBeGreaterThan(0);
    });

    // 하락 추세에서의 CCI 테스트
    it("shows negative CCI in a downtrend", () => {
        const dataLength = 30;
        const highData = Array.from({ length: dataLength }, (_, i) => 200 - i);
        const lowData = Array.from({ length: dataLength }, (_, i) => 199 - i);
        const closeData = Array.from(
            { length: dataLength },
            (_, i) => 199.5 - i
        );
        const period = 14;
        const result = calculateCCI(highData, lowData, closeData, period);

        // 하락 추세에서는 마지막 CCI가 음수여야 함
        const lastCCI = result[result.length - 1];
        expect(lastCCI).toBeLessThan(0);
    });

    // 실제 데이터와 유사한 시나리오 테스트
    it("calculates CCI for a realistic price scenario", () => {
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
        const period = 10;
        const result = calculateCCI(highData, lowData, closeData, period);

        // 결과의 길이 확인
        expect(result.length).toBe(highData.length);

        // CCI 값의 범위가 합리적인지 확인
        for (let i = period - 1; i < result.length; i++) {
            const cci = result[i];
            if (cci !== null) {
                expect(cci).toBeGreaterThan(-1000);
                expect(cci).toBeLessThan(1000);
            }
        }
    });
});
