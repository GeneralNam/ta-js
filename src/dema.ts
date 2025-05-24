/**
 * 📊 DEMA (Double Exponential Moving Average) 계산 함수
 *
 * 계산 공식:
 * 1. EMA1 = 데이터의 지수이동평균
 * 2. EMA2 = EMA1의 지수이동평균
 * 3. DEMA = 2 × EMA1 - EMA2
 *
 * DEMA는 지연(lag)을 줄이고 신호의 민감도를 높이기 위해 개발된 지표입니다.
 *
 * @param data - 계산할 데이터 배열 (보통 종가)
 * @param period - EMA 계산 기간 (기본값: 14)
 * @returns (number | null)[] - DEMA 값 배열
 */
export function calculateDEMA(
    data: number[],
    period: number = 14
): (number | null)[] {
    if (data.length < period * 2 - 1) {
        return Array(data.length).fill(null);
    }

    const dema: (number | null)[] = [];

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
    // EMA1에서 null이 아닌 값들만 추출
    const ema1Values: number[] = [];
    for (let i = period - 1; i < ema1.length; i++) {
        ema1Values.push(ema1[i] as number);
    }

    const ema2 = calculateEMA(ema1Values, period);

    // DEMA 계산
    const startIndex = period * 2 - 2; // DEMA 계산이 시작되는 인덱스

    // 초기 부분은 null로 채움
    for (let i = 0; i < startIndex; i++) {
        dema.push(null);
    }

    // DEMA 계산: 2 × EMA1 - EMA2
    for (let i = startIndex; i < data.length; i++) {
        const ema1Value = ema1[i] as number;
        const ema2Index = i - (period - 1);
        const ema2Value = ema2[ema2Index] as number;

        const demaValue = 2 * ema1Value - ema2Value;
        dema.push(demaValue);
    }

    return dema;
}
