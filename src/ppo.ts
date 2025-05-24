/**
 * 📊 PPO (Percentage Price Oscillator) 계산 함수
 *
 * 계산 공식:
 * 1. Fast EMA = 빠른 기간의 지수이동평균
 * 2. Slow EMA = 느린 기간의 지수이동평균
 * 3. PPO = ((Fast EMA - Slow EMA) / Slow EMA) × 100
 * 4. Signal = PPO의 지수이동평균
 * 5. Histogram = PPO - Signal
 *
 * @param data - 계산할 데이터 배열 (보통 종가)
 * @param fastPeriod - 빠른 EMA 기간 (기본값: 12)
 * @param slowPeriod - 느린 EMA 기간 (기본값: 26)
 * @param signalPeriod - 시그널 EMA 기간 (기본값: 9)
 * @returns {ppo: (number | null)[], signal: (number | null)[], histogram: (number | null)[]} - PPO 구성요소 배열
 */
export function calculatePPO(
    data: number[],
    fastPeriod: number = 12,
    slowPeriod: number = 26,
    signalPeriod: number = 9
): {
    ppo: (number | null)[];
    signal: (number | null)[];
    histogram: (number | null)[];
} {
    // 빈 배열 처리
    if (data.length === 0) {
        return { ppo: [], signal: [], histogram: [] };
    }

    // EMA 계산 함수
    const calculateEMA = (
        sourceData: number[],
        period: number
    ): (number | null)[] => {
        const ema: (number | null)[] = [];
        const k = 2 / (period + 1);

        for (let i = 0; i < period - 1; i++) {
            ema.push(null);
        }

        let sum = 0;
        for (let i = 0; i < period; i++) {
            sum += sourceData[i];
        }
        ema.push(sum / period);

        for (let i = period; i < sourceData.length; i++) {
            const prevEMA = ema[ema.length - 1] as number;
            ema.push(sourceData[i] * k + prevEMA * (1 - k));
        }

        return ema;
    };

    const fastEMA = calculateEMA(data, fastPeriod);
    const slowEMA = calculateEMA(data, slowPeriod);

    // PPO 계산
    const ppo: (number | null)[] = [];
    for (let i = 0; i < data.length; i++) {
        if (i < slowPeriod - 1 || fastEMA[i] === null || slowEMA[i] === null) {
            ppo.push(null);
        } else {
            const fast = fastEMA[i] as number;
            const slow = slowEMA[i] as number;
            ppo.push(((fast - slow) / slow) * 100);
        }
    }

    // PPO에서 null이 아닌 값들만 추출
    const ppoValues: number[] = [];
    let startIndex = 0;
    for (let i = 0; i < ppo.length; i++) {
        if (ppo[i] !== null) {
            if (startIndex === 0) startIndex = i;
            ppoValues.push(ppo[i] as number);
        }
    }

    // Signal 계산
    const signalEMA = calculateEMA(ppoValues, signalPeriod);

    // 결과 배열 구성
    const signal: (number | null)[] = Array(startIndex + signalPeriod - 1).fill(
        null
    );
    for (let i = 0; i < signalEMA.length; i++) {
        if (signalEMA[i] !== null) {
            signal.push(signalEMA[i]);
        }
    }

    // Histogram 계산
    const histogram: (number | null)[] = [];
    for (let i = 0; i < data.length; i++) {
        if (ppo[i] === null || signal[i] === null) {
            histogram.push(null);
        } else {
            histogram.push((ppo[i] as number) - (signal[i] as number));
        }
    }

    return { ppo, signal, histogram };
}
