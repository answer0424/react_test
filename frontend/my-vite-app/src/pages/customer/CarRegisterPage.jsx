// CarRegisterPage.jsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BulkCarRegisterExcel } from '../../excel/BulkCarRegisterExcel';
import {useUser} from "../../contexts/UserProvider.jsx";
import { dummyCompanyList, dummyRegistableCarNumber } from '../../services/CarRegisterDummyData.jsx';
import RegisterSuccessModal from '../../components/RegisterSuccessModal.jsx';
import ExcelValidationErrorModal from '../../components/ExcelValidationErrorModal.jsx';
import LoginRequiredModal from '../../components/UserInfoRequiredModal.jsx';
import PlateSearchModal from '../../components/PlateSearchModal.jsx';
import CarRegisterFailureModal from '../../components/CarRegisterFailureModal.jsx';
import '../../assets/css/customer.css';

const INITIAL_FORM_STATE = {
    plateId: '',
    businessType: '',
    price: '',
    vinNumber: '',
    carName: '',
    ownerName: '',
    idType: 'business',
    idNumber: '',
};

// 엑셀 파일 생성 header 항목
const CAR_REGISTER_EXCEL_COLUMNS = [
    { key: 'index', name: '번호' },
    { key: '차량번호', name: '차량번호' },
    { key: '업무구분', name: '업무구분' },
    { key: '공급가액', name: '공급가액' },
    { key: '차대번호', name: '차대번호' },
    { key: '차명', name: '차명' },
    { key: '사용본거지', name: '사용본거지' },
];

// 그리드 생성 시 업무구분 선택항목
const BUSINESS_TYPES = [
    { code: '01', name: '렌트' },
    { code: '02', name: '리스' },
    { code: '03', name: '개인' },
];

/**
 * 자동차 신규 개별, 일괄 등록 페이지 컴포넌트
 * @returns {JSX.Element}
 * @constructor
 */
