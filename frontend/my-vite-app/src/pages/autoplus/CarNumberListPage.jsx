import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../contexts/UserProvider.jsx";
import {dummyCarNumberData} from "../../services/CarRegisterDummyData.jsx";
import LoginRequiredModal from "../../components/UserInfoRequiredModal.jsx";
import '../../assets/css/autoplus.css';

// 고객사 목록 세팅
const getCompanyList = (plates) => Array.from(new Set(plates.map(p => p.companyName)));

/**
 * 조회된 차량번호 목록 화면 렌더링
 * @param plates
 * @returns {JSX.Element}
 * @constructor
 */
function PlateList({ plates }) {
    if (plates.length === 0) {
        return <div id="plate-empty-message">등록된 차량번호가 없습니다.</div>;
    }

    return (
        <table id="plate-list-table">
            <thead>
            <tr>
                <th>차량번호</th>
                <th>고객사</th>
            </tr>
            </thead>
            <tbody>
            {plates.map(plate => (
                <tr key={plate.id} className="plate-item">
                    <td>{plate.number}</td>
                    <td>{plate.companyName}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

/**
 * 차량번호 목록 페이지 컴포넌트
 * - 차량번호 검색, 고객사 필터링
 * @returns {JSX.Element}
 * @constructor
 */
export default function CarNumberListPage() {
    // State
    const [plates, setPlates] = useState([]);                           // 호출된 차량번호 상태
    const [searchTerm, setSearchTerm] = useState('');                   // 검색된 차량번호 상태
    const [selectedCompany, setSelectedCompany] = useState('');         // 선택된 고객사 상태
    const [isLoading, setIsLoading] = useState(true);                 // 로딩 상태
    const [error, setError] = useState(null);                                  // 에러 상태

    // Hooks
    const navigate = useNavigate();
    const { user } = useUser();
    const [userInfoRequiredModalOpen, setUserInfoRequiredModalOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            setUserInfoRequiredModalOpen(true);
        }

        // TODO 차량번호 목록 관련 API 호출
    }, [user]);

    // 로그인 여부 확인
    if (!user || !user.username) {
        return <LoginRequiredModal open={userInfoRequiredModalOpen} />;
    }

    // Handlers
    const handleSearchChange = (event) => setSearchTerm(event.target.value);
    const handleCompanyChange = (event) => setSelectedCompany(event.target.value);
    const handleAddPlate = () => navigate('/autoplus/plate/add');

    // 조회된 데이터
    const companyList = getCompanyList(dummyCarNumberData);
    const filteredPlates = dummyCarNumberData.filter(
        plate =>
            plate.number.includes(searchTerm) &&
            (selectedCompany === '' || plate.companyName === selectedCompany)
    );

    return (
        <div id="plate-list-container">
            <div id="plate-list-content">
                <h1 id="plate-list-title">차량번호 목록</h1>
                <div id="plate-list-actions">
                    <input
                        type="text"
                        placeholder="차량번호 검색..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        id="plate-search-input"
                    />
                    <select
                        value={selectedCompany}
                        onChange={handleCompanyChange}
                        id="plate-company-select"
                        style={{
                            minWidth: '120px',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            border: '1px solid #dde2e5',
                            fontSize: '14px'
                        }}
                    >
                        <option value="">전체 고객사</option>
                        {companyList.map(company => (
                            <option key={company} value={company}>
                                {company}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleAddPlate} id="plate-add-button">
                        신규 차량번호 등록
                    </button>
                </div>
                <div className="customer-results-count">
                    총 {filteredPlates.length}건
                </div>
                <div id="plate-list-table-wrapper">
                    <PlateList plates={filteredPlates} />
                </div>
            </div>
        </div>
    );
}
