/**
 * 📊 VWAP (Volume Weighted Average Price) 계산 함수
 *
 * 계산 공식:
 * 1. Typical Price = (고가 + 저가 + 종가) / 3
 * 2. PV (Price Volume) = Typical Price × Volume
 * 3. Cumulative PV = 기간 내 PV의 누적 합
 * 4. Cumulative Volume = 기간 내 거래량의 누적 합
 * 5. VWAP = Cumulative PV / Cumulative Volume
 *
 * @param highData - 고가 배열
 * @param lowData - 저가 배열
 * @param closeData - 종가 배열
 * @param volumeData - 거래량 배열
 * @param period - VWAP 계산 기간 (기본값: 20, 0이면 전체 기간 누적)
 * @returns (number | null)[] - VWAP 값 배열
 */
export function calculateVWAP(
    highData: number[],
    lowData: number[],
    closeData: number[],
    volumeData: number[],
    period: number = 20
): (number | null)[] {
    if (
        highData.length !== lowData.length ||
        highData.length !== closeData.length ||
        highData.length !== volumeData.length
    ) {
        throw new Error(
            "고가, 저가, 종가, 거래량 배열의 길이가 일치해야 합니다."
        );
    }

    if (highData.length === 0) {
        return [];
    }

    const vwap: (number | null)[] = [];

    // Typical Price 계산
    const typicalPrices: number[] = [];
    for (let i = 0; i < highData.length; i++) {
        typicalPrices.push((highData[i] + lowData[i] + closeData[i]) / 3);
    }

    // period가 0이면 전체 기간 누적 VWAP
    if (period === 0) {
        let cumulativePV = 0;
        let cumulativeVolume = 0;

        for (let i = 0; i < highData.length; i++) {
            cumulativePV += typicalPrices[i] * volumeData[i];
            cumulativeVolume += volumeData[i];

            if (cumulativeVolume === 0) {
                vwap.push(null);
            } else {
                vwap.push(cumulativePV / cumulativeVolume);
            }
        }
    } else {
        // 기간별 VWAP 계산
        for (let i = 0; i < highData.length; i++) {
            if (i < period - 1) {
                // 초기 period-1 기간은 null
                vwap.push(null);
            } else {
                let cumulativePV = 0;
                let cumulativeVolume = 0;

                // 기간 내 PV와 Volume 누적
                for (let j = i - period + 1; j <= i; j++) {
                    cumulativePV += typicalPrices[j] * volumeData[j];
                    cumulativeVolume += volumeData[j];
                }

                // VWAP 계산
                if (cumulativeVolume === 0) {
                    vwap.push(null);
                } else {
                    vwap.push(cumulativePV / cumulativeVolume);
                }
            }
        }
    }

    return vwap;
}

/**
 * 📊 일중 VWAP (Intraday VWAP) 계산 함수
 *
 * 하루의 시작부터 현재까지의 누적 VWAP를 계산합니다.
 *
 * @param highData - 고가 배열
 * @param lowData - 저가 배열
 * @param closeData - 종가 배열
 * @param volumeData - 거래량 배열
 * @returns (number | null)[] - 일중 VWAP 값 배열
 */
export function calculateIntradayVWAP(
    highData: number[],
    lowData: number[],
    closeData: number[],
    volumeData: number[]
): (number | null)[] {
    if (
        highData.length !== lowData.length ||
        highData.length !== closeData.length ||
        highData.length !== volumeData.length
    ) {
        throw new Error(
            "고가, 저가, 종가, 거래량 배열의 길이가 일치해야 합니다."
        );
    }

    if (highData.length === 0) {
        return [];
    }

    const vwap: (number | null)[] = [];
    let cumulativePV = 0;
    let cumulativeVolume = 0;

    // Typical Price 계산
    for (let i = 0; i < highData.length; i++) {
        const typicalPrice = (highData[i] + lowData[i] + closeData[i]) / 3;
        cumulativePV += typicalPrice * volumeData[i];
        cumulativeVolume += volumeData[i];

        if (cumulativeVolume === 0) {
            vwap.push(null);
        } else {
            vwap.push(cumulativePV / cumulativeVolume);
        }
    }

    return vwap;
}
