/**
 * 📊 AROON 지표 계산 함수
 *
 * 계산 공식:
 * 1. Aroon Up = ((period - 최고가 이후 경과 기간) / period) × 100
 * 2. Aroon Down = ((period - 최저가 이후 경과 기간) / period) × 100
 * 3. Aroon Oscillator = Aroon Up - Aroon Down
 *
 * @param highData - 고가 배열
 * @param lowData - 저가 배열
 * @param period - AROON 계산 기간 (기본값: 14)
 * @returns {up: (number | null)[], down: (number | null)[], oscillator: (number | null)[]} - AROON 구성요소 배열
 */
export function calculateAROON(
    highData: number[],
    lowData: number[],
    period: number = 14
): {
    up: (number | null)[];
    down: (number | null)[];
    oscillator: (number | null)[];
} {
    if (highData.length !== lowData.length) {
        throw new Error("고가, 저가 배열의 길이가 일치해야 합니다.");
    }

    if (highData.length < period) {
        return {
            up: Array(highData.length).fill(null),
            down: Array(highData.length).fill(null),
            oscillator: Array(highData.length).fill(null),
        };
    }

    const aroonUp: (number | null)[] = [];
    const aroonDown: (number | null)[] = [];
    const aroonOscillator: (number | null)[] = [];

    // 초기 period-1 기간은 null
    for (let i = 0; i < period - 1; i++) {
        aroonUp.push(null);
        aroonDown.push(null);
        aroonOscillator.push(null);
    }

    // AROON 계산
    for (let i = period - 1; i < highData.length; i++) {
        let highestIndex = i - period + 1;
        let lowestIndex = i - period + 1;

        // 기간 내 최고가와 최저가의 인덱스 찾기
        for (let j = i - period + 2; j <= i; j++) {
            if (highData[j] > highData[highestIndex]) {
                highestIndex = j;
            }
            if (lowData[j] < lowData[lowestIndex]) {
                lowestIndex = j;
            }
        }

        // 최고가/최저가 이후 경과 기간 계산
        const daysSinceHigh = i - highestIndex;
        const daysSinceLow = i - lowestIndex;

        // AROON 값 계산
        const up = ((period - daysSinceHigh) / period) * 100;
        const down = ((period - daysSinceLow) / period) * 100;
        const oscillator = up - down;

        aroonUp.push(up);
        aroonDown.push(down);
        aroonOscillator.push(oscillator);
    }

    return { up: aroonUp, down: aroonDown, oscillator: aroonOscillator };
}
