/**
 * 📊 TEMA (Triple Exponential Moving Average) 계산 함수
 *
 * 계산 공식:
 * 1. EMA1 = 데이터의 지수이동평균
 * 2. EMA2 = EMA1의 지수이동평균
 * 3. EMA3 = EMA2의 지수이동평균
 * 4. TEMA = 3 × EMA1 - 3 × EMA2 + EMA3
 *
 * TEMA는 DEMA보다 더 민감하며, 지연을 더욱 줄이기 위해 개발된 지표입니다.
 *
 * @param data - 계산할 데이터 배열 (보통 종가)
 * @param period - EMA 계산 기간 (기본값: 14)
 * @returns (number | null)[] - TEMA 값 배열
 */
export function calculateTEMA(
    data: number[],
    period: number = 14
): (number | null)[] {
    if (data.length < period * 3 - 2) {
        return Array(data.length).fill(null);
    }

    const tema: (number | null)[] = [];

    // EMA 계산 함수
    const calculateEMA = (
        sourceData: number[],
        emaPeriod: number
    ): (number | null)[] => {
        const ema: (number | null)[] = [];
        const k = 2 / (emaPeriod + 1);

        // 초기 period-1 기간은 null
        for (let i = 0; i < emaPeriod - 1; i++) {
            ema.push(null);
        }

        // 첫 번째 EMA는 SMA로 계산
        let sum = 0;
        for (let i = 0; i < emaPeriod; i++) {
            sum += sourceData[i];
        }
        ema.push(sum / emaPeriod);

        // 나머지 EMA 계산
        for (let i = emaPeriod; i < sourceData.length; i++) {
            const prevEMA = ema[ema.length - 1] as number;
            ema.push(sourceData[i] * k + prevEMA * (1 - k));
        }

        return ema;
    };

    // 첫 번째 EMA 계산
    const ema1 = calculateEMA(data, period);

    // 두 번째 EMA 계산 (EMA1의 EMA)
    const ema1Values: number[] = [];
    for (let i = period - 1; i < ema1.length; i++) {
        ema1Values.push(ema1[i] as number);
    }
    const ema2 = calculateEMA(ema1Values, period);

    // 세 번째 EMA 계산 (EMA2의 EMA)
    const ema2Values: number[] = [];
    for (let i = period - 1; i < ema2.length; i++) {
        ema2Values.push(ema2[i] as number);
    }
    const ema3 = calculateEMA(ema2Values, period);

    // TEMA 계산
    const startIndex = period * 3 - 3; // TEMA 계산이 시작되는 인덱스

    // 초기 부분은 null로 채움
    for (let i = 0; i < startIndex; i++) {
        tema.push(null);
    }

    // TEMA 계산: 3 × EMA1 - 3 × EMA2 + EMA3
    for (let i = startIndex; i < data.length; i++) {
        const ema1Value = ema1[i] as number;
        const ema2Index = i - (period - 1);
        const ema2Value = ema2[ema2Index] as number;
        const ema3Index = i - (period * 2 - 2);
        const ema3Value = ema3[ema3Index] as number;

        const temaValue = 3 * ema1Value - 3 * ema2Value + ema3Value;
        tema.push(temaValue);
    }

    return tema;
}
