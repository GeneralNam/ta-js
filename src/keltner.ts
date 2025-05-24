/**
 * 📊 KELTNER 채널 계산 함수
 *
 * 계산 공식:
 * 1. Middle Line = EMA(Close, period)
 * 2. ATR = Average True Range (period)
 * 3. Upper Band = Middle Line + (multiplier × ATR)
 * 4. Lower Band = Middle Line - (multiplier × ATR)
 *
 * @param highData - 고가 배열
 * @param lowData - 저가 배열
 * @param closeData - 종가 배열
 * @param period - EMA와 ATR 계산 기간 (기본값: 20)
 * @param multiplier - ATR 승수 (기본값: 2)
 * @returns {upper: (number | null)[], middle: (number | null)[], lower: (number | null)[]} - 켈트너 채널 구성요소 배열
 */
export function calculateKELTNER(
    highData: number[],
    lowData: number[],
    closeData: number[],
    period: number = 20,
    multiplier: number = 2
): {
    upper: (number | null)[];
    middle: (number | null)[];
    lower: (number | null)[];
} {
    if (
        highData.length !== lowData.length ||
        highData.length !== closeData.length
    ) {
        throw new Error("고가, 저가, 종가 배열의 길이가 일치해야 합니다.");
    }

    if (highData.length < period + 1) {
        return {
            upper: Array(highData.length).fill(null),
            middle: Array(highData.length).fill(null),
            lower: Array(highData.length).fill(null),
        };
    }

    // EMA 계산 함수
    const calculateEMA = (
        data: number[],
        emaPeriod: number
    ): (number | null)[] => {
        const ema: (number | null)[] = [];
        const k = 2 / (emaPeriod + 1);

        for (let i = 0; i < emaPeriod - 1; i++) {
            ema.push(null);
        }

        let sum = 0;
        for (let i = 0; i < emaPeriod; i++) {
            sum += data[i];
        }
        ema.push(sum / emaPeriod);

        for (let i = emaPeriod; i < data.length; i++) {
            const prevEMA = ema[ema.length - 1] as number;
            ema.push(data[i] * k + prevEMA * (1 - k));
        }

        return ema;
    };

    // ATR 계산
    const calculateATR = (): (number | null)[] => {
        const atr: (number | null)[] = [];

        for (let i = 0; i < period; i++) {
            atr.push(null);
        }

        const tr: number[] = [];
        for (let i = 1; i < highData.length; i++) {
            const trValue = Math.max(
                highData[i] - lowData[i],
                Math.abs(highData[i] - closeData[i - 1]),
                Math.abs(lowData[i] - closeData[i - 1])
            );
            tr.push(trValue);
        }

        // 첫 번째 ATR
        let atrValue =
            tr.slice(0, period).reduce((sum, val) => sum + val, 0) / period;
        atr.push(atrValue);

        // 나머지 ATR
        for (let i = period + 1; i < highData.length; i++) {
            atrValue = (atrValue * (period - 1) + tr[i - 1]) / period;
            atr.push(atrValue);
        }

        return atr;
    };

    // 중간선 (EMA) 계산
    const middle = calculateEMA(closeData, period);

    // ATR 계산
    const atr = calculateATR();

    // 상단/하단 밴드 계산
    const upper: (number | null)[] = [];
    const lower: (number | null)[] = [];

    for (let i = 0; i < highData.length; i++) {
        if (middle[i] === null || atr[i] === null) {
            upper.push(null);
            lower.push(null);
        } else {
            upper.push((middle[i] as number) + multiplier * (atr[i] as number));
            lower.push((middle[i] as number) - multiplier * (atr[i] as number));
        }
    }

    return { upper, middle, lower };
}
