import * as XLSX from 'xlsx';

// 상수들을 export
export const EXCEL_TEMPLATE_HEADERS = [
    { label: '번호판번호', required: true },
    { label: '업무구분', required: true },
    { label: '공급가액', required: true },
    { label: '차대번호', required: true },
    { label: '차명', required: true },
    { label: '소유자명', required: true },
    { label: 'ID구분', required: true },
    { label: 'ID번호', required: true },
    { label: '공동소유자명', required: false },
    { label: '공동소유자ID구분', required: false },
    { label: '공동소유자ID번호', required: false }
];

export const VALID_BUSINESS_TYPES = ['렌트', '리스', '개인'];
export const VALID_ID_TYPES = ['주민번호', '법인번호'];

// Validation 함수 추가
export const validateBulkData = (data) => {
    const errors = [];

    data.forEach((row, index) => {
        const rowNum = index + 2; // 엑셀의 헤더를 1행으로 계산

        // 필수 필드 검증
        EXCEL_TEMPLATE_HEADERS.forEach(header => {
            if (header.required && (!row[header.label] || String(row[header.label]).trim() === '')) {
                errors.push(`${rowNum}행: ${header.label} 필수 입력값이 누락되었습니다.`);
            }
        });

        // 업무구분 검증
        if (row['업무구분'] && !VALID_BUSINESS_TYPES.includes(row['업무구분'])) {
            errors.push(`${rowNum}행: 업무구분은 '렌트', '리스', '개인' 중 하나여야 합니다.`);
        }

        // ID구분 검증
        if (row['ID구분'] && !VALID_ID_TYPES.includes(row['ID구분'])) {
            errors.push(`${rowNum}행: ID구분은 '주민번호' 또는 '법인번호'여야 합니다.`);
        }

        // 공급가액 숫자 검증
        if (row['공급가액'] && isNaN(Number(row['공급가액']))) {
            errors.push(`${rowNum}행: 공급가액은 숫자여야 합니다.`);
        }

        // 공동소유자 정보 검증
        if (row['공동소유자명']) {
            if (!row['공동소유자ID구분']) {
                errors.push(`${rowNum}행: 공동소유자ID구분이 필요합니다.`);
            }
            if (!row['공동소유자ID번호']) {
                errors.push(`${rowNum}행: 공동소유자ID번호가 필요합니다.`);
            }
            if (row['공동소유자ID구분'] && !VALID_ID_TYPES.includes(row['공동소유자ID구분'])) {
                errors.push(`${rowNum}행: 공동소유자ID구분은 '주민번호' 또는 '법인번호'여야 합니다.`);
            }
        }
    });

    return errors;
};

export const BulkCarRegisterExcel = () => {
    // 헤더 정보 정의
    const headers = [
        '번호판번호', '업무구분', '공급가액', '차대번호', '차명',
        '소유자명', 'ID구분', 'ID번호',
        '공동소유자명', '공동소유자ID구분', '공동소유자ID번호'
    ];

    // 샘플 데이터 생성
    const sampleData = [
        [
            '12가3456', '렌트', '1000000', 'VIN123456789',
            '소나타', '홍길동', '주민번호', '000000-0000000',
            '김철수', '주민번호', '111111-1111111'
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