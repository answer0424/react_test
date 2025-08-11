// RegisterStatusPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyStatusData } from '../../services/CarRegisterDummyData.jsx';
import { useUser } from '../../contexts/UserProvider.jsx';
import DatePicker from 'react-datepicker';
import StatusDetailModal from '../../components/StatusDetailModal';
import LoginRequiredModal from '../../components/UserInfoRequiredModal.jsx';
import 'react-datepicker/dist/react-datepicker.css';
import '../../assets/css/customer.css';

// 업무구분 코드 - 이름 매핑
const BUSINESS_TYPES = {
    '01': '렌트',
    '02': '리스',
    '03': '개인',
};

// 업무구분 코드 → 이름 변환 함수
export const getBusinessTypeName = (code) => BUSINESS_TYPES[code] || '';

// 등록 상태 탭 메뉴
const STATUS_TABS = [
    { id: 'all', name: '전체' },
    { id: '요청', name: '요청' },
    { id: '승인 대기', name: '대기' },
    { id: '승인 완료', name: '승인' },
];

// 빠른 날짜 선택 핸들러
const QuickDateSelector = ({ onSelect, onClose }) => {
    const getDateDaysAgo = (days) => {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date;
    };

    return (
        <div className="quick-date-selector">
            <button onClick={() => onSelect(new Date(), new Date())}>당일</button>
            <button onClick={() => onSelect(getDateDaysAgo(3), new Date())}>3일전</button>
            <button onClick={() => onSelect(getDateDaysAgo(7), new Date())}>7일전</button>
            <button onClick={() => onSelect(getDateDaysAgo(30), new Date())}>1개월전</button>
            <button onClick={() => onSelect(getDateDaysAgo(90), new Date())}>3개월전</button>
        </div>
    );
};

/**
 * 자동차 신규 등록 상태 확인 페이지 컴포넌트
 * @returns {JSX.Element}
 * @constructor
 */
