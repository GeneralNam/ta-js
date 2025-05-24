import { describe, it, expect } from "vitest";
import { calculateWILLR } from "../src/willr";

describe("calculateWILLR", () => {
    // 기본 Williams %R 계산 테스트
    it("calculates Williams %R correctly for a simple price series", () => {
        const highData = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        const lowData = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
        const closeData = [
            9.5, 10.5, 11.5, 12.5, 13.5, 14.5, 15.5, 16.5, 17.5, 18.5, 19.5,
        ];
        const period = 5;
        const result = calculateWILLR(highData, lowData, closeData, period);

        // 초기 period-1 기간은 null
        for (let i = 0; i < period - 1; i++) {
            expect(result[i]).toBeNull();
        }

        // 결과의 길이 확인
        expect(result.length).toBe(highData.length);

        // Williams %R 값이 -100과 0 사이인지 확인
        for (let i = period - 1; i < result.length; i++) {
            const willr = result[i];
            if (willr !== null) {
                expect(willr).toBeGreaterThanOrEqual(-100);
                expect(willr).toBeLessThanOrEqual(0);
            }
        }
    });

    // 빈 입력 처리 테스트
    it("handles empty input arrays", () => {
        const result = calculateWILLR([], [], []);
        expect(result).toEqual([]);
    });

    // 배열 길이 불일치 테스트
    it("throws error when input arrays have different lengths", () => {
        const highData = [10, 11, 12];
        const lowData = [9, 10];
        const closeData = [9.5, 10.5, 11.5];

        expect(() => calculateWILLR(highData, lowData, closeData)).toThrow(
            "고가, 저가, 종가 배열의 길이가 일치해야 합니다."
        );
    });

    // 기간보다 짧은 데이터 처리 테스트
    it("returns all nulls when data is shorter than period", () => {
        const highData = [10, 11, 12];
        const lowData = [9, 10, 11];
        const closeData = [9.5, 10.5, 11.5];
        const period = 5;
        const result = calculateWILLR(highData, lowData, closeData, period);

        expect(result).toEqual([null, null, null]);
    });

    // 최고가와 최저가가 같은 경우 테스트
    it("handles case when highest high equals lowest low", () => {
        const highData = Array(10).fill(100);
        const lowData = Array(10).fill(100);
        const closeData = Array(10).fill(100);
        const period = 5;
        const result = calculateWILLR(highData, lowData, closeData, period);

        // 모든 가격이 같으면 Williams %R은 0이어야 함
        for (let i = period - 1; i < result.length; i++) {
            expect(result[i]).toBe(0);
        }
    });

    // 과매수 상태 테스트
    it("shows near 0 (overbought) when close is near high", () => {
        const highData = [10, 11, 12, 13, 14, 15];
        const lowData = [5, 6, 7, 8, 9, 10];
        const closeData = [9.9, 10.9, 11.9, 12.9, 13.9, 14.9];
        const period = 5;
        const result = calculateWILLR(highData, lowData, closeData, period);

        const lastWillr = result[result.length - 1];
        if (lastWillr !== null) {
            expect(lastWillr).toBeGreaterThan(-20);
            expect(lastWillr).toBeLessThanOrEqual(0);
        }
    });

    // 과매도 상태 테스트
    it("shows near -100 (oversold) when close is near low", () => {
        const highData = [20, 19, 18, 17, 16, 15];
        const lowData = [15, 14, 13, 12, 11, 10];
        const closeData = [15.1, 14.1, 13.1, 12.1, 11.1, 10.1];
        const period = 5;
        const result = calculateWILLR(highData, lowData, closeData, period);

        const lastWillr = result[result.length - 1];
        if (lastWillr !== null) {
            expect(lastWillr).toBeLessThan(-80);
            expect(lastWillr).toBeGreaterThanOrEqual(-100);
        }
    });

    // 실제 데이터와 유사한 시나리오 테스트
    it("calculates Williams %R for a realistic price scenario", () => {
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
        const result = calculateWILLR(highData, lowData, closeData, period);

        // 결과의 길이 확인
        expect(result.length).toBe(highData.length);

        // Williams %R 값의 범위 확인
        for (let i = period - 1; i < result.length; i++) {
            const willr = result[i];
            if (willr !== null) {
                expect(willr).toBeGreaterThanOrEqual(-100);
                expect(willr).toBeLessThanOrEqual(0);
            }
        }
    });
});
