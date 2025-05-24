/**
 * 📊 STDDEV (Standard Deviation) 계산 함수
 *
 * 계산 공식:
 * 1. Mean = n기간 평균
 * 2. Variance = Σ(x - Mean)² / n
 * 3. Standard Deviation = √Variance
 *
 * 표준편차는 데이터의 변동성을 측정하는 지표입니다.
 *
 * @param data - 계산할 데이터 배열
 * @param period - 표준편차 계산 기간 (기본값: 20)
 * @returns (number | null)[] - 표준편차 값 배열
 */
export function calculateSTDDEV(
    data: number[],
    period: number = 20
): (number | null)[] {
    if (data.length < period) {
        return Array(data.length).fill(null);
    }

    const stddev: (number | null)[] = [];

    // 초기 period-1 기간은 null로 채움
    for (let i = 0; i < period - 1; i++) {
        stddev.push(null);
    }

    // 표준편차 계산
    for (let i = period - 1; i < data.length; i++) {
        // 평균 계산
        let sum = 0;
        for (let j = i - period + 1; j <= i; j++) {
            sum += data[j];
        }
        const mean = sum / period;

        // 분산 계산
        let variance = 0;
        for (let j = i - period + 1; j <= i; j++) {
            variance += Math.pow(data[j] - mean, 2);
        }
        variance = variance / period;

        // 표준편차 계산
        const standardDeviation = Math.sqrt(variance);
        stddev.push(standardDeviation);
    }

    return stddev;
}
