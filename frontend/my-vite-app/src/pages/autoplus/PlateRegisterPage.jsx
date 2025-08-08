import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/autoplus.css';
import { useUser } from "../../contexts/UserProvider.jsx";
import LoginRequiredModal from "../../components/UserInfoRequiredModal.jsx";
import * as XLSX from 'xlsx';
import RegisterSuccessModal from "../../components/RegisterSuccessModal.jsx";
import ExcelValidationErrorModal from "../../components/ExcelValidationErrorModal.jsx";
import ExcelEditorModal from '../../components/ExcelEditorModal';

// 엑셀 템플릿 생성 함수
const createExcelTemplate = () => {
    const header = ['차량번호', '고객사'];
    const ws = XLSX.utils.aoa_to_sheet([header]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '차량번호등록');
    XLSX.writeFile(wb, '차량번호_등록_양식.xlsx');
};

// 엑셀 데이터 검증 함수
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

const CUSTOMER_OPTIONS = ['HYUNDAI', 'KIA', 'GENESIS'];

export default function PlateRegisterPage() {
    const [isMultiple, setIsMultiple] = useState(false);
    const [plateNumber, setPlateNumber] = useState('');
    const [bulkFile, setBulkFile] = useState(null);
    const [bulkData, setBulkData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [registeredCount, setRegisteredCount] = useState(0);
    const [validationErrors, setValidationErrors] = useState([]);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const navigate = useNavigate();
    const { user } = useUser();
    const [userInfoRequiredModalOpen, setUserInfoRequiredModalOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [showExcelModal, setShowExcelModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState('');

    useEffect(() => {
        if (!user) {
            setUserInfoRequiredModalOpen(true);
        }
    }, [user, navigate]);

    if (!user || !user.username) {
        return <LoginRequiredModal open={userInfoRequiredModalOpen}/>;
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setBulkFile(file);

        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws, { header: 0 });

            console.log('Excel Data:', data);

            const rowsWithIndex = data.map((row, index) => ({
                index: index + 1,
                ...row
            }));

            setRows(rowsWithIndex);
            setBulkData(data);
            setShowExcelModal(true); // 모달 열기
        };
        reader.readAsBinaryString(file);
    };

    const handleRowsChange = (newRows) => {
        console.log('변경된 행:', newRows);
        setRows(newRows); // index 유지
        setBulkData(newRows.map(({ index, ...rest }) => rest)); // 저장 시는 index 제외
    };

    const openExcelEditorModal = () => {
        setShowExcelModal(true);
    }

    const handleBulkSubmit = async (e) => {
        e.preventDefault();
        if (!bulkData.length) {
            setValidationErrors(['업로드된 데이터가 없습니다.']);
            setIsErrorModalOpen(true);
            return;
        }

        const errors = validateBulkData(bulkData);
        if (errors.length > 0) {
            setValidationErrors(errors);
            setIsErrorModalOpen(true);
            return;
        }

        console.log('등록할 데이터:', bulkData);

        setRegisteredCount(bulkData.length);
        setIsModalOpen(true);
        setBulkFile(null);
        setBulkData([]);
        document.getElementById('bulkUploadForm').reset();
    };

    const handleSingleRegister = (e) => {
        e.preventDefault();
        if (!plateNumber) return;
        setRegisteredCount(1);
        setIsModalOpen(true);
        setPlateNumber('');
        setSelectedCustomer('');
    };

    const handleClearFile = () => {
        setBulkFile(null);
        setBulkData([]);
        document.getElementById('bulkUploadForm').reset();
    };

    const plateExcelColumns = [
        {
            key: 'index',
            name: '번호',
            width: 80,
            frozen: true
        },
        {
            key: '차량번호',
            name: '차량번호',
            width: 150,
            editable: true
        },
        {
            key: '고객사',
            name: '고객사',
            width: 200,
            editable: true
        }
    ];

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
                        <div className="bulk-instructions">
                            <h3>일괄 등록 방법</h3>
                            <ol>
                                <li>아래 양식 파일을 다운로드합니다.</li>
                                <li>양식에 맞춰 데이터를 입력합니다.</li>
                                <li>작성된 파일을 업로드합니다.</li>
                            </ol>
                            <button
                                onClick={createExcelTemplate}
                                className="template-download"
                            >
                                양식 다운로드
                            </button>
                        </div>
                        <form id="bulkUploadForm" onSubmit={handleBulkSubmit}>
                            <div className="file-upload-container">
                                <div className="file-input-group">
                                    <input
                                        type="file"
                                        accept=".xlsx,.xls"
                                        onChange={handleFileUpload}
                                        required
                                    />
                                    {bulkFile && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={handleClearFile}
                                                className="clear-file-btn"
                                            >
                                                ✕
                                            </button>
                                            <button
                                                type="button"
                                                onClick={openExcelEditorModal}
                                                className="edit-excel-btn"
                                            >
                                                엑셀편집
                                            </button>
                                        </>
                                    )}
                                </div>
                                {bulkData.length > 0 && (
                                    <div className="file-info">
                                        <p>{bulkData.length}개의 데이터가 확인되었습니다.</p>
                                        <button type="submit">일괄 등록</button>
                                    </div>
                                )}
                            </div>
                        </form>

                        <ExcelEditorModal
                            isOpen={showExcelModal}
                            onClose={() => setShowExcelModal(false)}
                            rows={rows}
                            excelColumns={plateExcelColumns}
                            handleRowsChange={handleRowsChange}
                            rowsKeyGetter={(row) => row.index}
                            editorType='plateRegisterEditor'
                        />
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