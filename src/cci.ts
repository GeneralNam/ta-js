/**
 * 📊 CCI (Commodity Channel Index) 계산 함수
 *
 * 계산 공식:
 * 1. TP (Typical Price) = (고가 + 저가 + 종가) / 3
 * 2. SMA(TP) = TP의 n기간 단순이동평균
 * 3. 평균편차 = |TP - SMA(TP)|의 n기간 평균
 * 4. CCI = (TP - SMA(TP)) / (0.015 * 평균편차)
 *
 * @param highData - 고가 배열
 * @param lowData - 저가 배열
 * @param closeData - 종가 배열
 * @param period - CCI 계산 기간 (기본값: 20)
 * @returns (number | null)[] - CCI 값 배열
 */
export function calculateCCI(
    highData: number[],
    lowData: number[],
    closeData: number[],
    period: number = 20
): (number | null)[] {
    if (
        highData.length !== lowData.length ||
        highData.length !== closeData.length
    ) {
        throw new Error("고가, 저가, 종가 배열의 길이가 일치해야 합니다.");
    }

    if (highData.length < period) {
        return Array(highData.length).fill(null);
    }

    const cci: (number | null)[] = [];

    // 초기 period-1 기간은 null로 채움
    for (let i = 0; i < period - 1; i++) {
        cci.push(null);
    }

    // 전체 데이터의 Typical Price 계산
    const typicalPrices: number[] = [];
    for (let i = 0; i < highData.length; i++) {
        typicalPrices.push((highData[i] + lowData[i] + closeData[i]) / 3);
    }

    // CCI 계산
    for (let i = period - 1; i < highData.length; i++) {
        // TP의 SMA 계산
        let tpSum = 0;
        for (let j = i - period + 1; j <= i; j++) {
            tpSum += typicalPrices[j];
        }
        const tpSMA = tpSum / period;

        // 평균 편차 계산
        let deviationSum = 0;
        for (let j = i - period + 1; j <= i; j++) {
            deviationSum += Math.abs(typicalPrices[j] - tpSMA);
        }
        const meanDeviation = deviationSum / period;

        // CCI 계산
        if (meanDeviation === 0) {
            // 평균 편차가 0인 경우 0으로 처리
            cci.push(0);
        } else {
            const cciValue =
                (typicalPrices[i] - tpSMA) / (0.015 * meanDeviation);
            cci.push(cciValue);
        }
    }

    return cci;
}
