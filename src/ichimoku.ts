/**
 * 📊 일목균형표 (Ichimoku Cloud) 계산 함수
 *
 * 전환선 (Conversion Line) = (9일 고가 + 9일 저가) / 2
 * 기준선 (Base Line) = (26일 고가 + 26일 저가) / 2
 * 선행 스팬1 (Leading Span A) = (전환선 + 기준선) / 2
 * 선행 스팬2 (Leading Span B) = (52일 고가 + 52일 저가) / 2
 * 후행 스팬 (Lagging Span) = 현재 종가를 26일 후행
 *
 * @param highData - 고가 배열
 * @param lowData - 저가 배열
 * @param closeData - 종가 배열
 * @param conversionPeriod - 전환선 기간 (기본값: 9)
 * @param basePeriod - 기준선 기간 (기본값: 26)
 * @param spanBPeriod - 선행 스팬2 기간 (기본값: 52)
 * @param displacement - 후행 스팬 이동 기간 (기본값: 26)
 * @returns {conversion: (number | null)[], base: (number | null)[], spanA: (number | null)[], spanB: (number | null)[], lagging: (number | null)[]} - 일목균형표 구성요소 배열
 */
export function calculateIchimoku(
    highData: number[],
    lowData: number[],
    closeData: number[],
    conversionPeriod: number = 9,
    basePeriod: number = 26,
    spanBPeriod: number = 52,
    displacement: number = 26
): {
    conversion: (number | null)[];
    base: (number | null)[];
    spanA: (number | null)[];
    spanB: (number | null)[];
    lagging: (number | null)[];
} {
    // 빈 배열 처리
    if (highData.length === 0) {
        return {
            conversion: [],
            base: [],
            spanA: [],
            spanB: [],
            lagging: [],
        };
    }

    if (
        highData.length !== lowData.length ||
        highData.length !== closeData.length
    ) {
        throw new Error("고가, 저가, 종가 배열의 길이가 일치해야 합니다.");
    }

    const totalLength = highData.length + displacement;

    // 결과 배열 초기화
    const conversion: (number | null)[] = Array(totalLength).fill(null);
    const base: (number | null)[] = Array(totalLength).fill(null);
    const spanA: (number | null)[] = Array(totalLength).fill(null);
    const spanB: (number | null)[] = Array(totalLength).fill(null);
    const lagging: (number | null)[] = Array(totalLength).fill(null);

    // 기간 내 최고가/최저가 계산 함수
    const calculatePeriodHighLow = (
        start: number,
        period: number
    ): { high: number; low: number } => {
        let high = highData[start];
        let low = lowData[start];

        for (
            let i = start + 1;
            i < start + period && i < highData.length;
            i++
        ) {
            if (highData[i] > high) high = highData[i];
            if (lowData[i] < low) low = lowData[i];
        }

        return { high, low };
    };

    // 전환선 계산 (conversionPeriod-1 인덱스부터 시작)
    for (let i = conversionPeriod - 1; i < highData.length; i++) {
        const conversionHighLow = calculatePeriodHighLow(
            i - conversionPeriod + 1,
            conversionPeriod
        );
        conversion[i] = (conversionHighLow.high + conversionHighLow.low) / 2;
    }

    // 기준선 계산 (basePeriod-1 인덱스부터 시작)
    for (let i = basePeriod - 1; i < highData.length; i++) {
        const baseHighLow = calculatePeriodHighLow(
            i - basePeriod + 1,
            basePeriod
        );
        base[i] = (baseHighLow.high + baseHighLow.low) / 2;
    }

    // 선행 스팬1 계산 (전환선과 기준선이 모두 있는 인덱스부터)
    const spanAStartIndex = Math.max(conversionPeriod - 1, basePeriod - 1);
    for (let i = spanAStartIndex; i < highData.length; i++) {
        if (conversion[i] !== null && base[i] !== null) {
            spanA[i + displacement] =
                ((conversion[i] as number) + (base[i] as number)) / 2;
        }
    }

    // 선행 스팬2 계산 (spanBPeriod-1 인덱스부터 시작)
    for (let i = spanBPeriod - 1; i < highData.length; i++) {
        const spanBHighLow = calculatePeriodHighLow(
            i - spanBPeriod + 1,
            spanBPeriod
        );
        spanB[i + displacement] = (spanBHighLow.high + spanBHighLow.low) / 2;
    }

    // 후행 스팬 계산
    for (let i = displacement; i < highData.length; i++) {
        lagging[i - displacement] = closeData[i];
    }

    return { conversion, base, spanA, spanB, lagging };
}
