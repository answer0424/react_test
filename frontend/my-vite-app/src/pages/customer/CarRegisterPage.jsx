import {useEffect, useState, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import '../../assets/css/customer.css';
import RegisterSuccessModal from "../../components/RegisterSuccessModal.jsx";
import {BulkCarRegisterExcel} from '../../excel/BulkCarRegisterExcel';
import ExcelValidationErrorModal from '../../components/ExcelValidationErrorModal.jsx';
import {useUser} from "../../contexts/UserProvider.jsx";
import LoginRequiredModal from "../../components/UserInfoRequiredModal.jsx";
import PlateSearchModal from "../../components/PlateSearchModal.jsx";


const dummyPlates = [
    { id: 1, number: '12가3456' },
    { id: 2, number: '34나7890' },
    { id: 3, number: '56다1234' },
    { id: 4, number: '78라5678' },
    { id: 5, number: '90마4321' },
    { id: 6, number: '11바8765' },
    { id: 7, number: '22사2345' },
    { id: 8, number: '33아6789' },
    { id: 9, number: '44자1234' },
    { id: 10, number: '55차5678' },
    { id: 11, number: '66카4321' },
    { id: 12, number: '77타8765' },
    { id: 13, number: '88파2345' },
    { id: 14, number: '99하6789' },
    { id: 15, number: '00가1234' },
];

const initialFormState = {
    plateId: '',
    businessType: '',
    price: '',
    vinNumber: '',
    carName: '',
    ownerName: '',
    idType: 'business',
    idNumber: '',
};

const carRegisterExcelColumns = [
    { key: 'index', name: '번호' },
    { key: '차량번호', name: '차량번호' },
    { key: '업무구분', name: '업무구분' },
    { key: '공급가액', name: '공급가액' },
    { key: '차대번호', name: '차대번호' },
    { key: '차명', name: '차명' },
    { key: '사용본거지', name: '사용본거지' }
];

const businessTypes = [
    { code: '렌트', name: '렌트' },
    { code: '리스', name: '리스' },
    { code: '개인', name: '개인' }
];

const locations = [
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


export default function CarRegisterPage() {
    const [activeTab, setActiveTab] = useState('single');
    const [bulkFile, setBulkFile] = useState(null);
    const [bulkData, setBulkData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState(initialFormState);
    const [registeredCount, setRegisteredCount] = useState(0);
    const [validationErrors, setValidationErrors] = useState([]);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const {user} = useUser();
    const [userInfoRequiredModalOpen, setUserInfoRequiredModalOpen] = useState(false);
    const navigate = useNavigate();
    const [isPlateModalOpen, setIsPlateModalOpen] = useState(null);
    const [selectedPlate, setSelectedPlate] = useState(null);
    const [rows, setRows] = useState([]);
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

            // index 붙이기
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

    const handleRowsChange = (newRows) => {
        setRows(newRows);
        setBulkData(newRows.map(({ index, ...rest }) => rest));
    };

    const handleBulkSubmit = (e) => {
        e.preventDefault();
        if (!rows.length) {
            setValidationErrors(['업로드된 데이터가 없습니다.']);
            setIsErrorModalOpen(true);
            return;
        }
        // TODO: 유효성 검사 및 등록 API 호출
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: 유효성 검사 및 데이터 처리
        console.log(formData);
        setFormData(initialFormState);
        document.getElementById('registerForm').reset();
        setIsModalOpen(true);
        setSelectedPlate('');
    };

    const handleTemplateDownload = (e) => {
        e.preventDefault();
        BulkCarRegisterExcel(carRegisterExcelColumns.map(col => col.name));
    };

    const handleClearFile = () => {
        setBulkFile(null);
        setBulkData([]);
        document.getElementById('bulkUploadForm').reset();
    };

    const handlePlateCellClick = (rowIdx) => {
        setIsPlateModalOpen(rowIdx);
    };

    const handlePlateSelect = (plate) => {
        if (isPlateModalOpen !== null) {
            handleCellChange(isPlateModalOpen, '차량번호', plate.number);
        }
        setIsPlateModalOpen(null);
    };

    const handlePriceChange = (e) => {
        const raw = e.target.value.replace(/[^0-9]/g, '');
        setFormData(prev => ({
            ...prev,
            price: raw
        }));
    };

    const handleBulkPriceChange = (rowIdx, value) => {
        const raw = value.replace(/[^0-9]/g, '');
        handleCellChange(rowIdx, '공급가액', raw);
    };

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

                {activeTab === 'single' ? (
                // 기존 개별 등록 폼
                <form id="registerForm" onSubmit={handleSubmit}>
                    <div className="plate-selector" onClick={() => setIsPlateModalOpen(true)}>
                        <input
                            name="plateId"
                            type="text"
                            readOnly
                            placeholder="차량번호를 선택하세요"
                            value={selectedPlate ? selectedPlate.number : ''}
                            className="plate-input"
                        />
                    </div>

                    <PlateSearchModal
                        isOpen={isPlateModalOpen}
                        onClose={() => setIsPlateModalOpen(false)}
                        plates={dummyPlates}
                        onSelect={(plate) => {
                            setSelectedPlate(plate);
                            setFormData(prev => ({
                                ...prev,
                                plateId: plate.id
                            }));
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
                        {businessTypes.map(type => (
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
                        {locations.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                    <button type="submit">등록</button>
                </form>
                ) : (
                    <div className="bulk-register">
                        <div className="button-group-right file-upload-group">
                            <button
                                onClick={handleTemplateDownload}
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
                                    {carRegisterExcelColumns.map(col => (
                                        <th key={col.key}>{col.name}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={carRegisterExcelColumns.length} className="customer-no-data">
                                            업로드된 데이터가 없습니다.
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((row, rowIdx) => (
                                        <tr key={row.index}>
                                            {carRegisterExcelColumns.map(col => (
                                                <td key={col.key}>
                                                    {col.key === 'index' ? (
                                                        row.index
                                                    ) : col.key === '차량번호' ? (
                                                        <div
                                                            className="cell-plate"
                                                            style={{cursor: 'pointer'}}
                                                            onClick={() => handlePlateCellClick(rowIdx)}
                                                        >
                                                            {row['차량번호'] || <span style={{color: '#bbb'}}>선택</span>}
                                                        </div>
                                                    ) : col.key === '업무구분' ? (
                                                        <select
                                                            value={row['업무구분'] || ''}
                                                            onChange={e => handleCellChange(rowIdx, '업무구분', e.target.value)}
                                                            className="cell-select"
                                                        >
                                                            <option value="">선택</option>
                                                            {businessTypes.map(type => (
                                                                <option key={type.code} value={type.code}>{type.name}</option>
                                                            ))}
                                                        </select>
                                                    ) : col.key === '사용본거지' ? (
                                                        <select
                                                            value={row['사용본거지'] || ''}
                                                            onChange={e => handleCellChange(rowIdx, '사용본거지', e.target.value)}
                                                            className="cell-select"
                                                        >
                                                            <option value="">선택</option>
                                                            {locations.map(loc => (
                                                                <option key={loc} value={loc}>{loc}</option>
                                                            ))}
                                                        </select>
                                                    ) : col.key === '공급가액' ? (
                                                        <input
                                                            type="text"
                                                            value={row['공급가액'] ? Number(row['공급가액']).toLocaleString() : ''}
                                                            onChange={e => handleBulkPriceChange(rowIdx, e.target.value)}
                                                            className="cell-input"
                                                        />
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
                        <PlateSearchModal
                            isOpen={isPlateModalOpen !== null}
                            onClose={() => setIsPlateModalOpen(null)}
                            plates={dummyPlates.filter(
                                plate => !rows.some(
                                    (row, idx) => row['차량번호'] === plate.number && idx !== isPlateModalOpen
                                )
                            )}
                            onSelect={handlePlateSelect}
                            selectedPlateNumbers={rows.map(row => row['차량번호']).filter(Boolean)}
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
                <p>{registeredCount}대의 차량이 성공적으로 등록 요청되었습니다.</p>
            </RegisterSuccessModal>
        </div>
    );
}