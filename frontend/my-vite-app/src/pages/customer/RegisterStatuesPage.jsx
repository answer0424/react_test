// RegisterStatusPage.jsx
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import StatusDetailModal from '../../components/StatusDetailModal';
import 'react-datepicker/dist/react-datepicker.css';
import '../../assets/css/customer.css';

const dummyStatus = [
    {
        id: 1,
        plateNumber: '12가 3456',
        ownerName: '홍길동',
        businessType: '01',
        price: '30000000',
        vinNumber: 'KMHXX00XXXX000001',
        carName: '그랜저',
        status: '승인 대기',
        requestDate: '2024-03-24',
        coOwner: {
            name: '김영희',
            idNumber: '820101-2******'
        }
    },
    {
        id: 2,
        plateNumber: '34나 7890',
        ownerName: '김철수',
        businessType: '02',
        price: '25000000',
        vinNumber: 'KMHXX00XXXX000002',
        carName: '아반떼',
        status: '승인 완료',
        requestDate: '2024-03-23'
    },
    {
        id: 3,
        plateNumber: '56다 1234',
        ownerName: '이영희',
        businessType: '03',
        price: '45000000',
        vinNumber: 'KMHXX00XXXX000003',
        carName: '제네시스 G80',
        status: '요청',
        requestDate: '2024-03-25'
    },
    {
        id: 4,
        plateNumber: '78라 5678',
        ownerName: '박민수',
        businessType: '01',
        price: '35000000',
        vinNumber: 'KMHXX00XXXX000004',
        carName: '싼타페',
        status: '승인 대기',
        requestDate: '2024-03-22'
    },
    {
        id: 5,
        plateNumber: '90마 9012',
        ownerName: '정수민',
        businessType: '02',
        price: '28000000',
        vinNumber: 'KMHXX00XXXX000005',
        carName: '투싼',
        status: '승인 완료',
        requestDate: '2024-03-21',
        coOwner: {
            name: '정대현',
            idNumber: '880505-1******'
        }
    }
];

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
            <button className="close-button" onClick={onClose}>✕</button>
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
    const filteredStatus = dummyStatus.filter(status => {
        const matchesName = status.ownerName.includes(searchParams.ownerName);
        const matchesPlate = status.plateNumber.includes(searchParams.plateNumber);
        const matchesStatus = searchParams.statusTab === 'all' || status.status.includes(searchParams.statusTab);
        const requestDate = new Date(status.requestDate);
        const isInDateRange = requestDate >= searchParams.startDate && requestDate <= searchParams.endDate;

        return matchesName && matchesPlate && matchesStatus && isInDateRange;
    });

    return (
        <div className="customer-container">
            <div className="customer-content">
                <h1 className="customer-title">번호판 등록 진행 상태</h1>

                <div className="customer-search-filters">
                    <div className="customer-search-row">
                        <input
                            type="text"
                            placeholder="소유자명"
                            value={searchParams.ownerName}
                            onChange={e => setSearchParams({
                                ...searchParams,
                                ownerName: e.target.value
                            })}
                            className="customer-search-input"
                        />
                        <input
                            type="text"
                            placeholder="차량번호"
                            value={searchParams.plateNumber}
                            onChange={e => setSearchParams({
                                ...searchParams,
                                plateNumber: e.target.value
                            })}
                            className="customer-search-input"
                        />
                    </div>
                    <div className="customer-search-row">
                        <div className="customer-date-picker-wrapper">
                            <DatePicker
                                selected={searchParams.startDate}
                                onChange={date => setSearchParams({
                                    ...searchParams,
                                    startDate: date
                                })}
                                selectsStart
                                startDate={searchParams.startDate}
                                endDate={searchParams.endDate}
                                dateFormat="yyyy-MM-dd"
                                className="customer-date-picker"
                            />
                            <span className="customer-date-separator">~</span>
                            <DatePicker
                                selected={searchParams.endDate}
                                onChange={date => setSearchParams({
                                    ...searchParams,
                                    endDate: date
                                })}
                                selectsEnd
                                startDate={searchParams.startDate}
                                endDate={searchParams.endDate}
                                minDate={searchParams.startDate}
                                dateFormat="yyyy-MM-dd"
                                className="customer-date-picker"
                            />
                            <button
                                className="customer-date-select-button"
                                onClick={() => setShowQuickSelect(!showQuickSelect)}
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
                        <button onClick={handleSearch} className="customer-search-button">
                            검색
                        </button>
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

                <div className="customer-results-table">
                    <table>
                        <thead>
                        <tr>
                            <th>번호판</th>
                            <th>소유자</th>
                            <th>상태</th>
                            <th>신청일자</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredStatus.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="customer-no-data">검색 결과가 없습니다.</td>
                            </tr>
                        ) : (
                            filteredStatus.map(status => (
                                <tr
                                    key={status.id}
                                    onClick={() => setSelectedStatus(status)}
                                    className="customer-clickable"
                                >
                                    <td>{status.plateNumber}</td>
                                    <td>{status.ownerName}</td>
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