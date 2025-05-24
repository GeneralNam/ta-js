/**
 * 📊 OBV (On Balance Volume) 계산 함수
 *
 * OBV는 거래량을 누적하여 계산하는 지표입니다.
 * 종가가 이전 종가보다 높으면 거래량을 더하고,
 * 낮으면 거래량을 뺍니다.
 *
 * @param closeData - 종가 배열
 * @param volumeData - 거래량 배열
 * @returns number[] - OBV 값 배열
 */
export function calculateOBV(
    closeData: number[],
    volumeData: number[]
): number[] {
    if (closeData.length !== volumeData.length) {
        throw new Error("종가와 거래량 배열의 길이가 일치해야 합니다.");
    }

    if (closeData.length === 0) {
        return [];
    }

    const obv: number[] = [volumeData[0]]; // 첫 번째 OBV는 첫 거래량과 동일

    for (let i = 1; i < closeData.length; i++) {
        if (closeData[i] > closeData[i - 1]) {
            // 종가가 상승하면 거래량을 더함
            obv.push(obv[i - 1] + volumeData[i]);
        } else if (closeData[i] < closeData[i - 1]) {
            // 종가가 하락하면 거래량을 뺌
            obv.push(obv[i - 1] - volumeData[i]);
        } else {
            // 종가가 같으면 이전 OBV 유지
            obv.push(obv[i - 1]);
        }
    }

    return obv;
}