export default function CarRegisterPage() {
    // 상태 선언
    const [activeTab, setActiveTab] = useState('single');                   // 활성 탭 상태
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);                      // 폼 상태
    const [selectedPlate, setSelectedPlate] = useState(null);                      // 선택된 차량번호 상태
    const [isPlateModalOpen, setIsPlateModalOpen] = useState(null);                // 차량번호 선택 팝업 상태
    const [bulkFile, setBulkFile] = useState(null);                                // 업로드된 엑셀 파일 상태
    const [rows, setRows] = useState([]);                                   // 행 상태
    const [bulkData, setBulkData] = useState([]);                           // 업로드된 엑셀 내부 데이터 상태
    const [validationErrors, setValidationErrors] = useState([]);           // 유효성 검사 상태
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);      // 에러 모달 상태
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);  // 등록 성공 모달 상태
    const [registeredCount, setRegisteredCount] = useState(0);            // 등록된 차량 데이터 개수 상태
    const [formErrors, setFormErrors] = useState({});                         // 개별 등록 에러 상태
    const [isFailureModalOpen, setIsFailureModalOpen] = useState(false);  // 실패 모달 상태


    // hook: 사용자 정보, 네비게이트
    const { user } = useUser();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [userInfoRequiredModalOpen, setUserInfoRequiredModalOpen] = useState(false);


    // 로그인 체크
    useEffect(() => {
        if (!user) setUserInfoRequiredModalOpen(true);
    }, [user, navigate]);


    if (!user || !user.username) {
        return <LoginRequiredModal open={userInfoRequiredModalOpen} />;
    }

    /* ---------- 이벤트 핸들러 ---------- */

    // 개별 등록 폼 제출
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 유효성 검사
        const errors = {};

        // 차량번호 유효성 검사
        if (!selectedPlate) {
            errors.plateId = '차량번호를 선택해주세요.';
        }

        // 차대번호 유효성 검사
        if (!formData.vinNumber) {
            errors.vinNumber = '차대번호를 입력해주세요.';
        } else if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(formData.vinNumber)) {
            errors.vinNumber = '유효한 차대번호 형식이 아닙니다. (17자리 영숫자)';
        }

        // 업무구분 유효성 검사
        if (!formData.businessType) {
            errors.businessType = '업무구분을 선택해주세요.';
        }

        // 공급가액 유효성 검사
        if (!formData.price) {
            errors.price = '공급가액을 입력해주세요.';
        }

        // 차명 유효성 검사
        if (!formData.carName) {
            errors.carName = '차명을 입력해주세요.';
        }

        // 오류가 있으면 폼 제출 중단하고 오류 모달 표시
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            setIsFailureModalOpen(true);
            return;
        }

        // 오류가 없으면 폼 제출 진행
        console.log('개별 등록 데이터:', formData);

        // TODO 차량 등록 API 호출
        try {
            // API 호출용 데이터 준비
            const requestData = {
                data: {
                    vcexSvcMgntNo:'00000001',                                       // 대행서비스관리번호
                    mgntCrpnNo: '0000000000',                                       // 관리법인번호
                    vcexCrpnNo: 'Carbang',                                          // 대행법인번호
                    bizDv: formData.businessType,                                   // 업무구분
                    vhclNo: selectedPlate?.number || '',                            // 차량번호
                    splyAmt: formData.price,                                        // 공급가액
                    vhidNo: formData.vinNumber,                                     // 차대번호
                    vhclNm: formData.carName,                                       // 차명
                    ownrNm: formData.ownerName || 'BMW파이낸셜서비스코리아(주)',       // 소유자명
                    ownrCrpnNo: formData.idNumber || '0000000000',                  // 법인번호
                    ownrAddress: formData.location || '',                           // 사용본거지
                    bondDcDv: '',                                                   // 채권할인구분
                    nopltKind: '필름',                                               // 번호판종류
                    crpnNopltYn: parseInt(formData.price) > 80000000 ? '1' : '',    // 법인번호판(연두)여부
                    rduDav: '',                                                     // 감면구분
                }
            };

            console.log('API 요청 데이터:', requestData);

            // API 호출
            const response = await fetch('https://autodev.gtinc.co.kr/Interface/NewCarApi.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain', // 서버 예시에 맞춤
                },
                body: JSON.stringify(requestData) // JSON 그대로 전송
            });

            const text = await response.text();
            console.log('서버 원본 응답:', text);

            let result;
            try {
                result = JSON.parse(text);
            } catch (e) {
                console.error('JSON 파싱 실패:', e);
                throw e;
            }

            console.log('API 응답 결과:', result);


            // 응답 처리
            if (result.success) {
                // 성공 시 폼 초기화
                setFormData(INITIAL_FORM_STATE);
                setSelectedPlate(null);
                setFormErrors({});
                setIsSuccessModalOpen(true);
                setRegisteredCount(1);
            } else {
                // API에서 오류 반환 시
                setFormErrors({
                    apiError: result.message || '차량 등록 중 오류가 발생했습니다.'
                });
                setIsFailureModalOpen(true);
            }
        } catch (error) {
            console.error('차량 등록 API 오류:', error);
            setFormErrors({
                apiError: '서버 연결 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
            });
            setIsFailureModalOpen(true);
        } finally {
            // 로딩 상태 해제 (필요시)
            // setIsLoading(false);
        }
    };

    // 개별 등록 폼 입력값 변경
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // form 데이터 업데이트
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        // 사용본거지(location) 선택 시 해당하는 회사 정보를 찾아서 소유자명과 법인번호 자동 설정
        if (name === 'location' && value) {
            const selectedCompany = dummyCompanyList.find(company => company.name === value);
            if (selectedCompany) {
                setFormData(prev => ({
                    ...prev,
                    ownerName: selectedCompany.ownerName || '',
                    idNumber: selectedCompany.coNo || ''
                }));
            }
        }
    };

    const handleLocationChange = (rowIdx, value) => {
        handleCellChange(rowIdx, '사용본거지', value);

        // 선택한 회사 정보 찾기
        const selectedCompany = dummyCompanyList.find(company => company.name === value);
        if (selectedCompany) {
            // 회사 정보를 행 데이터에 추가 (화면에는 보이지 않지만 API 요청 시 사용)
            handleCellChange(rowIdx, '_ownerName', selectedCompany.ownerName);
            handleCellChange(rowIdx, '_corpNumber', selectedCompany.coNo);
        }
    };

    // 엑셀 파일 업로드
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        setBulkFile(file);

        const XLSX = await import('xlsx');
        const reader = new FileReader();

        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws, { header: 0 });

            // index 부여
            const indexedRows = data.map((row, idx) => ({ index: idx + 1, ...row }));
            setRows(indexedRows);
            setBulkData(indexedRows.map(({ index, ...rest }) => rest));
        };

        reader.readAsArrayBuffer(file);
    };

    // 양식 다운로드
    const handleTemplateDownload = (e) => {
        e.preventDefault();
        BulkCarRegisterExcel(CAR_REGISTER_EXCEL_COLUMNS.map((col) => col.name));
    };

    // 엑셀 셀 변경 처리 (일괄 등록)
    const handleCellChange = (rowIdx, key, value) => {
        setRows((prev) =>
            prev.map((row, idx) => (idx === rowIdx ? { ...row, [key]: value } : row))
        );
    };

    // 공급가액 개별 입력 시 숫자만 필터링
    const handlePriceChange = (e) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, '');
        setFormData((prev) => ({ ...prev, price: rawValue }));
    };

    // 공급가액 일괄 입력 시 숫자만 필터링
    const handleBulkPriceChange = (rowIdx, value) => {
        const rawValue = value.replace(/[^0-9]/g, '');
        handleCellChange(rowIdx, '공급가액', rawValue);
    };

    // 차량번호 셀 클릭 → 모달 열기
    const handlePlateCellClick = (rowIdx) => {
        setIsPlateModalOpen(rowIdx);
    };

    // 차량번호 선택 후 처리
    const handlePlateSelect = (plate) => {
        if (isPlateModalOpen !== null) {
            handleCellChange(isPlateModalOpen, '차량번호', plate.number);
            setIsPlateModalOpen(null);
        }
    };

    // 일괄 등록 제출
    const handleBulkSubmit = async (e) => {
        e.preventDefault();
        if (rows.length === 0) {
            setValidationErrors(['업로드된 데이터가 없습니다.']);
            setIsErrorModalOpen(true);
            return;
        }

        // 유효성 검사
        const errors = [];
        const validRows = [];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const rowErrors = [];

            // 필수 항목 검사
            if (!row['차량번호']) rowErrors.push(`${i+1}번 행: 차량번호가 없습니다.`);
            if (!row['업무구분']) rowErrors.push(`${i+1}번 행: 업무구분을 선택해주세요.`);
            if (!row['공급가액']) rowErrors.push(`${i+1}번 행: 공급가액을 입력해주세요.`);
            if (!row['차대번호']) rowErrors.push(`${i+1}번 행: 차대번호를 입력해주세요.`);
            else if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(row['차대번호'])) {
                rowErrors.push(`${i+1}번 행: 유효한 차대번호 형식이 아닙니다. (17자리 영숫자)`);
            }
            if (!row['차명']) rowErrors.push(`${i+1}번 행: 차명을 입력해주세요.`);

            if (rowErrors.length > 0) {
                errors.push(...rowErrors);
            } else {
                validRows.push(row);
            }
        }

        if (errors.length > 0) {
            setValidationErrors(errors);
            setIsErrorModalOpen(true);
            return;
        }

        try {
            // API 호출용 데이터 준비
            const requestData = {
                data: validRows.map(row => {
                    // 차량번호로 플레이트 ID 찾기
                    const plateInfo = dummyRegistableCarNumber.find(plate => plate.number === row['차량번호']);
                    // 사용본거지로 회사 정보 찾기
                    const companyInfo = dummyCompanyList.find(company => company.name === row['사용본거지']);
                    // 공급가액 숫자 변환
                    const priceValue = row['공급가액'].replace(/,/g, '');

                    return {
                        vcexSvcMgntNo: '00000001',
                        mgntCrpnNo: '0000000000',
                        vcexCrpnNo: 'Carbang',
                        bizDv: row['업무구분'],
                        vhclNo: row['차량번호'],
                        splyAmt: row['공급가액'].replace(/,/g, ''),
                        vhidNo: row['차대번호'],
                        vhclNm: row['차명'],
                        ownrNm: row['_ownerName'] || companyInfo?.ownerName || 'BMW파이낸셜서비스코리아(주)',
                        ownrCrpnNo: row['_corpNumber'] || companyInfo?.coNo || '0000000000',
                        ownrAddress: row['사용본거지'] || '',
                        bondDcDv: '',
                        nopltKind: '필름',
                        crpnNopltYn: parseInt(priceValue) > 80000000 ? '1' : '',
                        rduDav: '',
                    };
                })
            };

            console.log('일괄 등록 API 요청 데이터:', requestData);

            // API 호출
            const response = await fetch('https://autodev.gtinc.co.kr/Interface/NewCarApi.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                throw new Error(`API 오류: ${response.status}`);
            }

            const result = await response.json();
            console.log('일괄 등록 API 응답 결과:', result);

            // 응답 처리
            if (result.success) {
                // 성공 시 초기화
                setRows([]);
                setBulkFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                setRegisteredCount(validRows.length);
                setIsSuccessModalOpen(true);
            } else {
                // API에서 오류 반환 시
                setValidationErrors([result.message || '차량 등록 중 오류가 발생했습니다.']);
                setIsErrorModalOpen(true);
            }
        } catch (error) {
            console.error('일괄 등록 API 오류:', error);
            setValidationErrors(['서버 연결 오류가 발생했습니다. 잠시 후 다시 시도해주세요.']);
            setIsErrorModalOpen(true);
        }
    };

    // 업로드 파일 및 데이터 초기화
    const handleClearGrid = () => {
        setRows([]);
        setBulkFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    /* ---------- 렌더링 ---------- */
    return (
        <div className="wrap">
            <div className="register_box">
                <h1 className="title">자동차 신규 등록</h1>
                <div className="register-tabs">
                    <button
                        className={`tab-button ${activeTab === 'single' ? 'active' : ''}`}
                        onClick={() => setActiveTab('single')}
                    >
                        개별 등록
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'bulk' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bulk')}
                    >
                        일괄 등록
                    </button>
                </div>

                {/* 개별 등록 폼 */}
                {activeTab === 'single' ? (
                    <form id="registerForm" onSubmit={handleSubmit}>
                        <div
                            className="plate-selector"
                            onClick={() => setIsPlateModalOpen(true)}
                            role="button"
                            tabIndex={0}
                        >
                            <input
                                name="plateId"
                                type="text"
                                readOnly
                                placeholder="차량번호를 선택하세요"
                                value={selectedPlate ? selectedPlate.number : ''}
                                className={`plate-input ${formErrors.plateId ? 'input-error' : ''}`}
                            />
                        </div>

                        <PlateSearchModal
                            isOpen={!!isPlateModalOpen}
                            onClose={() => setIsPlateModalOpen(null)}
                            plates={dummyRegistableCarNumber}
                            onSelect={(plate) => {
                                setSelectedPlate(plate);
                                setFormData((prev) => ({
                                    ...prev,
                                    plateId: plate.id,
                                }));
                                setIsPlateModalOpen(null);
                            }}
                            selectedPlateNumbers={selectedPlate ? [selectedPlate.number] : []}
                        />

                        <select
                            name="businessType"
                            value={formData.businessType}
                            onChange={handleChange}
                            required
                        >
                            <option value="">업무구분 선택</option>
                            {BUSINESS_TYPES.map((type) => (
                                <option key={type.code} value={type.code}>
                                    {type.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            name="price"
                            placeholder="공급가액"
                            value={formData.price ? Number(formData.price).toLocaleString() : ''}
                            onChange={handlePriceChange}
                            required
                        />

                        <input
                            type="text"
                            name="vinNumber"
                            placeholder="차대번호"
                            value={formData.vinNumber}
                            onChange={handleChange}
                            required
                            className={formErrors.vinNumber ? 'input-error' : ''}
                        />

                        <input
                            type="text"
                            name="carName"
                            placeholder="차명"
                            value={formData.carName}
                            onChange={handleChange}
                            required
                        />

                        <select
                            name="location"
                            value={formData.location || ''}
                            onChange={handleChange}
                            required
                            className="cell-select"
                        >
                            <option value="">사용본거지 선택</option>
                            {dummyCompanyList.map((loc) => (
                                <option key={loc.id} value={loc.name}>
                                    {loc.name}
                                </option>
                            ))}
                        </select>

                        <button type="submit">등록</button>
                    </form>
                ) : (
                    // 일괄 등록 UI
                    <div className="bulk-register">
                        <div className="button-group-right file-upload-group">
                            <button
                                type="button"
                                className="template-download"
                                onClick={handleTemplateDownload}
                            >
                                양식 다운로드
                            </button>

                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleFileUpload}
                                required
                                ref={fileInputRef}
                                style={{ display: bulkFile ? 'none' : 'block' }}
                            />

                            {bulkFile && <span className="file-info">{bulkFile.name}</span>}

                            {bulkFile && (
                                <button
                                    type="button"
                                    className="clear-file-btn"
                                    onClick={handleClearGrid}
                                >
                                    삭제
                                </button>
                            )}
                        </div>

                        <div className="customer-results-table" style={{ marginTop: 20 }}>
                            <table>
                                <thead>
                                <tr>
                                    {CAR_REGISTER_EXCEL_COLUMNS.map((col) => (
                                        <th key={col.key}>{col.name}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {rows.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={CAR_REGISTER_EXCEL_COLUMNS.length}
                                            className="customer-no-data"
                                        >
                                            업로드된 데이터가 없습니다.
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((row, rowIdx) => (
                                        <tr key={row.index}>
                                            {CAR_REGISTER_EXCEL_COLUMNS.map((col) => (
                                                <td key={col.key}>
                                                    {col.key === 'index' ? (
                                                        row.index
                                                    ) : col.key === '차량번호' ? (
                                                        <div
                                                            className="cell-plate"
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => handlePlateCellClick(rowIdx)}
                                                        >
                                                            {row['차량번호'] || (
                                                                <span style={{ color: '#bbb' }}>선택</span>
                                                            )}
                                                        </div>
                                                    ) : col.key === '업무구분' ? (
                                                        <select
                                                            value={row['업무구분'] || ''}
                                                            onChange={(e) =>
                                                                handleCellChange(rowIdx, '업무구분', e.target.value)
                                                            }
                                                            className="cell-select"
                                                        >
                                                            <option value="">선택</option>
                                                            {BUSINESS_TYPES.map((type) => (
                                                                <option key={type.code} value={type.code}>
                                                                    {type.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : col.key === '사용본거지' ? (
                                                        <select
                                                            value={row['사용본거지'] || ''}
                                                            onChange={(e) => handleLocationChange(rowIdx, e.target.value)}
                                                            className="cell-select"
                                                        >
                                                            <option value="">선택</option>
                                                            {dummyCompanyList.map((loc) => (
                                                                <option key={loc.id} value={loc.name}>
                                                                    {loc.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : col.key === '공급가액' ? (
                                                        <input
                                                            type="text"
                                                            value={
                                                                row['공급가액']
                                                                    ? Number(row['공급가액']).toLocaleString()
                                                                    : ''
                                                            }
                                                            onChange={(e) =>
                                                                handleBulkPriceChange(rowIdx, e.target.value)
                                                            }
                                                            className="cell-input"
                                                        />
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            value={row[col.key] || ''}
                                                            onChange={(e) =>
                                                                handleCellChange(rowIdx, col.key, e.target.value)
                                                            }
                                                            className="cell-input"
                                                        />
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>

                        <div className="button-group-right">
                            <button
                                type="button"
                                className="bulk-submit-button"
                                onClick={handleBulkSubmit}
                                disabled={rows.length === 0}
                            >
                                일괄 등록
                            </button>

                            <button
                                type="button"
                                className="bulk-clear-button"
                                onClick={handleClearGrid}
                            >
                                초기화
                            </button>
                        </div>

                        <PlateSearchModal
                            isOpen={isPlateModalOpen !== null}
                            onClose={() => setIsPlateModalOpen(null)}
                            plates={dummyRegistableCarNumber.filter(
                                (plate) =>
                                    !rows.some(
                                        (row, idx) =>
                                            row['차량번호'] === plate.number && idx !== isPlateModalOpen
                                    )
                            )}
                            onSelect={handlePlateSelect}
                            selectedPlateNumbers={rows
                                .map((row) => row['차량번호'])
                                .filter(Boolean)}
                        />
                    </div>
                )}
            </div>

            <ExcelValidationErrorModal
                isOpen={isErrorModalOpen}
                onClose={() => setIsErrorModalOpen(false)}
                errors={validationErrors}
            />

            <CarRegisterFailureModal
                isOpen={isFailureModalOpen}
                onClose={() => setIsFailureModalOpen(false)}
                errors={formErrors}
            />

            <RegisterSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => {
                    setIsSuccessModalOpen(false);
                    setRegisteredCount(0);
                }}
            >
                <h2>요청 완료</h2>
                <p>{registeredCount}대의 차량이 성공적으로 등록 요청되었습니다.</p>
            </RegisterSuccessModal>
        </div>
    );
}
