// PlateRegisterPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/customer.css';
import { useUser } from "../../contexts/UserProvider.jsx";
import LoginRequiredModal from "../../components/UserInfoRequiredModal.jsx";
import RegisterSuccessModal from "../../components/RegisterSuccessModal.jsx";
import ExcelValidationErrorModal from "../../components/ExcelValidationErrorModal.jsx";

// 엑셀 템플릿 생성 함수
const createExcelTemplate = async () => {
    const XLSX = await import('xlsx');
    const header = ['차량번호', '고객사'];
    const ws = XLSX.utils.aoa_to_sheet([header]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '차량번호등록');
    XLSX.writeFile(wb, '차량번호_등록_양식.xlsx');
};

const validateBulkData = (data) => {
    const errors = [];
    data.forEach((row, index) => {
        if (!row['차량번호']) {
            errors.push(`${index + 1}번: 차량번호가 누락되었습니다.`);
        }
        if (!row['고객사']) {
            errors.push(`${index + 1}번: 고객사가 누락되었습니다.`);
        }
    });
    return errors;
};

const CUSTOMER_OPTIONS = [
    '현대캐피탈 강남지점',
    '현대캐피탈 강북중고지점',
    '현대캐피탈 강서지점',
    '현대캐피탈 광진지점',
    '현대캐피탈 마포지점',
    'KB캐피탈 강남지점',
    'KB캐피탈 강북지점',
    'KB캐피탈 강서지점',
    'KB캐피탈 서울지점',
    'KB캐피탈 생활금융부 집중화팀',
    '메리츠캐피탈 본점',
    '메리츠캐피탈 강남신차지점',
    '메리츠캐피탈 서울지점'
];

const plateExcelColumns = [
    { key: 'index', name: '번호' },
    { key: '차량번호', name: '차량번호' },
    { key: '고객사', name: '고객사' }
];

export default function PlateRegisterPage() {
    const [isMultiple, setIsMultiple] = useState(false);
    const [plateNumber, setPlateNumber] = useState('');
    const [bulkFile, setBulkFile] = useState(null);
    const [rows, setRows] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [registeredCount, setRegisteredCount] = useState(0);
    const [validationErrors, setValidationErrors] = useState([]);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const navigate = useNavigate();
    const { user } = useUser();
    const [userInfoRequiredModalOpen, setUserInfoRequiredModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!user) setUserInfoRequiredModalOpen(true);
    }, [user, navigate]);

    if (!user || !user.username) {
        return <LoginRequiredModal open={userInfoRequiredModalOpen}/>;
    }

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

            const rowsWithIndex = data.map((row, idx) => ({
                index: idx + 1,
                ...row
            }));
            setRows(rowsWithIndex);
        };
        reader.readAsArrayBuffer(file);
    };

    const handleCellChange = (rowIdx, key, value) => {
        setRows(prev =>
            prev.map((row, idx) =>
                idx === rowIdx ? { ...row, [key]: value } : row
            )
        );
    };

    const handleBulkSubmit = (e) => {
        e.preventDefault();
        if (!rows.length) {
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
        setIsModalOpen(true);
    };

    const handleClearGrid = () => {
        setRows([]);
        setBulkFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSingleRegister = (e) => {
        e.preventDefault();
        if (!plateNumber || !selectedCustomer) return;
        setRegisteredCount(1);
        setIsModalOpen(true);
        setPlateNumber('');
        setSelectedCustomer('');
    };

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
                    <form id="registerForm" onSubmit={handleSingleRegister} className="single-register-form">
                        <div className="input-group-vertical">
                            <div className="input-field">
                                <label htmlFor="plateNumber">차량번호</label>
                                <input
                                    id="plateNumber"
                                    type="text"
                                    placeholder="차량번호 입력"
                                    value={plateNumber}
                                    onChange={e => setPlateNumber(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-field">
                                <label htmlFor="customer">고객사</label>
                                <select
                                    id="customer"
                                    value={selectedCustomer}
                                    onChange={e => setSelectedCustomer(e.target.value)}
                                    required
                                >
                                    <option value="">선택하세요</option>
                                    {CUSTOMER_OPTIONS.map(customer => (
                                        <option key={customer} value={customer}>
                                            {customer}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="register-button">등록</button>
                    </form>
                ) : (
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
                                style={{ display: bulkFile ? 'none' : 'block' }}
                            />
                            {bulkFile && (
                                <span className="file-info">{bulkFile.name}</span>
                            )}
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
                                    {plateExcelColumns.map(col => (
                                        <th key={col.key}>{col.name}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={plateExcelColumns.length} className="customer-no-data">
                                            업로드된 데이터가 없습니다.
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((row, rowIdx) => (
                                        <tr key={row.index}>
                                            {plateExcelColumns.map(col => (
                                                <td key={col.key}>
                                                    {col.key === 'index' ? (
                                                        row.index
                                                    ) : col.key === '고객사' ? (
                                                        <select
                                                            value={row['고객사'] || ''}
                                                            onChange={e => handleCellChange(rowIdx, '고객사', e.target.value)}
                                                            className="cell-select"
                                                        >
                                                            <option value="">선택</option>
                                                            {CUSTOMER_OPTIONS.map(opt => (
                                                                <option key={opt} value={opt}>{opt}</option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            value={row[col.key] || ''}
                                                            onChange={e => handleCellChange(rowIdx, col.key, e.target.value)}
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
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setRegisteredCount(0);
                }}
            >
                <h2>요청 완료</h2>
                <p>{!isMultiple ? '차량번호가' : `${registeredCount}개의 차량번호가`} 성공적으로 등록되었습니다.</p>
            </RegisterSuccessModal>
        </div>
    );
}