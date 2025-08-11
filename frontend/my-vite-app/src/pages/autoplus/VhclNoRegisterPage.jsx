import {useState, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {useUser} from '../../contexts/UserProvider.jsx';
import {dummyCompanyList} from "../../services/CarRegisterDummyData.jsx";
import LoginRequiredModal from '../../components/UserInfoRequiredModal.jsx';
import RegisterSuccessModal from '../../components/RegisterSuccessModal.jsx';
import ExcelValidationErrorModal from '../../components/ExcelValidationErrorModal.jsx';
import '../../assets/css/customer.css';

// 엑셀 테이블 컬럼 정의
const VHCLNO_EXCEL_COLUMNS = [
    {key: 'index', name: '번호'},
    {key: '차량번호', name: '차량번호'},
    {key: '고객사', name: '고객사'},
];

// 차량번호 유효성 검사 함수
const validateVhclNo = (vhclNo) => {
    const pattern = /^[가-힣]{0,2}\d{2,3}[가-힣]{1}\d{4}$/;
    return pattern.test(vhclNo.replace(/\s+/g, ''));
};

// 대량 데이터 유효성 검사 함수
const validateBulkData = (data) => {
    const errors = [];
    data.forEach((row, index) => {
        if (!row['차량번호']) {
            errors.push(`${index + 1}번: 차량번호가 누락되었습니다.`);
        }else if (!validateVhclNo(row['차량번호'])) {
            errors.push(`${index + 1}번: 올바른 차량번호 형식이 아닙니다. (예: 12가1234, 123가1234)`);
        }

        if (!row['고객사']) {
            errors.push(`${index + 1}번: 고객사가 누락되었습니다.`);
        }
    });
    return errors;
};

// 엑셀 템플릿 생성 함수
const createExcelTemplate = async () => {
    const XLSX = await import('xlsx');
    const header = ['차량번호', '고객사'];
    const ws = XLSX.utils.aoa_to_sheet([header]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '차량번호등록');
    XLSX.writeFile(wb, '차량번호_등록_양식.xlsx');
};


/**
 * 차량번호 개별, 일괄 등록 페이지 컴포넌트
 * - 개별 등록: 차량번호와 고객사 선택 후 등록
 * - 일괄 등록: 엑셀 파일 업로드 후 차량번호와 고객사 일괄 등록
 * @returns {JSX.Element}
 * @constructor
 */
export default function VhclNoRegisterPage() {
    // --- 상태 선언 (State) ---
    const [isMultiple, setIsMultiple] = useState(false);                       // 등록 모드: 개별 or 일괄
    const [vhclNo, setVhclNo] = useState('');                                   // 차량번호 입력
    const [selectedCoOwnrNm, setSelectedCoOwnrNm] = useState('');               // 고객사 선택
    const [bulkFile, setBulkFile] = useState(null);                                    // 엑셀 파일 업로드
    const [rows, setRows] = useState([]);                                       // 조회된 데이터 세팅
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);      // 등록 성공 시 모달
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);          // 등록 실패 시 모달
    const [registeredCount, setRegisteredCount] = useState(0);                // 등록된 차량번호 수
    const [validationErrors, setValidationErrors] = useState([]);               // 유효성 검사 시 발견된 에러

    // ref
    const fileInputRef = useRef(null);

    // Hooks
    const navigate = useNavigate();
    const {user} = useUser();
    const [userInfoRequiredModalOpen, setUserInfoRequiredModalOpen] = useState(false);

    // useEffect
    useEffect(() => {
        if (!user) {
            setUserInfoRequiredModalOpen(true);
        }
    }, [user, navigate]);

    if (!user || !user.username) {
        return <LoginRequiredModal open={userInfoRequiredModalOpen}/>;
    }

    // --- 이벤트 핸들러 ---

    // 엑셀 파일 업로드 핸들러
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        setBulkFile(file);

        const XLSX = await import('xlsx');
        const reader = new FileReader();

        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, {type: 'binary'});
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws, {header: 0});

            const rowsWithIndex = data.map((row, idx) => ({
                index: idx + 1,
                ...row,
            }));
            setRows(rowsWithIndex);
        };
        reader.readAsArrayBuffer(file);
    };

    // 단일 등록 제출 핸들러
    const handleSingleSubmit = (e) => {
        e.preventDefault();
        // TODO 차량 등록 API 호출
        if (!vhclNo || !selectedCoOwnrNm) {
            setValidationErrors(['차량번호와 고객사를 모두 입력해주세요.']);
            setIsErrorModalOpen(true);
            return;
        }

        if (!validateVhclNo(vhclNo)) {
            setValidationErrors(['올바른 차량번호 형식이 아닙니다. (예: 12가1234, 123가1234)']);
            setIsErrorModalOpen(true);
            return;
        }

        setRegisteredCount(1);
        setIsSuccessModalOpen(true);
        setVhclNo('');
        setSelectedCoOwnrNm('');
    };

    // 개별 셀 변경 핸들러 (테이블 내)
    const handleCellChange = (rowIdx, key, value) => {
        setRows((prev) =>
            prev.map((row, idx) => (idx === rowIdx ? {...row, [key]: value} : row))
        );
    };

    // 일괄 등록 제출 핸들러
    const handleBulkSubmit = (e) => {
        e.preventDefault();

        // TODO 차량 등록 API 호출

        if (rows.length === 0) {
            setValidationErrors(['업로드된 데이터가 없습니다.']);
            setIsErrorModalOpen(true);
            return;
        }

        const errors = validateBulkData(rows);
        if (errors.length > 0) {
            setValidationErrors(errors);
            setIsErrorModalOpen(true);
            return;
        }

        setRegisteredCount(rows.length);
        setRows([]);
        setBulkFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setIsSuccessModalOpen(true);
    };

    // 일괄 등록 그리드 초기화
    const handleClearGrid = () => {
        setRows([]);
        setBulkFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // --- JSX 렌더링 ---
    return (
        <div className="wrap">
            <div className="register_box">
                <h1 className="title">차량번호 등록</h1>
                <div className="register-tabs">
                    <button
                        className={`tab-button ${!isMultiple ? 'active' : ''}`}
                        onClick={() => setIsMultiple(false)}
                    >
                        개별 등록
                    </button>
                    <button
                        className={`tab-button ${isMultiple ? 'active' : ''}`}
                        onClick={() => setIsMultiple(true)}
                    >
                        일괄 등록
                    </button>
                </div>

                {!isMultiple ? (
                    // 개별 등록 폼
                    <form
                        id="registerForm"
                        onSubmit={handleSingleSubmit}
                        className="single-register-form"
                    >
                        <div className="input-group-vertical">
                            <div className="input-field">
                                <label htmlFor="vhclNo">차량번호</label>
                                <input
                                    id="vhclNo"
                                    type="text"
                                    placeholder="차량번호 입력"
                                    value={vhclNo}
                                    onChange={(e) => setVhclNo(e.target.value)}
                                />
                            </div>
                            <div className="input-field">
                                <label htmlFor="coOwnrNm">고객사</label>
                                <select
                                    id="coOwnrNm"
                                    value={selectedCoOwnrNm}
                                    onChange={(e) => setSelectedCoOwnrNm(e.target.value)}
                                >
                                    <option value="">선택하세요</option>
                                    {dummyCompanyList.map((co) => (
                                        <option key={co.id} value={co.name}>
                                            {co.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="register-button">
                            등록
                        </button>
                    </form>
                ) : (
                    // 일괄 등록 폼
                    <div className="bulk-register">
                        <div className="button-group-right file-upload-group">
                            <button
                                onClick={createExcelTemplate}
                                className="template-download"
                                type="button"
                            >
                                양식 다운로드
                            </button>

                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleFileUpload}
                                required
                                ref={fileInputRef}
                                style={{display: bulkFile ? 'none' : 'block'}}
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

                        <div className="customer-results-table" style={{marginTop: 20}}>
                            <table>
                                <thead>
                                <tr>
                                    {VHCLNO_EXCEL_COLUMNS.map((col) => (
                                        <th key={col.key}>{col.name}</th>
                                    ))}
                                </tr>
                                </thead>

                                <tbody>
                                {rows.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={VHCLNO_EXCEL_COLUMNS.length}
                                            className="customer-no-data"
                                        >
                                            업로드된 데이터가 없습니다.
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((row, rowIdx) => (
                                        <tr key={row.index}>
                                            {VHCLNO_EXCEL_COLUMNS.map((col) => (
                                                <td key={col.key}>
                                                    {col.key === 'index' ? (
                                                        row.index
                                                    ) : col.key === '고객사' ? (
                                                        <select
                                                            value={row['고객사'] || ''}
                                                            onChange={(e) =>
                                                                handleCellChange(rowIdx, '고객사', e.target.value)
                                                            }
                                                            className="cell-select"
                                                        >
                                                            <option value="">선택</option>
                                                            {dummyCompanyList.map((opt) => (
                                                                <option key={opt.id} value={opt.name}>
                                                                    {opt.name}
                                                                </option>
                                                            ))}
                                                        </select>
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
                    </div>
                )}
            </div>

            <ExcelValidationErrorModal
                isOpen={isErrorModalOpen}
                onClose={() => setIsErrorModalOpen(false)}
                errors={validationErrors}
            />

            <RegisterSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => {
                    setIsSuccessModalOpen(false);
                    setRegisteredCount(0);
                }}
            >
                <h2>요청 완료</h2>
                <p>
                    {!isMultiple
                        ? '차량번호가'
                        : `${registeredCount}개의 차량번호가`} 성공적으로 등록되었습니다.
                </p>
            </RegisterSuccessModal>
        </div>
    );
}
