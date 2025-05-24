/**
 * 📊 볼린저 밴드 (Bollinger Bands) 계산 함수
 *
 * 중간 밴드 = n기간 단순이동평균(SMA)
 * 상단 밴드 = 중간 밴드 + (k * n기간 표준편차)
 * 하단 밴드 = 중간 밴드 - (k * n기간 표준편차)
 *
 * @param closeData - 종가 배열
 * @param period - 이동평균 기간 (기본값: 20)
 * @param multiplier - 표준편차 승수 (기본값: 2)
 * @returns {middle: (number | null)[], upper: (number | null)[], lower: (number | null)[]} - 중간, 상단, 하단 밴드 배열
 */
export function calculateBBands(
    closeData: number[],
    period: number = 20,
    multiplier: number = 2
): {
    middle: (number | null)[];
    upper: (number | null)[];
    lower: (number | null)[];
} {
    if (closeData.length < period) {
        return {
            middle: Array(closeData.length).fill(null),
            upper: Array(closeData.length).fill(null),
            lower: Array(closeData.length).fill(null),
        };
    }

    const middle: (number | null)[] = [];
    const upper: (number | null)[] = [];
    const lower: (number | null)[] = [];

    // SMA 계산 함수
    const calculateSMA = (
        data: number[],
        start: number,
        length: number
    ): number => {
        let sum = 0;
        for (let i = start; i < start + length; i++) {
            sum += data[i];
        }
        return sum / length;
    };

    // 표준편차 계산 함수
    const calculateStdDev = (
        data: number[],
        start: number,
        length: number,
        mean: number
    ): number => {
        let sum = 0;
        for (let i = start; i < start + length; i++) {
            sum += Math.pow(data[i] - mean, 2);
        }
        return Math.sqrt(sum / length);
    };

    // 초기 period-1 기간은 null로 채움
    for (let i = 0; i < period - 1; i++) {
        middle.push(null);
        upper.push(null);
        lower.push(null);
    }

    // 볼린저 밴드 계산
    for (let i = period - 1; i < closeData.length; i++) {
        const sma = calculateSMA(closeData, i - period + 1, period);
        const stdDev = calculateStdDev(closeData, i - period + 1, period, sma);

        middle.push(sma);
        upper.push(sma + multiplier * stdDev);
        lower.push(sma - multiplier * stdDev);
    }

    return { middle, upper, lower };
}
