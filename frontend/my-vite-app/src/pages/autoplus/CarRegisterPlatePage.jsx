import {useState} from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ko from 'date-fns/locale/ko'; // 한국어 로케일 추가

const STATUS_TABS = [
    {id: 'all', label: '전체'},
    {id: 'requested', label: '요청'},
    {id: 'pending', label: '대기'},
    {id: 'completed', label: '완료'}
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
            <button className="close-button" onClick={onClose}>✕</button>
        </div>
    );
};

export default function CarRegisterPlatePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [activeTab, setActiveTab] = useState('all');
    const [searchResults, setSearchResults] = useState([]);
    const [showQuickSelect, setShowQuickSelect] = useState(false);

    // 임시 데모 데이터
    const companies = [
        {id: 1, name: '현대자동차'},
        {id: 2, name: '기아자동차'},
        {id: 3, name: '르노코리아'}
    ];

    const handleSearch = () => {
        // TODO: API 호출 시 모든 검색 조건 포함
        const demoData = [
            {
                plateNumber: '123가4567',
                company: '현대자동차',
                status: '요청',
                registeredAt: '2025-07-25',
                expiresAt: '2025-07-25'
            },
            {
                plateNumber: '234나5678',
                company: '기아자동차',
                status: '대기',
                registeredAt: '2025-03-26',
                expiresAt: '2025-04-26'
            },
            {
                plateNumber: '567다8901',
                company: '현대자동차',
                status: '완료',
                registeredAt: '2025-03-24',
                expiresAt: '2025-04-24'
            },
            {
                plateNumber: '789라2345',
                company: '르노코리아',
                status: '요청',
                registeredAt: '2025-03-27',
                expiresAt: '2025-04-27'
            },
            {
                plateNumber: '345마6789',
                company: '기아자동차',
                status: '완료',
                registeredAt: '2025-03-23',
                expiresAt: '2025-04-23'
            },
            {
                plateNumber: '678바1234',
                company: '르노코리아',
                status: '대기',
                registeredAt: '2025-03-28',
                expiresAt: '2025-04-28'
            },
            {
                plateNumber: '901사3456',
                company: '현대자동차',
                status: '대기',
                registeredAt: '2025-03-29',
                expiresAt: '2025-04-29'
            },
            {
                plateNumber: '234아5678',
                company: '기아자동차',
                status: '요청',
                registeredAt: '2025-03-30',
                expiresAt: '2025-04-30'
            },
            {
                plateNumber: '567자8901',
                company: '르노코리아',
                status: '완료',
                registeredAt: '2025-03-22',
                expiresAt: '2025-04-22'
            },
            {
                plateNumber: '890차2345',
                company: '현대자동차',
                status: '요청',
                registeredAt: '2025-03-31',
                expiresAt: '2025-04-31'
            }
        ];
        setSearchResults(demoData);
    };

    const filteredResults = searchResults.filter(result => {
        // 상태(탭) 필터링
        const statusMatch = activeTab === 'all' ||
            (activeTab === 'requested' && result.status === '요청') ||
            (activeTab === 'pending' && result.status === '대기') ||
            (activeTab === 'completed' && result.status === '완료');

        // 회사 필터링
        const companyMatch = !selectedCompany ||
            result.company === companies.find(c => c.id === parseInt(selectedCompany))?.name;

        // 번호판 검색어 필터링 (부분 일치)
        const plateMatch = !searchTerm ||
            result.plateNumber.toLowerCase().includes(searchTerm.toLowerCase());

        // 날짜 필터링
        const registeredDate = new Date(result.registeredAt);
        const dateMatch = registeredDate >= startDate.setHours(0, 0, 0, 0) &&
            registeredDate <= endDate.setHours(23, 59, 59, 999);

        return statusMatch && companyMatch && plateMatch && dateMatch;
    });

    const handleQuickSelect = (start, end) => {
        setStartDate(start);
        setEndDate(end);
        setShowQuickSelect(false);
    };

    return (
        <div id="plate-status-container">
            <div id="plate-status-content">
                <h1 id="plate-status-title">번호판 등록 상태 조회</h1>

                <div id="search-filters">
                    <div className="search-row">
                        <input
                            type="text"
                            placeholder="번호판 번호 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <select
                            value={selectedCompany}
                            onChange={(e) => setSelectedCompany(e.target.value)}
                            className="company-select"
                        >
                            <option value="">고객사 선택</option>
                            {companies.map(company => (
                                <option key={company.id} value={company.id}>
                                    {company.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="search-row">
                        <div className="date-picker-wrapper">
                            <DatePicker
                                selected={startDate}
                                onChange={date => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                dateFormat="yyyy-MM-dd"
                                locale={ko}
                                className="date-picker"
                            />
                            <span className="date-separator">~</span>
                            <DatePicker
                                selected={endDate}
                                onChange={date => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                dateFormat="yyyy-MM-dd"
                                locale={ko}
                                className="date-picker"
                            />
                            <button
                                className="date-select-button"
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
                        <button onClick={handleSearch} className="search-button">
                            검색
                        </button>
                    </div>
                </div>

                <div id="status-tabs">
                    {STATUS_TABS.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div id="results-table">
                    <table>
                        <thead>
                        <tr>
                            <th>번호판</th>
                            <th>고객사</th>
                            <th>상태</th>
                            <th>요청일</th>
                            <th>등록일</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredResults.map((result, index) => (
                            <tr key={index}>
                                <td>{result.plateNumber}</td>
                                <td>{result.company}</td>
                                <td>{result.status}</td>
                                <td>{result.expiresAt}</td>
                                <td>{result.registeredAt}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}