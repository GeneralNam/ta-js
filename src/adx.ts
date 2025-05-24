/**
 * 📊 ADX (Average Directional Index) 계산 함수
 *
 * ADX는 추세의 강도를 측정하는 지표입니다.
 *
 * @param highData - 고가 배열
 * @param lowData - 저가 배열
 * @param closeData - 종가 배열
 * @param period - ADX 계산 기간 (기본값: 14)
 * @returns {adx: (number | null)[], plusDI: (number | null)[], minusDI: (number | null)[]} - ADX, +DI, -DI 배열
 */
export function calculateADX(
    highData: number[],
    lowData: number[],
    closeData: number[],
    period: number = 14
): {
    adx: (number | null)[];
    plusDI: (number | null)[];
    minusDI: (number | null)[];
} {
    if (
        highData.length !== lowData.length ||
        highData.length !== closeData.length
    ) {
        throw new Error("고가, 저가, 종가 배열의 길이가 일치해야 합니다.");
    }

    if (highData.length < period + 1) {
        return {
            adx: Array(highData.length).fill(null),
            plusDI: Array(highData.length).fill(null),
            minusDI: Array(highData.length).fill(null),
        };
    }

    const adx: (number | null)[] = [];
    const plusDI: (number | null)[] = [];
    const minusDI: (number | null)[] = [];

    // 초기 period 기간은 null로 채움
    for (let i = 0; i < period; i++) {
        adx.push(null);
        plusDI.push(null);
        minusDI.push(null);
    }

    // True Range (TR) 계산
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

    // Directional Movement (DM) 계산
    const calculateDM = (
        high: number,
        low: number,
        prevHigh: number,
        prevLow: number
    ): { plusDM: number; minusDM: number } => {
        const upMove = high - prevHigh;
        const downMove = prevLow - low;

        let plusDM = 0;
        let minusDM = 0;

        if (upMove > downMove && upMove > 0) {
            plusDM = upMove;
        }
        if (downMove > upMove && downMove > 0) {
            minusDM = downMove;
        }

        return { plusDM, minusDM };
    };

    // 초기 TR, +DM, -DM 배열 계산
    const tr: number[] = [];
    const plusDM: number[] = [];
    const minusDM: number[] = [];

    for (let i = 1; i < highData.length; i++) {
        tr.push(calculateTR(highData[i], lowData[i], closeData[i - 1]));
        const dm = calculateDM(
            highData[i],
            lowData[i],
            highData[i - 1],
            lowData[i - 1]
        );
        plusDM.push(dm.plusDM);
        minusDM.push(dm.minusDM);
    }

    // 초기 TR14, +DM14, -DM14 계산
    let tr14 = tr.slice(0, period).reduce((sum, val) => sum + val, 0);
    let plusDM14 = plusDM.slice(0, period).reduce((sum, val) => sum + val, 0);
    let minusDM14 = minusDM.slice(0, period).reduce((sum, val) => sum + val, 0);

    // 첫 번째 +DI, -DI 계산
    const firstPlusDI = (plusDM14 / tr14) * 100;
    const firstMinusDI = (minusDM14 / tr14) * 100;
    plusDI.push(firstPlusDI);
    minusDI.push(firstMinusDI);

    // 첫 번째 ADX 계산
    const firstDX =
        (Math.abs(firstPlusDI - firstMinusDI) / (firstPlusDI + firstMinusDI)) *
        100;
    adx.push(firstDX);

    // 나머지 기간의 ADX 계산
    for (let i = period + 1; i < highData.length; i++) {
        // TR14, +DM14, -DM14 업데이트
        tr14 = tr14 - tr14 / period + tr[i - 1];
        plusDM14 = plusDM14 - plusDM14 / period + plusDM[i - 1];
        minusDM14 = minusDM14 - minusDM14 / period + minusDM[i - 1];

        // +DI, -DI 계산
        const currentPlusDI = (plusDM14 / tr14) * 100;
        const currentMinusDI = (minusDM14 / tr14) * 100;
        plusDI.push(currentPlusDI);
        minusDI.push(currentMinusDI);

        // DX 계산
        const dx =
            (Math.abs(currentPlusDI - currentMinusDI) /
                (currentPlusDI + currentMinusDI)) *
            100;

        // ADX 계산
        const prevADX = adx[adx.length - 1] as number;
        const currentADX = (prevADX * (period - 1) + dx) / period;
        adx.push(currentADX);
    }

    return { adx, plusDI, minusDI };
}
