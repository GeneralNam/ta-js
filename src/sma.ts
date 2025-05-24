/**
 * 📊 단순 이동 평균(SMA) 계산 함수
 * 그냥 특정기간의 평균 구한거임
 * SMA = (P₁ + P₂ + ... + Pₙ) / N
 *
 * @param data - 숫자 배열 (보통 종가(close) 배열)
 *   예: [100, 102, 101, 105, 107, ...]
 * @param period - 이동 평균을 계산할 기간 (윈도우 크기)
 *   예: 5 → 5일간의 평균을 계산함
 * @returns 각 시점의 SMA 값 (계산 불가능한 구간은 null)
 *   예: [null, null, null, null, 103, 103.8, ...]
 */
export function calculateSMA(
    data: number[],
    period: number
): (number | null)[] {
    const result: (number | null)[] = [];

    for (let i = 0; i < data.length; i++) {
        // 기간보다 짧으면 계산 불가능 → null
        // i는 그 기간부터 period길이만큼 이전의 데이터로 계산하라는 것
        if (i < period - 1) {
            result.push(null);
            continue;
        }

        // 현재 인덱스 기준으로 period 길이만큼 자름
        const slice = data.slice(i - period + 1, i + 1);

        // 자른 구간의 평균 계산
        const sum = slice.reduce((acc, val) => acc + val, 0);
        result.push(sum / period);
    }

    return result;
}
