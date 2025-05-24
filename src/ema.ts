/**
 * 📈 지수 이동 평균(EMA) 계산 함수
 * EMAₜ = α × 가격ₜ + (1 - α) × EMAₜ₋₁
 * α (알파) = 가중치 계수 = 2 / (N + 1)
 * N = 기간 (예: 12일 EMA) 며칠의 평균을 계산할지
 *
 * @param data - 숫자 배열 (보통 종가 배열)
 *   예: [100, 102, 104, 103, 105, ...]
 * @param period - EMA 기간 (예: 10, 20, 50)
 * @returns EMA 배열 (처음 몇 개는 null로 시작)
 */
export function calculateEMA(
  data: number[],
  period: number
): (number | null)[] {
  const result: (number | null)[] = [];

  if (data.length < period) {
    // 데이터가 부족한 경우 전부 null
    return data.map(() => null);
  }

  // 스무딩 상수 α = 2 / (n + 1)
  const alpha = 2 / (period + 1);

  // 첫 EMA는 SMA로 초기화
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i];
    result.push(null); // 첫 period-1 구간은 null
  }

  let prevEMA = sum / period;
  result.push(prevEMA); // 첫 EMA = 초기 SMA

  // 이후 EMA 계산
  for (let i = period; i < data.length; i++) {
    const price = data[i];
    const ema = alpha * price + (1 - alpha) * prevEMA;
    result.push(ema);
    prevEMA = ema; // 다음 반복을 위한 저장
  }

  return result;
}
