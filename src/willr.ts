/**
 * 📊 Williams %R 계산 함수
 *
 * 계산 공식:
 * %R = ((기간 내 최고가 - 현재 종가) / (기간 내 최고가 - 기간 내 최저가)) × -100
 *
 * Williams %R는 스토캐스틱과 유사하지만 -100과 0 사이의 값을 갖습니다.
 * - -80 이하: 과매도 상태
 * - -20 이상: 과매수 상태
 *
 * @param highData - 고가 배열
 * @param lowData - 저가 배열
 * @param closeData - 종가 배열
 * @param period - Williams %R 계산 기간 (기본값: 14)
 * @returns (number | null)[] - Williams %R 값 배열
 */
export function calculateWILLR(
    highData: number[],
    lowData: number[],
    closeData: number[],
    period: number = 14
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

    const willr: (number | null)[] = [];

    // 초기 period-1 기간은 null로 채움
    for (let i = 0; i < period - 1; i++) {
        willr.push(null);
    }

    // Williams %R 계산
    for (let i = period - 1; i < highData.length; i++) {
        // 기간 내 최고가와 최저가 찾기
        let highestHigh = highData[i - period + 1];
        let lowestLow = lowData[i - period + 1];

        for (let j = i - period + 2; j <= i; j++) {
            if (highData[j] > highestHigh) {
                highestHigh = highData[j];
            }
            if (lowData[j] < lowestLow) {
                lowestLow = lowData[j];
            }
        }

        // Williams %R 계산
        if (highestHigh === lowestLow) {
            // 최고가와 최저가가 같으면 0으로 처리
            willr.push(0);
        } else {
            const willrValue =
                ((highestHigh - closeData[i]) / (highestHigh - lowestLow)) *
                -100;
            willr.push(willrValue);
        }
    }

    return willr;
}
