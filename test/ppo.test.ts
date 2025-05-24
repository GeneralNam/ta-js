import { describe, it, expect } from "vitest";
import { calculatePPO } from "../src/ppo";

describe("calculatePPO", () => {
    // 기본 PPO 계산 테스트
    it("calculates PPO correctly", () => {
        const data = [
            10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
            27, 28, 29, 30,
        ];
        const fastPeriod = 5;
        const slowPeriod = 10;
        const signalPeriod = 3;
        const result = calculatePPO(data, fastPeriod, slowPeriod, signalPeriod);

        expect(result.ppo.length).toBe(data.length);
        expect(result.signal.length).toBe(data.length);
        expect(result.histogram.length).toBe(data.length);

        // PPO는 백분율이므로 합리적 범위 확인
        for (let i = slowPeriod - 1; i < data.length; i++) {
            if (result.ppo[i] !== null) {
                expect(result.ppo[i] as number).toBeGreaterThan(-100);
                expect(result.ppo[i] as number).toBeLessThan(100);
            }
        }
    });

    // 빈 입력 처리 테스트
    it("handles empty input array", () => {
        const result = calculatePPO([]);
        expect(result.ppo).toEqual([]);
        expect(result.signal).toEqual([]);
        expect(result.histogram).toEqual([]);
    });

    // 상승 추세에서의 PPO 테스트
    it("shows positive PPO in uptrend", () => {
        const data = Array.from({ length: 30 }, (_, i) => 100 + i);
        const result = calculatePPO(data, 5, 10, 3);

        // 상승 추세에서는 PPO가 양수여야 함
        const lastPPO = result.ppo[result.ppo.length - 1];
        expect(lastPPO).toBeGreaterThan(0);
    });

    // 하락 추세에서의 PPO 테스트
    it("shows negative PPO in downtrend", () => {
        const data = Array.from({ length: 30 }, (_, i) => 200 - i);
        const result = calculatePPO(data, 5, 10, 3);

        // 하락 추세에서는 PPO가 음수여야 함
        const lastPPO = result.ppo[result.ppo.length - 1];
        expect(lastPPO).toBeLessThan(0);
    });

    // Histogram 계산 확인
    it("calculates histogram as PPO minus signal", () => {
        const data = [
            100, 102, 101, 103, 105, 104, 106, 108, 107, 109, 111, 110, 112,
            114, 113,
        ];
        const result = calculatePPO(data, 3, 7, 2);

        for (let i = 0; i < data.length; i++) {
            if (
                result.ppo[i] !== null &&
                result.signal[i] !== null &&
                result.histogram[i] !== null
            ) {
                const expectedHistogram =
                    (result.ppo[i] as number) - (result.signal[i] as number);
                expect(result.histogram[i]).toBeCloseTo(expectedHistogram, 10);
            }
        }
    });

    // 기간 설정 테스트
    it("respects different period settings", () => {
        const data = Array.from(
            { length: 50 },
            (_, i) => 100 + Math.sin(i * 0.1) * 10
        );

        const result1 = calculatePPO(data, 5, 15, 5);
        const result2 = calculatePPO(data, 10, 30, 10);

        // 다른 기간 설정으로 다른 결과가 나와야 함
        expect(result1.ppo.length).toBe(result2.ppo.length);

        // 첫 번째 유효한 PPO 값의 위치가 다를 수 있음
        let firstValidIndex1 = -1;
        let firstValidIndex2 = -1;

        for (let i = 0; i < data.length; i++) {
            if (result1.ppo[i] !== null && firstValidIndex1 === -1) {
                firstValidIndex1 = i;
            }
            if (result2.ppo[i] !== null && firstValidIndex2 === -1) {
                firstValidIndex2 = i;
            }
        }

        expect(firstValidIndex2).toBeGreaterThan(firstValidIndex1);
    });
});
