/**
 * 📊 가중 이동 평균(WMA) 계산 함수
 * WMAₜ = (가격ₜ × n + 가격ₜ₋₁ × (n-1) + ... + 가격ₜ₋ₙ₊₁ × 1) / (1 + 2 + ... + n)
 * n은 기간
 *
 * @param data - 숫자 배열 (보통 종가)
 *   예: [100, 102, 104, 106, ...]
 * @param period - 이동 평균 기간 (윈도우 크기)
 *   예: 3 → 최근 3개의 종가에 각각 3,2,1의 가중치를 부여
 * @returns WMA 값 배열 (계산 불가능한 초기 구간은 null)
 */
export function calculateWMA(
    data: number[],
    period: number
): (number | null)[] {
    const result: (number | null)[] = [];

    const weightSum = (period * (period + 1)) / 2; // 예: 3 → 6 (3+2+1)

    for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
            result.push(null); // 초기에는 계산 불가
            continue;
        }

        let weightedSum = 0;

        for (let j = 0; j < period; j++) {
            const weight = period - j;
            const value = data[i - j];
            weightedSum += value * weight;
        }

        result.push(weightedSum / weightSum);
    }

    return result;
}