export default function RegisterStatusPage() {
    const [searchParams, setSearchParams] = useState({                  // 검색 항목 설정 상태
        ownerName: '',
        plateNumber: '',
        startDate: new Date(),
        endDate: new Date(),
        statusTab: 'all',
    });
    const [selectedStatus, setSelectedStatus] = useState(null);              // 선택된 정보 상태
    const [showQuickSelect, setShowQuickSelect] = useState(false);  // 날짜 선택 달력 표시 여부 상태

    // hook
    const { user } = useUser();
    const navigate = useNavigate();
    const [userInfoRequiredModalOpen, setUserInfoRequiredModalOpen] = useState(false);

    // 로그인 상태 체크
    useEffect(() => {
        if (!user) {
            setUserInfoRequiredModalOpen(true);
        }
    }, [user, navigate]);

    if (!user || !user.username) {
        return <LoginRequiredModal open={userInfoRequiredModalOpen} />;
    }

    // 검색 버튼 클릭 핸들러
    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Search params:', searchParams);
        // TODO 차량 진행 상태 목록 조회 API 호출
    };

    // 빠른 날짜 선택
    const handleQuickSelect = (start, end) => {
        setSearchParams((prev) => ({
            ...prev,
            startDate: start,
            endDate: end,
        }));
        setShowQuickSelect(false);
    };

    // 검색 필터 조건에 따른 상태 필터링
    const filteredStatus = dummyStatusData.filter((status) => {
        const matchesOwnerName = status.ownerName.includes(searchParams.ownerName);
        const matchesPlateNumber = status.plateNumber.includes(searchParams.plateNumber);
        const matchesStatusTab =
            searchParams.statusTab === 'all' || status.status.includes(searchParams.statusTab);

        const requestDate = new Date(status.requestDate);
        const startDateWithTime = new Date(searchParams.startDate);
        startDateWithTime.setHours(0, 0, 0, 0);
        const endDateWithTime = new Date(searchParams.endDate);
        endDateWithTime.setHours(23, 59, 59, 999);
        const isWithinDateRange = requestDate >= startDateWithTime && requestDate <= endDateWithTime;

        return matchesOwnerName && matchesPlateNumber && matchesStatusTab && isWithinDateRange;
    });

    return (
        <div className="customer-container">
            <div className="customer-content">
                <h1 className="customer-title">자동차 신규 등록 상태</h1>

                {/* 검색 필터 */}
                <form className="customer-search-filters" onSubmit={handleSearch}>
                    <div className="customer-search-row">
                        <input
                            type="text"
                            placeholder="소유자명"
                            value={searchParams.ownerName}
                            onChange={(e) =>
                                setSearchParams((prev) => ({ ...prev, ownerName: e.target.value }))
                            }
                            className="customer-search-input"
                        />
                        <input
                            type="text"
                            placeholder="차량번호"
                            value={searchParams.plateNumber}
                            onChange={(e) =>
                                setSearchParams((prev) => ({ ...prev, plateNumber: e.target.value }))
                            }
                            className="customer-search-input"
                        />

                        <div className="customer-date-picker-wrapper">
                            <DatePicker
                                selected={searchParams.startDate}
                                onChange={(date) =>
                                    setSearchParams((prev) => ({ ...prev, startDate: date }))
                                }
                                selectsStart
                                startDate={searchParams.startDate}
                                endDate={searchParams.endDate}
                                dateFormat="yyyy-MM-dd"
                                className="customer-date-picker"
                                showMonthYearDropdown
                            />
                            <span className="customer-date-separator">~</span>
                            <DatePicker
                                selected={searchParams.endDate}
                                onChange={(date) =>
                                    setSearchParams((prev) => ({ ...prev, endDate: date }))
                                }
                                selectsEnd
                                startDate={searchParams.startDate}
                                endDate={searchParams.endDate}
                                minDate={searchParams.startDate}
                                dateFormat="yyyy-MM-dd"
                                className="customer-date-picker"
                                showMonthYearDropdown
                            />
                            <button
                                type="button"
                                className="customer-date-select-button"
                                onClick={() => setShowQuickSelect((prev) => !prev)}
                            >
                                날짜선택
                            </button>
                            {showQuickSelect && (
                                <QuickDateSelector
                                    onSelect={handleQuickSelect}
                                    onClose={() => setShowQuickSelect(false)}
                                />
                            )}
                        </div>

                        <button type="submit" className="customer-search-button">
                            검색
                        </button>
                    </div>
                </form>

                {/* 상태 탭 */}
                <div className="customer-status-tabs">
                    {STATUS_TABS.map((tab) => (
                        <button
                            key={tab.id}
                            className={`customer-tab-button ${
                                searchParams.statusTab === tab.id ? 'active' : ''
                            }`}
                            onClick={() =>
                                setSearchParams((prev) => ({
                                    ...prev,
                                    statusTab: tab.id,
                                }))
                            }
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>

                {/* 결과 건수 */}
                <div className="customer-results-count">총 {filteredStatus.length}건</div>

                {/* 결과 테이블 */}
                <div className="customer-results-table">
                    <table>
                        <thead>
                        <tr>
                            <th>번호</th>
                            <th>차량번호</th>
                            <th>소유자</th>
                            <th>차명</th>
                            <th>업무구분</th>
                            <th>차대번호</th>
                            <th>가격(원)</th>
                            <th>상태</th>
                            <th>신청일시</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredStatus.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="customer-no-data">
                                    검색 결과가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            filteredStatus.map((status, idx) => (
                                <tr
                                    key={status.id}
                                    onClick={() => setSelectedStatus(status)}
                                    className="customer-clickable"
                                >
                                    <td>{idx + 1}</td>
                                    <td>{status.plateNumber}</td>
                                    <td>{status.ownerName}</td>
                                    <td>{status.carName}</td>
                                    <td>{getBusinessTypeName(status.businessType)}</td>
                                    <td>{status.vinNumber}</td>
                                    <td>{Number(status.price).toLocaleString()}</td>
                                    <td>{status.status}</td>
                                    <td>{status.requestDate}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 상세 모달 */}
            {selectedStatus && (
                <StatusDetailModal status={selectedStatus} onClose={() => setSelectedStatus(null)} />
            )}
        </div>
    );
}
