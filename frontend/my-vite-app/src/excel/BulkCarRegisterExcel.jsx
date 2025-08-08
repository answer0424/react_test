import * as XLSX from 'xlsx';

// 상수들을 export
export const EXCEL_TEMPLATE_HEADERS = [
    { label: '차량번호', required: true },
    { label: '업무구분', required: true },
    { label: '공급가액', required: true },
    { label: '차대번호', required: true },
    { label: '차명', required: true },
    { label: '사용본거지', required: true },
];

export const VALID_BUSINESS_TYPES = ['렌트', '리스', '개인'];

// Validation 함수 추가
export const validateBulkData = (data) => {
    const errors = [];
    data.forEach((row, index) => {
        if (!row['차량번호']) errors.push(`${index + 1}번: 차량번호가 누락되었습니다.`);
        if (!row['업무구분']) errors.push(`${index + 1}번: 업무구분이 누락되었습니다.`);
        if (!row['공급가액']) errors.push(`${index + 1}번: 공급가액이 누락되었습니다.`);
        if (!row['차대번호']) errors.push(`${index + 1}번: 차대번호가 누락되었습니다.`);
        if (!row['차명']) errors.push(`${index + 1}번: 차명이 누락되었습니다.`);
        if (!row['사용본거지']) errors.push(`${index + 1}번: 사용본거지가 누락되었습니다.`);
    });
    return errors;
};

export const BulkCarRegisterExcel = () => {
    // 헤더 정보 정의
    const headers = [
        '차량번호', '업무구분', '공급가액', '차대번호', '차명', '사용본거지'
    ];

    // 샘플 데이터 생성
    const sampleData = [
        [
            '12가3456', '렌트', '1000000', 'VIN123456789', '소나타', 'CARBANG'
        ]
    ];

    // 워크북 생성
    const wb = XLSX.utils.book_new();

    // 워크시트 생성
    const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);

    // 열 너비 설정
    ws['!cols'] = headers.map(() => ({wch: 15}));

    // 워크북에 워크시트 추가
    XLSX.utils.book_append_sheet(wb, ws, '차량등록양식');

    // 엑셀 파일 생성 및 다운로드
    XLSX.writeFile(wb, '차량등록양식.xlsx');
};