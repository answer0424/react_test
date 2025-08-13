import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserProvider.jsx';
import { dummyCompanyList, dummyPlateData } from '../../services/CarRegisterDummyData.jsx';
import LoginRequiredModal from '../../components/UserInfoRequiredModal.jsx';
import DatePicker from 'react-datepicker';
import ko from 'date-fns/locale/ko';
import 'react-datepicker/dist/react-datepicker.css';

// 상태 탭 상수
const STATUS_TABS = [
    { id: 'all', label: '전체' },
    { id: 'requested', label: '요청' },
    { id: 'pending', label: '대기' },
    { id: 'completed', label: '완료' },
];

// 빠른 날짜 선택 컴포넌트
const QuickDateSelector = ({ onSelect }) => {
    const getDate = (days) => {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date;
    };

    return (
        <div className="quick-date-selector">
            <button onClick={() => onSelect(new Date(), new Date())}>당일</button>
            <button onClick={() => onSelect(getDate(3), new Date())}>3일전</button>
            <button onClick={() => onSelect(getDate(7), new Date())}>7일전</button>
            <button onClick={() => onSelect(getDate(30), new Date())}>1개월전</button>
            <button onClick={() => onSelect(getDate(90), new Date())}>3개월전</button>
        </div>
    );
};

/**
 * 차량번호 기준 등록 상태 확인 페이지 컴포넌트
 * @returns {JSX.Element}
 * @constructor
 */
export default function VhclNoRegisterStatusPage() {
    // --- 상태 선언 ---
    const [searchTerm, setSearchTerm] = useState('');                   // 검색된 데이터 상태
    const [selectedCoOwnrNm, setSelectedCoOwnrNm] = useState('');         // 선택된 고객사 상태
    const [startDate, setStartDate] = useState(new Date());                       // 조회 시작 날짜 상태
    const [endDate, setEndDate] = useState(new Date());                           // 조회 끝 날짜 상태
    const [activeTab, setActiveTab] = useState('all');                  // 활성된 탭 상태
    const [searchResults, setSearchResults] = useState(dummyPlateData);                  // 검색 결과 상태
    const [showQuickSelect, setShowQuickSelect] = useState(false);    // 날짜 선택 버튼 표시 여부 상태
    const [apiState, setApiState] = useState({                           // API 호출 상태
        data: [],
        isLoading: true,
        error: null
    });

    // --- hooks ---
    const { user } = useUser();
    const navigate = useNavigate();
    const [userInfoRequiredModalOpen, setUserInfoRequiredModalOpen] = useState(false);

    // --- 유저 인증 확인 ---
    useEffect(() => {
        if (!user) {
            setUserInfoRequiredModalOpen(true);
        }
    }, [user, navigate]);

    if (!user || !user.username) {
        return <LoginRequiredModal open={userInfoRequiredModalOpen} />;
    }

    // --- 이벤트 핸들러 ---

    // 검색 버튼 클릭 시
    const handleSearch = (e) => {
        e.preventDefault();
        // TODO 차량 진행 상태 목록 조회 API 호출
        setSearchResults(dummyPlateData);
    };

    // 빠른 날짜 선택 핸들러
    const handleQuickSelect = (start, end) => {
        setStartDate(start);
        setEndDate(end);
        setShowQuickSelect(false);
    };

    // --- 필터링 된 검색 결과 계산 ---
    const filteredResults = searchResults.filter((result) => {
        const statusMatch =
            activeTab === 'all' ||
            (activeTab === 'requested' && result.status === '요청') ||
            (activeTab === 'pending' && result.status === '대기') ||
            (activeTab === 'completed' && result.status === '완료');

        const companyMatch =
            !selectedCoOwnrNm || result.coOwnrNm === selectedCoOwnrNm;

        const plateMatch =
            !searchTerm || result.vhclNo.toLowerCase().includes(searchTerm.toLowerCase());

        const registeredDate = new Date(result.registeredAt);
        const dateMatch =
            registeredDate >= new Date(startDate.setHours(0, 0, 0, 0)) &&
            registeredDate <= new Date(endDate.setHours(23, 59, 59, 999));

        return statusMatch && companyMatch && plateMatch && dateMatch;
    });

    // --- JSX ---
    return (
        <div className="customer-container">
            <div className="customer-content">
                <h1 className="customer-title">차량번호 신규 등록 상태</h1>

                <form className="customer-search-filters" onSubmit={handleSearch}>
                    <div className="customer-search-row">
                        <input
                            type="text"
                            placeholder="차량번호 번호 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="customer-search-input"
                        />
                        <select
                            value={selectedCoOwnrNm}
                            onChange={(e) => setSelectedCoOwnrNm(e.target.value)}
                            className="company-select"
                        >
                            <option value="">고객사 선택</option>
                            {dummyCompanyList.map((company) => (
                                <option key={company.id} value={company.name}>
                                    {company.name}
                                </option>
                            ))}
                        </select>

                        <div className="customer-date-picker-wrapper">
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                dateFormat="yyyy-MM-dd"
                                locale={ko}
                                className="customer-date-picker"
                            />
                            <span className="customer-date-separator">~</span>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                dateFormat="yyyy-MM-dd"
                                locale={ko}
                                className="customer-date-picker"
                            />
                            <button
                                type="button"
                                className="customer-date-select-button"
                                onClick={() => setShowQuickSelect((prev) => !prev)}
                            >
                                날짜선택
                            </button>
                            {showQuickSelect && <QuickDateSelector onSelect={handleQuickSelect} />}
                        </div>

                        <button type="submit" className="customer-search-button">
                            검색
                        </button>
                    </div>
                </form>

                <div className="customer-status-tabs">
                    {STATUS_TABS.map((tab) => (
                        <button
                            key={tab.id}
                            className={`customer-tab-button ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                            type="button"
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="customer-results-count">총 {filteredResults.length}건</div>

                <div className="customer-results-table">
                    <table>
                        <thead>
                        <tr>
                            <th>차량번호</th>
                            <th>고객사</th>
                            <th>상태</th>
                            <th>접수일시</th>
                            <th>등록일시</th>
                        </tr>
                        </thead>

                        <tbody>
                        {filteredResults.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="customer-no-data">
                                    검색 결과가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            filteredResults.map((result, index) => (
                                <tr key={index}>
                                    <td>{result.vhclNo}</td>
                                    <td>{result.coOwnrNm}</td>
                                    <td>{result.status}</td>
                                    <td>{result.expiresAt}</td>
                                    <td>{result.registeredAt}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
