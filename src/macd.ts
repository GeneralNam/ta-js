/**
 * 📊 MACD (이동평균 수렴 확산) 계산 함수
 *
 * MACD = 12일 EMA - 26일 EMA
 * Signal = 9일 EMA of MACD
 * Histogram = MACD - Signal
 *
 * @param closeData - 종가 배열
 * @param fastPeriod - 빠른 EMA 기간 (기본값: 12)
 * @param slowPeriod - 느린 EMA 기간 (기본값: 26)
 * @param signalPeriod - 시그널 EMA 기간 (기본값: 9)
 * @returns {macd: number[], signal: number[], histogram: number[]} - MACD, 시그널, 히스토그램 배열
 */
export function calculateMACD(
    closeData: number[],
    fastPeriod: number = 12,
    slowPeriod: number = 26,
    signalPeriod: number = 9
): { macd: number[]; signal: number[]; histogram: number[] } {
    // 빈 배열 처리
    if (closeData.length === 0) {
        return { macd: [], signal: [], histogram: [] };
    }

    // EMA 계산 함수
    const calculateEMA = (data: number[], period: number): number[] => {
        const k = 2 / (period + 1);
        const ema: number[] = [];

        // 첫 번째 EMA는 SMA로 계산
        let sum = 0;
        for (let i = 0; i < period; i++) {
            sum += data[i];
        }
        ema.push(sum / period);

        // 나머지 EMA 계산
        for (let i = period; i < data.length; i++) {
            ema.push(data[i] * k + ema[ema.length - 1] * (1 - k));
        }

        return ema;
    };

    // 빠른 EMA와 느린 EMA 계산
    const fastEMA = calculateEMA(closeData, fastPeriod);
    const slowEMA = calculateEMA(closeData, slowPeriod);

    // MACD 라인 계산
    const macd: number[] = [];
    for (let i = 0; i < slowEMA.length; i++) {
        macd.push(fastEMA[i + (slowPeriod - fastPeriod)] - slowEMA[i]);
    }

    // 시그널 라인 계산
    const signal = calculateEMA(macd, signalPeriod);

    // 히스토그램 계산
    const histogram: number[] = [];
    for (let i = 0; i < signal.length; i++) {
        histogram.push(macd[i + (signalPeriod - 1)] - signal[i]);
    }

    return { macd, signal, histogram };
}
