import * as XLSX from 'xlsx';

// 상수들을 export - CarRegisterPage와 동일한 구조로 맞추되 실제 엑셀에는 일부만 포함
export const EXCEL_TEMPLATE_HEADERS = [
    { label: '차량번호', required: true, key: 'vhclNo' },
    { label: '업무구분', required: true, key: 'bizDv' },
    { label: '공급가액', required: true, key: 'splyAmt' },
    { label: '차대번호', required: true, key: 'vhidNo' },
    { label: '차명', required: true, key: 'vhclNm' },
    { label: '사용본거지', required: true, key: 'ownrAddress' },
    { label: '번호판종류', required: true, key: 'nopltKind' }
];

// 다운로드 엑셀에 포함할 컬럼만 별도 정의
export const EXCEL_DOWNLOAD_COLUMNS = [
    { label: '공급가액', required: true, key: 'splyAmt' },
    { label: '차대번호', required: true, key: 'vhidNo' },
    { label: '차명', required: true, key: 'vhclNm' }
];

/**
 * 자동차 신규 등록 엑셀 업로드 시 데이터 유효성 검사 함수
 *
 * @param {Array<Object>} data
 * @returns {Array<String>}
 *
 * Required fields for each row:
 * - `vhclNo`: 차량 번호
 * - `bizDv`: 업무구분
 * - `splyAmt`: 공급가액
 * - `vhidNo`: 차대번호
 * - `vhclNm`: 차명
 * - `ownrAddress`: 사용본거지
 * - `nopltKind`: 번호판종류
 */
export const validateBulkData = (data) => {
    const errors = [];
    data.forEach((row, index) => {
        if (!row['vhclNo']) errors.push(`${index + 1}번: 차량번호가 누락되었습니다.`);
        if (!row['bizDv']) errors.push(`${index + 1}번: 업무구분이 누락되었습니다.`);
        if (!row['splyAmt']) errors.push(`${index + 1}번: 공급가액이 누락되었습니다.`);
        if (!row['vhidNo']) errors.push(`${index + 1}번: 차대번호가 누락되었습니다.`);
        if (!row['vhclNm']) errors.push(`${index + 1}번: 차명이 누락되었습니다.`);
        if (!row['ownrAddress']) errors.push(`${index + 1}번: 사용본거지가 누락되었습니다.`);
        if (!row['nopltKind']) errors.push(`${index + 1}번: 번호판종류가 누락되었습니다.`);
    });
    return errors;
};

/**
 * 일괄 자동차 신규등록을 위한 엑셀 파일을 생성하는 함수
 * @param {Array<string>|null} headerNames
 */
export const BulkCarRegisterExcel = (headerNames = null) => {
    // 다운로드할 컬럼만 사용
    const downloadColumns = EXCEL_DOWNLOAD_COLUMNS;

    // 사용자에게 보여질 헤더 이름
    const headers = downloadColumns.map(col => col.label);

    // 샘플 데이터 생성
    const sampleData = [
        [
            '1000000', 'VIN123456789ABCDE', '소나타'
        ]
    ];

    // 워크북 생성
    const wb = XLSX.utils.book_new();

    // 워크시트 생성
    const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);

    // 열 너비 설정
    ws['!cols'] = headers.map(() => ({wch: 15}));

    // 워크북에 워크시트 추가
    XLSX.utils.book_append_sheet(wb, ws, '자동차신규등록양식');

    // 엑셀 파일 생성 및 다운로드
    XLSX.writeFile(wb, '자동차신규등록양식.xlsx');
};