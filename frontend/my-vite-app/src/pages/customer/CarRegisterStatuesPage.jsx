// RegisterStatusPage.jsx
import {useEffect, useState} from 'react';
import DatePicker from 'react-datepicker';
import StatusDetailModal from '../../components/StatusDetailModal';
import 'react-datepicker/dist/react-datepicker.css';
import '../../assets/css/customer.css';
import {dummyStatusData} from "../../services/CarRegisterDummyData.jsx";
import {useUser} from "../../contexts/UserProvider.jsx";
import {useNavigate} from "react-router-dom";
import LoginRequiredModal from "../../components/UserInfoRequiredModal.jsx";


// 업무구분 코드와 이름 매핑
const businessTypes = {
    '01': '렌트',
    '02': '리스',
    '03': '개인'
};

// 업무구분 코드를 이름으로 변환하는 함수
export const getBusinessTypeName = (code) => {
    return businessTypes[code] || '';
};

const statusTabs = [
    { id: 'all', name: '전체' },
    { id: '요청', name: '요청' },
    { id: '승인 대기', name: '대기' },
    { id: '승인 완료', name: '승인' }
];

const QuickDateSelector = ({ onSelect, onClose }) => {
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
            <button onClick={() => onSelect(getDate(990), new Date())}>3개월전</button>
        </div>
    );
};


export default function RegisterStatusPage() {
    const [searchParams, setSearchParams] = useState({
        ownerName: '',
        plateNumber: '',
        startDate: new Date(),
        endDate: new Date(),
        statusTab: 'all'
    });
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [showQuickSelect, setShowQuickSelect] = useState(false);
    const {user} = useUser();
    const [userInfoRequiredModalOpen, setUserInfoRequiredModalOpen] = useState(false);
    const navigate = useNavigate();
    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const [startDate, endDate] = dateRange;

    useEffect(() => {
        if (!user) {
            setUserInfoRequiredModalOpen(true);
        }
    }, [user, navigate]);

    if (!user || !user.username) {
        return <LoginRequiredModal open={userInfoRequiredModalOpen}/>;
    }

    const handleSearch = (e) => {
        e.preventDefault();
        // TODO: 검색 로직 구현
        console.log('Search params:', searchParams);
    };

    const handleQuickSelect = (start, end) => {
        setSearchParams({
            ...searchParams,
            startDate: start,
            endDate: end
        });
        setShowQuickSelect(false);
    };

    // status 필터링 로직 추가
    const filteredStatus = dummyStatusData.filter(status => {
        const matchesName = status.ownerName.includes(searchParams.ownerName);
        const matchesPlate = status.plateNumber.includes(searchParams.plateNumber);
        const matchesStatus = searchParams.statusTab === 'all' || status.status.includes(searchParams.statusTab);
        const requestDate = new Date(status.requestDate);
        const isInDateRange =  requestDate >= searchParams.startDate.setHours(0, 0, 0, 0) &&
            requestDate <= searchParams.endDate.setHours(23, 59, 59, 999);

        return matchesName && matchesPlate && matchesStatus && isInDateRange;
    });

    return (
        <div className="customer-container">
            <div className="customer-content">
                <h1 className="customer-title">자동차 신규 등록 상태</h1>

                <div className="customer-search-filters">
                    <div className="customer-search-row">
                        <input
                            type="text"
                            placeholder="소유자명"
                            value={searchParams.ownerName}
                            onChange={e => setSearchParams({...searchParams, ownerName: e.target.value})}
                            className="customer-search-input"
                        />
                        <input
                            type="text"
                            placeholder="차량번호"
                            value={searchParams.plateNumber}
                            onChange={e => setSearchParams({...searchParams, plateNumber: e.target.value})}
                            className="customer-search-input"
                        />
                        <div className="customer-date-picker-wrapper">
                            <DatePicker
                                selected={searchParams.startDate}
                                onChange={date => setSearchParams({...searchParams, startDate: date})}
                                selectsStart
                                startDate={searchParams.startDate}
                                endDate={searchParams.endDate}
                                dateFormat="yyyy-MM-dd"
                                className="customer-date-picker"
                             showMonthYearDropdown/>
                            <span className="customer-date-separator">~</span>
                            <DatePicker
                                selected={searchParams.endDate}
                                onChange={date => setSearchParams({...searchParams, endDate: date})}
                                selectsEnd
                                startDate={searchParams.startDate}
                                endDate={searchParams.endDate}
                                minDate={searchParams.startDate}
                                dateFormat="yyyy-MM-dd"
                                className="customer-date-picker"
                             showMonthYearDropdown/>
                            <button className="customer-date-select-button" onClick={() => setShowQuickSelect(!showQuickSelect)}>
                                날짜선택
                            </button>
                            {showQuickSelect && (
                                <QuickDateSelector
                                    onSelect={handleQuickSelect}
                                    onClose={() => setShowQuickSelect(false)}
                                />
                            )}
                        </div>
                        <button onClick={handleSearch} className="customer-search-button">검색</button>
                    </div>
                </div>

                <div className="customer-status-tabs">
                    {statusTabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`customer-tab-button ${searchParams.statusTab === tab.id ? 'active' : ''}`}
                            onClick={() => setSearchParams({
                                ...searchParams,
                                statusTab: tab.id
                            })}
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>
                <div className="customer-results-count">
                    총 {filteredStatus.length}건
                </div>
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
                                <td colSpan="9" className="customer-no-data">검색 결과가 없습니다.</td>
                            </tr>
                        ) : (
                            filteredStatus.map((status, index) => (
                                <tr
                                    key={status.id}
                                    onClick={() => setSelectedStatus(status)}
                                    className="customer-clickable"
                                >
                                    <td>{index + 1}</td>
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

            {selectedStatus && (
                <StatusDetailModal
                    status={selectedStatus}
                    onClose={() => setSelectedStatus(null)}
                />
            )}
        </div>
    );
}