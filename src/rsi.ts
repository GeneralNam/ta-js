/**
 * 📈 RSI (Relative Strength Index) 계산 함수
 *
 * avgGain = gains / period;
 * avgLoss = losses / period;
 * rs = avgGain / avgLoss;
 * rsi = 100 - 100 / (1 + rs);
 *
 *
 * @param data - 종가 배열 (예: [100, 102, 101, 105, ...])
 * @param period - 평균을 구할 기간 (보통 14)
 * @returns RSI 값 배열 (계산 불가 구간은 null)
 */
export function calculateRSI(
    data: number[],
    period: number = 14
): (number | null)[] {
    const result: (number | null)[] = [];

    if (data.length <= period) {
        return data.map(() => null);
    }

    let gains = 0;
    let losses = 0;

    // 초기 period만큼 상승/하락 누적 계산
    for (let i = 1; i <= period; i++) {
        const diff = data[i] - data[i - 1];
        if (diff >= 0) gains += diff;
        else losses += -diff;
        result.push(null); // 초기에는 계산 안 함
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;
    let rs = avgGain / avgLoss;
    result.push(100 - 100 / (1 + rs)); // 첫 RSI

    // 이후 RSI 계산
    for (let i = period + 1; i < data.length; i++) {
        const diff = data[i] - data[i - 1];
        const gain = diff > 0 ? diff : 0;
        const loss = diff < 0 ? -diff : 0;

        avgGain = (avgGain * (period - 1) + gain) / period;
        avgLoss = (avgLoss * (period - 1) + loss) / period;

        rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        const rsi = avgLoss === 0 ? 100 : 100 - 100 / (1 + rs);

        result.push(rsi);
    }

    return result;
}
