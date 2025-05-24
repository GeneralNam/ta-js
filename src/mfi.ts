/**
 * 📊 MFI (Money Flow Index) 계산 함수
 *
 * 계산 공식:
 * 1. Typical Price = (고가 + 저가 + 종가) / 3
 * 2. Raw Money Flow = Typical Price × Volume
 * 3. Money Flow Direction:
 *    - 현재 TP > 이전 TP: Positive Money Flow
 *    - 현재 TP < 이전 TP: Negative Money Flow
 *    - 현재 TP = 이전 TP: 변화 없음
 * 4. Money Ratio = n기간 Positive MF 합 / n기간 Negative MF 합
 * 5. MFI = 100 - (100 / (1 + Money Ratio))
 *
 * @param highData - 고가 배열
 * @param lowData - 저가 배열
 * @param closeData - 종가 배열
 * @param volumeData - 거래량 배열
 * @param period - MFI 계산 기간 (기본값: 14)
 * @returns (number | null)[] - MFI 값 배열
 */
export function calculateMFI(
    highData: number[],
    lowData: number[],
    closeData: number[],
    volumeData: number[],
    period: number = 14
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

    if (highData.length < period + 1) {
        return Array(highData.length).fill(null);
    }

    const mfi: (number | null)[] = [];

    // 초기 period 기간은 null로 채움
    for (let i = 0; i < period; i++) {
        mfi.push(null);
    }

    // Typical Price와 Raw Money Flow 계산
    const typicalPrices: number[] = [];
    const rawMoneyFlows: number[] = [];

    for (let i = 0; i < highData.length; i++) {
        const tp = (highData[i] + lowData[i] + closeData[i]) / 3;
        typicalPrices.push(tp);
        rawMoneyFlows.push(tp * volumeData[i]);
    }

    // MFI 계산
    for (let i = period; i < highData.length; i++) {
        let positiveMoneyFlow = 0;
        let negativeMoneyFlow = 0;

        // 기간 내 Positive/Negative Money Flow 계산
        for (let j = i - period + 1; j <= i; j++) {
            if (j === 0) {
                // 첫 번째 데이터는 비교할 이전 값이 없으므로 건너뜀
                continue;
            }

            if (typicalPrices[j] > typicalPrices[j - 1]) {
                // Typical Price가 상승한 경우 Positive Money Flow
                positiveMoneyFlow += rawMoneyFlows[j];
            } else if (typicalPrices[j] < typicalPrices[j - 1]) {
                // Typical Price가 하락한 경우 Negative Money Flow
                negativeMoneyFlow += rawMoneyFlows[j];
            }
            // 같은 경우는 Money Flow에 포함하지 않음
        }

        // MFI 계산
        if (negativeMoneyFlow === 0) {
            // Negative Money Flow가 0이면 MFI는 100
            mfi.push(100);
        } else {
            const moneyRatio = positiveMoneyFlow / negativeMoneyFlow;
            const mfiValue = 100 - 100 / (1 + moneyRatio);
            mfi.push(mfiValue);
        }
    }

    return mfi;
}
