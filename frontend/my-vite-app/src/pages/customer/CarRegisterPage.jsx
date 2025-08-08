import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import '../../assets/css/customer.css';
import RegisterSuccessModal from "../../components/RegisterSuccessModal.jsx"; // 스타일시트 경로 수정
import * as XLSX from 'xlsx'; // 엑셀 파일 처리 라이브러리
import {BulkCarRegisterExcel, validateBulkData} from '../../excel/BulkCarRegisterExcel';
import ExcelValidationErrorModal from '../../components/ExcelValidationErrorModal.jsx';
import {useUser} from "../../contexts/UserProvider.jsx";
import LoginRequiredModal from "../../components/UserInfoRequiredModal.jsx"; // 엑셀 검증 오류 모달
import PlateSearchModal from "../../components/PlateSearchModal.jsx"; // 차량번호 검색 모달
import ExcelEditorModal from "../../components/ExcelEditorModal.jsx";

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
    const [isPlateModalOpen, setIsPlateModalOpen] = useState(false);
    const [selectedPlate, setSelectedPlate] = useState(null);
    const [showExcelModal, setShowExcelModal] = useState(false);
    const [rows, setRows] = useState([]);

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

        // const XLSX = await import('xlsx');
        const reader = new FileReader();

        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws, { header: 0 });

            console.log('CarRegisterPage.Excel Data:', data);

            // index 붙이기
            const rowsWithIndex = data.map((row, index) => ({
                index: index + 1,
                ...row
            }));
            console.log('CarRegisterPage.Rows with index:', rowsWithIndex);

            setRows(rowsWithIndex);
            console.log('CarRegisterPage.rowWithIndex', rowsWithIndex);
            setBulkData(data);
            console.log('CarRegisterPage.data', data);
            setShowExcelModal(true); // 모달 열기
        };
        reader.readAsArrayBuffer(file);
    };

    const handleRowsChange = (newRows) => {
        setRows(newRows);
        setBulkData(newRows.map(({ index, ...rest }) => rest));
    };

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

        try {
            const formattedData = bulkData.map(row => ({
                plateId: row['차량번호'],
                businessType: row['업무구분'],
                price: Number(row['공급가액']),
                vinNumber: row['차대번호'],
                carName: row['차명'],
                ownerName: row['소유자명'],
                idType: row['ID구분'] === '주민번호' ? 'personal' : 'business',
                idNumber: row['ID번호'],
                hasCoOwner: !!row['공동소유자명'],
                coOwnerName: row['공동소유자명'] || '',
                coOwnerIdType: row['공동소유자ID구분'] === '주민번호' ? 'personal' : 'business',
                coOwnerIdNumber: row['공동소유자ID번호'] || ''
            }));

            // 등록된 데이터 수 저장
            setRegisteredCount(formattedData.length);

            // TODO: API 호출
            console.log('Formatted bulk registration data:', formattedData);

            setBulkFile(null);
            setBulkData([]);
            document.getElementById('bulkUploadForm').reset();
            setIsModalOpen(true);
        } catch (error) {
            console.error('일괄 등록 중 오류 발생:', error);
            alert('일괄 등록 중 오류가 발생했습니다.');
            setIsErrorModalOpen(true);
        }
    };

    const businessTypes = [
        { code: '렌트', name: '렌트' },
        { code: '리스', name: '리스' },
        { code: '개인', name: '개인' }
    ];

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

    const openExcelEditorModal = () => {
        setShowExcelModal(true);
    }

    const handleTemplateDownload = (e) => {
        e.preventDefault();
        BulkCarRegisterExcel();
    };

    const handleClearFile = () => {
        setBulkFile(null);
        setBulkData([]);
        document.getElementById('bulkUploadForm').reset();
    };

    return (
        <div className="wrap">
            <div className="register_box">
                <h1 className="title">차량 등록</h1>
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
                        type="number"
                        name="price"
                        placeholder="공급가액"
                        value={formData.price}
                        onChange={handleChange}
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

                    <input
                        type="text"
                        name="ownerName"
                        placeholder="소유자명"
                        value={formData.ownerName}
                        onChange={handleChange}
                        required
                    />

                    <div className="id-type-selector">
                        <label>
                            <input
                                type="radio"
                                name="idType"
                                value="business"
                                checked={formData.idType === 'business'}
                                onChange={handleChange}
                            /> 법인번호
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="idType"
                                value="personal"
                                checked={formData.idType === 'personal'}
                                onChange={handleChange}
                            /> 주민번호
                        </label>
                    </div>

                    <input
                        type="text"
                        name="idNumber"
                        placeholder={formData.idType === 'personal' ? "주민번호 입력" : "법인번호 입력"}
                        value={formData.idNumber}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">등록</button>
                </form>
                ) : (
                    <div className="bulk-register">
                        <div className="bulk-instructions">
                            <h3>일괄 등록 방법</h3>
                            <ol>
                                <li>아래 양식 파일을 다운로드합니다.</li>
                                <li>양식에 맞춰 데이터를 입력합니다.</li>
                                <li>작성된 파일을 업로드합니다.</li>
                                <li>차량번호 셀을 클릭하여 등록된 차량번호 선택</li>
                            </ol>
                            <button
                                onClick={handleTemplateDownload}
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
                                    </div>
                                )}
                            </div>
                            <button type="submit" disabled={!bulkData.length}>
                                일괄 등록
                            </button>
                        </form>
                        <ExcelEditorModal
                            isOpen={showExcelModal}
                            onClose={() => setShowExcelModal(false)}
                            rows={rows}
                            excelColumns={carRegisterExcelColumns}
                            handleRowsChange={handleRowsChange}
                            rowsKeyGetter={(row) => row.index}
                            editorType="carRegisterEditor"
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
                <p>{activeTab === 'single' ? '차량이' : `${registeredCount}대의 차량이`} 성공적으로 등록 요청되었습니다.</p>
            </RegisterSuccessModal>
        </div>
    );
}