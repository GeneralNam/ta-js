/**
 * 📊 Stochastic Oscillator (스토캐스틱 오실레이터) 계산 함수
 *
 * %K = ((현재 종가 - 기간 내 최저가) / (기간 내 최고가 - 기간 내 최저가)) * 100
 * %D = %K의 m 기간 이동 평균 (일반적으로 3)
 *
 * @param highData - 기간 내 고가 배열
 * @param lowData - 기간 내 저가 배열
 * @param closeData - 기간 내 종가 배열
 * @param periodK - %K 계산에 사용할 기간 (일반적으로 14)
 * @param periodD - %D 계산에 사용할 기간 (일반적으로 3)
 * @returns {k: (number | null)[], d: (number | null)[]} - %K와 %D 값 배열 (계산 불가 구간은 null)
 */
export function calculateStochastic(
    highData: number[],
    lowData: number[],
    closeData: number[],
    periodK: number = 14,
    periodD: number = 3
): { k: (number | null)[]; d: (number | null)[] } {
    const kResult: (number | null)[] = [];
    const dResult: (number | null)[] = [];

    // 데이터 길이가 충분하지 않으면 null 반환
    if (
        closeData.length < periodK ||
        highData.length < periodK ||
        lowData.length < periodK
    ) {
        for (let i = 0; i < closeData.length; i++) {
            kResult.push(null);
            dResult.push(null);
        }
        return { k: kResult, d: dResult };
    }

    // %K 값 계산
    for (let i = 0; i < closeData.length; i++) {
        if (i < periodK - 1) {
            // 초기에는 %K 계산 불가
            kResult.push(null);
        } else {
            const startIndex = i - periodK + 1;
            let highestHigh = highData[startIndex];
            let lowestLow = lowData[startIndex];

            // 기간 내 최고가와 최저가 찾기
            for (let j = startIndex + 1; j <= i; j++) {
                if (highData[j] > highestHigh) {
                    highestHigh = highData[j];
                }
                if (lowData[j] < lowestLow) {
                    lowestLow = lowData[j];
                }
            }

            // %K 계산
            if (highestHigh === lowestLow) {
                // 최고가와 최저가가 같으면 0 또는 특정 값으로 처리
                // 보통 이런 경우 %K는 0 또는 100 (종가에 따라)
                // 여기서는 종가가 최저가와 같은 경우를 가정하여 0으로 처리합니다.
                // 실제 데이터에서는 거의 발생하지 않습니다.
                kResult.push(0);
            } else {
                const k =
                    ((closeData[i] - lowestLow) / (highestHigh - lowestLow)) *
                    100;
                kResult.push(k);
            }
        }
    }

    // %D 값 계산 (단순 이동 평균 - SMA)
    // %K가 계산된 시점부터 %D를 계산합니다.
    for (let i = 0; i < kResult.length; i++) {
        // %D는 %K의 periodD 기간 이동 평균이므로,
        // (periodK - 1) + (periodD - 1) 지점부터 유효한 값이 나올 수 있습니다.
        if (i < periodK - 1 + periodD - 1) {
            dResult.push(null);
        } else {
            let sumK = 0;
            let count = 0;
            // 현재 i 시점에서 periodD 이전까지의 %K 값을 더합니다.
            // 예: i가 16 (periodK=14, periodD=3, 첫 유효 %D),
            // kResult[14], kResult[15], kResult[16]을 더합니다.
            for (let j = i - periodD + 1; j <= i; j++) {
                if (kResult[j] !== null) {
                    sumK += kResult[j] as number;
                    count++;
                }
            }
            if (count > 0) {
                dResult.push(sumK / count);
            } else {
                dResult.push(null); // 계산할 %K 값이 없으면 null
            }
        }
    }

    return { k: kResult, d: dResult };
}
