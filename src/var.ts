/**
 * 📊 VAR (Variance) 계산 함수
 *
 * 계산 공식:
 * 1. Mean = n기간 평균
 * 2. Variance = Σ(x - Mean)² / n
 *
 * 분산은 데이터의 산포도를 측정하는 지표입니다.
 *
 * @param data - 계산할 데이터 배열
 * @param period - 분산 계산 기간 (기본값: 20)
 * @returns (number | null)[] - 분산 값 배열
 */
export function calculateVAR(
    data: number[],
    period: number = 20
): (number | null)[] {
    if (data.length < period) {
        return Array(data.length).fill(null);
    }

    const variance: (number | null)[] = [];

    // 초기 period-1 기간은 null로 채움
    for (let i = 0; i < period - 1; i++) {
        variance.push(null);
    }

    // 분산 계산
    for (let i = period - 1; i < data.length; i++) {
        // 평균 계산
        let sum = 0;
        for (let j = i - period + 1; j <= i; j++) {
            sum += data[j];
        }
        const mean = sum / period;

        // 분산 계산
        let varianceValue = 0;
        for (let j = i - period + 1; j <= i; j++) {
            varianceValue += Math.pow(data[j] - mean, 2);
        }
        varianceValue = varianceValue / period;

        variance.push(varianceValue);
    }

    return variance;
}
