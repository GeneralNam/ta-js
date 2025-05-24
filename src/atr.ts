/**
 * 📊 ATR (Average True Range) 계산 함수
 *
 * True Range = max(고가 - 저가, |고가 - 전일종가|, |저가 - 전일종가|)
 * ATR = n기간 True Range의 이동평균
 *
 * @param highData - 고가 배열
 * @param lowData - 저가 배열
 * @param closeData - 종가 배열
 * @param period - ATR 계산 기간 (기본값: 14)
 * @returns (number | null)[] - ATR 값 배열
 */
export function calculateATR(
    highData: number[],
    lowData: number[],
    closeData: number[],
    period: number = 14
): (number | null)[] {
    if (
        highData.length !== lowData.length ||
        highData.length !== closeData.length
    ) {
        throw new Error("고가, 저가, 종가 배열의 길이가 일치해야 합니다.");
    }

    if (highData.length < period + 1) {
        return Array(highData.length).fill(null);
    }

    const atr: (number | null)[] = [];

    // 초기 period 기간은 null로 채움
    for (let i = 0; i < period; i++) {
        atr.push(null);
    }

    // True Range 계산 함수
    const calculateTR = (
        high: number,
        low: number,
        prevClose: number
    ): number => {
        return Math.max(
            high - low,
            Math.abs(high - prevClose),
            Math.abs(low - prevClose)
        );
    };

    // 초기 TR 배열 계산
    const tr: number[] = [];
    for (let i = 1; i < highData.length; i++) {
        tr.push(calculateTR(highData[i], lowData[i], closeData[i - 1]));
    }

    // 첫 번째 ATR 계산 (단순이동평균)
    let atrValue =
        tr.slice(0, period).reduce((sum, val) => sum + val, 0) / period;
    atr.push(atrValue);

    // 나머지 기간의 ATR 계산 (지수이동평균)
    for (let i = period + 1; i < highData.length; i++) {
        atrValue = (atrValue * (period - 1) + tr[i - 1]) / period;
        atr.push(atrValue);
    }

    return atr;
}
