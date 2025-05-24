/**
 * 📊 SUPERTREND 지표 계산 함수
 *
 * 계산 공식:
 * 1. HL2 = (고가 + 저가) / 2
 * 2. Basic Lower Band = HL2 - (multiplier × ATR)
 * 3. Basic Upper Band = HL2 + (multiplier × ATR)
 * 4. Final Lower Band = Basic Lower Band > prev Final Lower Band OR prev Close ≤ prev Final Lower Band ? Basic Lower Band : prev Final Lower Band
 * 5. Final Upper Band = Basic Upper Band < prev Final Upper Band OR prev Close ≥ prev Final Upper Band ? Basic Upper Band : prev Final Upper Band
 * 6. SuperTrend = 추세 방향에 따라 Final Upper Band 또는 Final Lower Band
 *
 * @param highData - 고가 배열
 * @param lowData - 저가 배열
 * @param closeData - 종가 배열
 * @param period - ATR 계산 기간 (기본값: 10)
 * @param multiplier - ATR 승수 (기본값: 3)
 * @returns {supertrend: (number | null)[], trend: (number | null)[]} - SuperTrend 값과 추세 방향 배열 (1: 상승, -1: 하락)
 */
export function calculateSUPERTREND(
    highData: number[],
    lowData: number[],
    closeData: number[],
    period: number = 10,
    multiplier: number = 3
): {
    supertrend: (number | null)[];
    trend: (number | null)[];
} {
    if (
        highData.length !== lowData.length ||
        highData.length !== closeData.length
    ) {
        throw new Error("고가, 저가, 종가 배열의 길이가 일치해야 합니다.");
    }

    if (highData.length < period + 1) {
        return {
            supertrend: Array(highData.length).fill(null),
            trend: Array(highData.length).fill(null),
        };
    }

    // ATR 계산
    const atr: (number | null)[] = Array(period).fill(null);
    const tr: number[] = [];

    for (let i = 1; i < highData.length; i++) {
        const trValue = Math.max(
            highData[i] - lowData[i],
            Math.abs(highData[i] - closeData[i - 1]),
            Math.abs(lowData[i] - closeData[i - 1])
        );
        tr.push(trValue);
    }

    let atrValue =
        tr.slice(0, period).reduce((sum, val) => sum + val, 0) / period;
    atr.push(atrValue);

    for (let i = period + 1; i < highData.length; i++) {
        atrValue = (atrValue * (period - 1) + tr[i - 1]) / period;
        atr.push(atrValue);
    }

    // SuperTrend 계산
    const supertrend: (number | null)[] = [];
    const trend: (number | null)[] = [];

    for (let i = 0; i < period; i++) {
        supertrend.push(null);
        trend.push(null);
    }

    const finalUpperBand: number[] = [];
    const finalLowerBand: number[] = [];

    for (let i = period; i < highData.length; i++) {
        const hl2 = (highData[i] + lowData[i]) / 2;
        const atrVal = atr[i] as number;

        const basicLowerBand = hl2 - multiplier * atrVal;
        const basicUpperBand = hl2 + multiplier * atrVal;

        let currentFinalLowerBand: number;
        let currentFinalUpperBand: number;

        if (i === period) {
            currentFinalLowerBand = basicLowerBand;
            currentFinalUpperBand = basicUpperBand;
        } else {
            const prevFinalLowerBand =
                finalLowerBand[finalLowerBand.length - 1];
            const prevFinalUpperBand =
                finalUpperBand[finalUpperBand.length - 1];
            const prevClose = closeData[i - 1];

            currentFinalLowerBand =
                basicLowerBand > prevFinalLowerBand ||
                prevClose <= prevFinalLowerBand
                    ? basicLowerBand
                    : prevFinalLowerBand;

            currentFinalUpperBand =
                basicUpperBand < prevFinalUpperBand ||
                prevClose >= prevFinalUpperBand
                    ? basicUpperBand
                    : prevFinalUpperBand;
        }

        finalLowerBand.push(currentFinalLowerBand);
        finalUpperBand.push(currentFinalUpperBand);

        // 추세 결정
        let currentTrend: number;
        if (i === period) {
            currentTrend = closeData[i] <= currentFinalUpperBand ? -1 : 1;
        } else {
            const prevTrend = trend[i - 1] as number;
            if (prevTrend === 1 && closeData[i] <= currentFinalLowerBand) {
                currentTrend = -1;
            } else if (
                prevTrend === -1 &&
                closeData[i] >= currentFinalUpperBand
            ) {
                currentTrend = 1;
            } else {
                currentTrend = prevTrend;
            }
        }

        trend.push(currentTrend);
        supertrend.push(
            currentTrend === 1 ? currentFinalLowerBand : currentFinalUpperBand
        );
    }

    return { supertrend, trend };
}
